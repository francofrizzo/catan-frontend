import Board from "@/models/Board";
import Player from "@/models/Player";
import Turn from "@/models/Turn";

export default interface Game {
  board: Board;
  players: Player[];
  developmentCardsInDeck: number;
  currentTurn: Turn;
  winner: number | null;
}
