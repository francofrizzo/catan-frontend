import Action from "@/models/Action";
import PublicGameState from "@/models/PublicGameState";
import PrivatePlayerState from "@/models/PrivatePlayerState";

export default interface PrivateGameState {
  publicState: PublicGameState;
  privateState: PrivatePlayerState;
  availableActions: Action[];
}
