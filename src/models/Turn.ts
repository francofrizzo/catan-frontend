export default interface Turn {
  player: number;
  diceRoll: number | null;
  eachDiceRoll: [number, number] | null;
}
