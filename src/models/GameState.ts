import NotStartedGameState from "@/models/NotStartedGameState";
import StartedGameState from "@/models/StartedGameState";

export type GameState = NotStartedGameState | StartedGameState;

export default GameState;
