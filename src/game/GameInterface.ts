import { reactive } from "vue";
import toastr from "toastr";
import axios from "axios";

import * as api from "@/api/actions";
import * as websocketsApi from "@/api/websocket";
import { ErrorReason, getErrorMessage } from "@/api/errorMessages";

import Action, { ActionArguments } from "@/models/Action";
import GameState from "@/models/GameState";
import Resource from "@/models/Resource";
import PrivatePlayerState from "@/models/PrivatePlayerState";
import PublicGameState from "@/models/PublicGameState";

export type BoardState =
  | "normal"
  | "building-settlement"
  | "building-city"
  | "building-road"
  | "moving-thief";

export class GameInterface {
  private state = reactive({
    gameState: null as GameState | null,
    boardState: "normal" as BoardState,
  });

  constructor(public gameId: string) {}

  public get gameState(): GameState | null {
    return this.state.gameState;
  }

  public get players(): GameState["players"] {
    return this.state.gameState?.players ?? [];
  }

  public get activePlayerId(): number | null {
    return this.state.gameState?.currentPlayer?.id ?? null;
  }

  public get currentTurnPlayerId(): number | null {
    return this.state.gameState?.started
      ? this.state.gameState.currentTurn.player
      : null;
  }

  public get playerIds(): number[] {
    return this.gameState?.players.map(({ id }) => id) ?? [];
  }

  public get started(): boolean {
    return this.gameState?.started ?? false;
  }

  public get publicState(): PublicGameState | null {
    return this.gameState?.started ? this.gameState : null;
  }

  public get privateState(): PrivatePlayerState | null {
    return this.gameState?.started
      ? this.gameState.currentPlayer ?? null
      : null;
  }

  public get availableActions(): Action[] {
    return this.gameState?.started ? this.gameState.availableActions ?? [] : [];
  }

  public async updateState(): Promise<void> {
    try {
      await api.getGameState(this.gameId);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (
          err.response?.data.reason &&
          err.response.data.reason === "GAME_NOT_FOUND"
        ) {
          throw new Error("GAME_NOT_FOUND");
        } else {
          toastr.error("¡Ups! Algo salió mal.");
        }
      }
    }
  }

  public async rollDice(): Promise<void> {
    await this.executeAction("RollDice");
  }

  public async pass(): Promise<void> {
    await this.executeAction("Pass");
  }

  public startBuildingSettlement(): void {
    this.state.boardState = "building-settlement";
  }

  public get isBuildingSettlement(): boolean {
    return this.state.boardState === "building-settlement";
  }

  public async buildSettlement(cornerId: number): Promise<void> {
    this.state.boardState = "normal";
    await this.executeAction("BuildSettlement", { corner: cornerId });
  }

  public startBuildingCity(): void {
    this.state.boardState = "building-city";
  }

  public get isBuildingCity(): boolean {
    return this.state.boardState === "building-city";
  }

  public async buildCity(cornerId: number): Promise<void> {
    this.state.boardState = "normal";
    await this.executeAction("BuildCity", { corner: cornerId });
  }

  public startBuildingRoad(): void {
    this.state.boardState = "building-road";
  }

  public get isBuildingRoad(): boolean {
    return this.state.boardState === "building-road";
  }

  public async buildRoad(cornerIds: [number, number]): Promise<void> {
    this.state.boardState = "normal";
    await this.executeAction("BuildRoad", { corners: cornerIds });
  }

  public async collectResource(resource: Resource): Promise<void> {
    await this.executeAction("Collect", { resources: { [resource]: 1 } });
  }

  public async discardResource(resource: Resource): Promise<void> {
    await this.executeAction("Discard", { resources: { [resource]: 1 } });
  }

  public async buyDevelopmentCard(): Promise<void> {
    await this.executeAction("BuyDevelopmentCard");
  }

  public async playDevelopmentCard(cardId: number): Promise<void> {
    await this.executeAction("PlayDevelopmentCard", { card: cardId });
  }

  public startMovingThief(): void {
    this.state.boardState = "moving-thief";
  }

  public get isMovingThief(): boolean {
    return this.state.boardState === "moving-thief";
  }

  public async moveThief(
    tileId: number,
    stealFromPlayerId: number | null = null
  ): Promise<void> {
    this.state.boardState = "normal";
    await this.executeAction("MoveThief", {
      tile: tileId,
      stealFrom: stealFromPlayerId,
    });
  }

  public async executeAction<A extends Action>(
    actionKey: A,
    args: ActionArguments<A> = {}
  ) {
    if (this.activePlayerId !== null) {
      try {
        await api.executeGameAction(
          this.gameId,
          this.activePlayerId,
          actionKey,
          args
        );
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          let errorMessage = "¡Ups! Algo salió mal.";
          if (err.response?.data.reason) {
            errorMessage = getErrorMessage(
              err.response?.data.reason as ErrorReason,
              actionKey,
              args
            );
          }
          toastr.error(errorMessage);
        }
      }
    } else {
      throw new Error("Cannot execute action: there is no active player");
    }
  }

  private setGameState(newGameState: GameState) {
    this.state.gameState = newGameState;
    this.autoExecuteActions();
  }

  private async autoExecuteActions() {
    if (
      this.gameState?.started &&
      this.activePlayerId !== null &&
      this.activePlayerId === this.currentTurnPlayerId &&
      this.availableActions.length === 1
    ) {
      const onlyAvailableAction = this.availableActions[0];
      if (onlyAvailableAction === "Pass") {
        await this.executeAction("Pass");
      } else if (onlyAvailableAction === "BuildRoad") {
        this.startBuildingRoad();
      } else if (onlyAvailableAction === "BuildSettlement") {
        this.startBuildingSettlement();
      }
    }
  }

  public subscribeToUpdates() {
    websocketsApi.subscribeToUpdates(this.gameId, ({ state }) =>
      this.setGameState(state)
    );
  }
}

export default GameInterface;
