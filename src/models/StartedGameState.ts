import Action from "@/models/Action";
import PrivatePlayerState from "@/models/PrivatePlayerState";
import PublicGameState from "@/models/PublicGameState";

export type StartedGamePublicState = {
  started: true;
} & PublicGameState & {
    currentPlayer: undefined;
    availableActions: undefined;
  };

export type StartedGamePrivateState = {
  started: true;
} & PublicGameState & {
    currentPlayer: PrivatePlayerState;
    availableActions: Action[];
  };

export type StartedGameState = StartedGamePublicState | StartedGamePrivateState;

export default StartedGameState;
