import { reactive } from "vue";
import toastr from "toastr";
import axios from "axios";

import * as api from "@/api/actions";
import * as websocketsApi from "@/api/websocket";
import { getErrorMessage } from "@/api/errorMessages";

import Action, { ActionArguments } from "@/models/Action";
import PublicGameState from "@/models/PublicGameState";
import PrivateGameState from "@/models/PrivateGameState";
import PrivatePlayerState from "@/models/PrivatePlayerState";
import Resource from "@/models/Resource";

type ActionArgs = [
  string,
  "string" | "number" | [string | number, "string" | "number"][]
][];

export type BoardState =
  | "normal"
  | "building-settlement"
  | "building-city"
  | "building-road"
  | "moving-thief";

export class GameInterface {
  private state = reactive({
    gameId: null as string | null,
    publicState: null as PublicGameState | null,
    privateState: {} as Record<number, PrivateGameState>,
    activePlayerId: 0,
    boardState: "normal" as BoardState,
  });

  constructor() {
    this.create();
  }

  private get gameId(): string | null {
    return this.state.gameId;
  }

  public get publicState(): PublicGameState | null {
    return this.state.publicState;
  }

  public get playerIds(): number[] {
    return this.publicState?.players.map(({ id }) => id) ?? [];
  }

  public get activePlayerId(): number {
    return this.state.activePlayerId;
  }

  public get privateState(): PrivatePlayerState | null {
    return this.state.privateState[this.activePlayerId]?.privateState ?? null;
  }

  public get availableActions(): Action[] {
    return this.state.privateState[this.activePlayerId]?.availableActions ?? [];
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

  public get actions(): {
    [key in Action]?: { available: boolean; args: ActionArgs };
  } {
    const availableActions = this.availableActions;
    return {
      Exchange: {
        available: availableActions.includes("Exchange"),
        args: [
          ["otherPlayer", "number"],
          [
            "resourcesGiven",
            [
              ["Lumber", "number"],
              ["Ore", "number"],
              ["Grain", "number"],
              ["Brick", "number"],
              ["Wool", "number"],
            ],
          ],
          [
            "resourcesTaken",
            [
              ["Lumber", "number"],
              ["Ore", "number"],
              ["Grain", "number"],
              ["Brick", "number"],
              ["Wool", "number"],
            ],
          ],
        ],
      },
      Trade: {
        available: availableActions.includes("Trade"),
        args: [
          ["resourceGiven", "string"],
          ["resourceTaken", "string"],
        ],
      },
    };
  }

  public async executeAction<A extends Action>(
    actionKey: A,
    args: ActionArguments<A> = {}
  ) {
    if (this.gameId) {
      try {
        await api.executeGameAction(
          this.gameId,
          this.activePlayerId,
          actionKey,
          args
        );
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          let errorMessage = "¡Ups! Algo salió mal.";
          if (err.response?.data) {
            const match = (err.response?.data as string).match(
              /^Error (executing action: |parsing arguments)Error: (.*)/
            );
            if (match) {
              errorMessage = getErrorMessage(match[2]);
            }
          }
          toastr.error(errorMessage);
        }
      }
    } else {
      throw new Error("Cannot execute action: game id is not defined");
    }
  }

  public async executeActionLegacy(actionKey: Action, args: any) {
    const action = this.actions[actionKey];
    const convertedArgs: any = {};
    action!.args.forEach(([arg, argType]) => {
      if (argType === "string") {
        convertedArgs[arg] = args[arg];
      } else if (argType === "number") {
        convertedArgs[arg] = parseInt(args[arg]);
      } else {
        const isArray = argType.some(([arg]) => typeof arg === "number");
        if (isArray) {
          convertedArgs[arg] = [];
          argType.forEach(([subarg, subargType]) => {
            convertedArgs[arg].push(
              subargType === "string"
                ? args[`${arg}:${subarg}`]
                : parseInt(args[`${arg}:${subarg}`])
            );
          });
        } else {
          convertedArgs[arg] = {};
          argType.forEach(([subarg, subargType]) => {
            convertedArgs[arg][subarg] =
              subargType === "string"
                ? args[`${arg}:${subarg}`]
                : parseInt(args[`${arg}:${subarg}`]);
          });
        }
      }
    });
    await this.executeAction(actionKey, convertedArgs);
  }

  public switchActivePlayer(playerId: number) {
    this.state.activePlayerId = playerId;
  }

  private async create() {
    this.state.gameId = await api.createGame();
    await this.updateState();
    this.subscribeToPublicUpdates();
    this.subscribeToAllPrivateUpdates();
  }

  private setPublicState(newState: PublicGameState) {
    const oldState = this.publicState;
    this.state.publicState = newState;
    if (!oldState || oldState.currentTurn.player === this.activePlayerId) {
      this.switchActivePlayer(newState.currentTurn.player);
    }
  }

  private async setPrivateState(playerId: number, newState: PrivateGameState) {
    this.state.privateState[playerId] = newState;
    if (
      playerId === this.activePlayerId &&
      newState.availableActions.length === 1
    ) {
      const onlyAvailableAction = newState.availableActions[0];
      if (onlyAvailableAction === "Pass") {
        await this.executeAction("Pass");
      } else if (onlyAvailableAction === "BuildRoad") {
        this.startBuildingRoad();
      } else if (onlyAvailableAction === "BuildSettlement") {
        this.startBuildingSettlement();
      }
    }
  }

  private subscribeToPublicUpdates() {
    if (this.state.gameId) {
      websocketsApi.subscribeToPublicUpdates(this.state.gameId, (newState) =>
        this.setPublicState(newState)
      );
    } else {
      throw new Error(
        "Cannot subscribe to public game updates: game id is not defined"
      );
    }
  }

  private subscribeToPrivateUpdates(playerId: number) {
    if (this.state.gameId) {
      websocketsApi.subscribeToPrivateUpdates(
        this.state.gameId,
        playerId,
        (newState) => this.setPrivateState(playerId, newState)
      );
    } else {
      throw new Error(
        "Cannot subscribe to public game updates: game id is not defined"
      );
    }
  }

  private async subscribeToAllPrivateUpdates() {
    if (this.publicState) {
      await Promise.all(
        this.publicState.players.map(({ id }) =>
          this.subscribeToPrivateUpdates(id)
        )
      );
    } else {
      throw new Error(
        "Cannot subscribe to private game updates for all players: public game state is not defined"
      );
    }
  }

  private async updateState() {
    await this.updatePublicState();
    await this.updateAllPrivateStates();
  }

  private async updatePublicState() {
    if (this.gameId) {
      const newState = await api.getGamePublicState(this.gameId);
      this.setPublicState(newState);
    } else {
      throw new Error("Cannot get public game state: game id is not defined");
    }
  }

  private async updatePrivateState(playerId: number) {
    if (this.gameId) {
      const newState = await api.getGamePrivateState(this.gameId, playerId);
      await this.setPrivateState(playerId, newState);
    } else {
      throw new Error("Cannot get private game state: game id is not defined");
    }
  }

  private async updateAllPrivateStates() {
    if (this.publicState) {
      await Promise.all(
        this.publicState.players.map(({ id }) => this.updatePrivateState(id))
      );
    } else {
      throw new Error(
        "Cannot get private game state for all players: public game state is not defined"
      );
    }
  }
}

export default GameInterface;
