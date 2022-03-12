type NotStartedGameCommonState = {
  started: false;
  players: Array<{ id: number; name: string }>;
};

export type NotStartedGamePublicState = NotStartedGameCommonState & {
  currentPlayer: undefined;
};

export type NotStartedGamePrivateState = NotStartedGameCommonState & {
  currentPlayer: { id: number };
};

export type NotStartedGameState =
  | NotStartedGamePublicState
  | NotStartedGamePrivateState;

export default NotStartedGameState;
