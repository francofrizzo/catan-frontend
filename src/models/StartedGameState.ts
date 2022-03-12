import Action from "@/models/Action";
import PrivatePlayerState from "@/models/PrivatePlayerState";
import PublicGameState from "@/models/PublicGameState";

export type StartedGamePublicState = {
  started: true;
} & PublicGameState & {
    currentPlayer: undefined;
    availableActions: undefined;
    isDebug?: true;
  };

export type StartedGamePrivateState = {
  started: true;
} & PublicGameState & {
    currentPlayer: PrivatePlayerState;
    availableActions: Action[];
    isDebug?: true;
  };

export type StartedGameState = StartedGamePublicState | StartedGamePrivateState;

export default StartedGameState;
