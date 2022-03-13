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
import Corner from "@/models/Corner";
import Tile from "@/models/Tile";
import Player from "@/models/Player";

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
    tileRecievingThief: null as number | null,
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

  public get isDebug(): boolean {
    return this.gameState?.started === true && this.gameState.isDebug === true;
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
      const newState = await api.getGameState(this.gameId);
      this.setGameState(newState);
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

  public async switchActivePlayer(playerId: number): Promise<void> {
    const newState = await api.switchActivePlayer(this.gameId, playerId);
    this.setGameState(newState);
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

  public async trade(
    resourceGiven: Resource,
    resourceTaken: Resource
  ): Promise<void> {
    await this.executeAction("Trade", { resourceGiven, resourceTaken });
  }

  public startMovingThief(): void {
    this.state.boardState = "moving-thief";
  }

  public get isMovingThief(): boolean {
    return this.state.boardState === "moving-thief";
  }

  public getStealablePlayers(tile: Tile): number[] {
    return Array.from(
      new Set(
        tile.corners.map(
          (cornerId) => this.getCorner(cornerId)?.construction?.player
        )
      )
    ).filter(
      (id) =>
        id !== undefined &&
        id !== this.activePlayerId &&
        this.getPlayer(id)!.resourcesCount! > 0
    ) as number[];
  }

  public setTileRecievingThief(tileId: number): void {
    this.state.tileRecievingThief = tileId;
  }

  public get tileRecievingThief(): number | null {
    return this.state.tileRecievingThief;
  }

  public async moveThief(
    tileId: number,
    stealFromPlayerId: number | null = null
  ): Promise<void> {
    this.state.boardState = "normal";
    this.state.tileRecievingThief = null;
    await this.executeAction("MoveThief", {
      tile: tileId,
      stealFrom: stealFromPlayerId,
    });
  }

  public getTile(tileId: number): Tile | undefined {
    if (this.gameState?.started) {
      return this.gameState.board.tiles.find((tile) => tile.id === tileId);
    }
  }

  public getCorner(cornerId: number): Corner | undefined {
    if (this.gameState?.started) {
      return this.gameState.board.corners.find(
        (corner) => corner.id === cornerId
      );
    }
  }

  public getPlayer(
    playerId: number
  ): (Partial<Player> & { id: number; name: string }) | undefined {
    if (this.gameState) {
      return this.gameState.players.find((player) => player.id === playerId);
    }
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

  private async setGameState(newGameState: GameState) {
    const shouldPersist = await this.autoExecuteActions(newGameState);

    if (shouldPersist) {
      const oldGameState = this.state.gameState;
      this.state.gameState = newGameState;

      const oldTurnPlayer = oldGameState?.started
        ? oldGameState.currentTurn.player
        : null;
      const newTurnPlayer = newGameState.started
        ? newGameState.currentTurn.player
        : null;
      if (
        newTurnPlayer !== null &&
        newTurnPlayer !== oldTurnPlayer &&
        newTurnPlayer !== this.activePlayerId
      ) {
        await this.switchActivePlayer(newTurnPlayer);
      }
    }
  }

  private async autoExecuteActions(newGameState: GameState): Promise<boolean> {
    if (
      newGameState?.started &&
      newGameState.currentPlayer?.id !== null &&
      newGameState.currentPlayer?.id === newGameState.currentTurn.player &&
      newGameState.availableActions?.length === 1
    ) {
      const onlyAvailableAction = newGameState.availableActions[0];
      if (onlyAvailableAction === "Pass") {
        await this.executeAction("Pass");
        return false;
      } else if (onlyAvailableAction === "BuildRoad") {
        this.startBuildingRoad();
      } else if (onlyAvailableAction === "BuildSettlement") {
        this.startBuildingSettlement();
      }
    }
    return true;
  }

  public subscribeToUpdates() {
    websocketsApi.subscribeToUpdates(this.gameId, ({ state }) => {
      this.setGameState(state);
    });
  }
}

export default GameInterface;
