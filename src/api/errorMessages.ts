import { getResourceName } from "@/lang";
import Action, { ActionArguments } from "@/models/Action";
import Resource from "@/models/Resource";

function hasKey<K extends PropertyKey>(
  obj: Record<PropertyKey, unknown>,
  key: K
): obj is Record<
  K,
  string | number | boolean | symbol | bigint | object | null
> {
  return (
    Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined
  );
}

enum GameplayErrorReason {
  CornersNotAdjacent = "CORNERS_NOT_ADJACENT",
  CornerDoesntBelongToRoad = "CORNER_DOESNT_BELONG_TO_ROAD",
  UndefinedDevelopmentCardArguments = "UNDEFINED_DEVELOPMENT_CARD_ARGUMENTS",
  AchievementTokenNotOwnedByPlayer = "ACHIEVEMENT_TOKEN_NOT_OWNED_BY_PLAYER",
  InvalidTileId = "INVALID_TILE_ID",
  InvalidCornerId = "INVALID_CORNER_ID",
  InvalidPlayerId = "INVALID_PLAYER_ID",
  InvalidDevelopmentCardId = "INVALID_DEVELOPMENT_CARD_ID",
  EmptyDeck = "EMPTY_DECK",
  NoDesertTile = "NO_DESERT_TILE",
  VictoryPointCardIsNotPlayable = "VICTORY_POINT_CARD_IS_NOT_PLAYABLE",
  DiceNotRolled = "DICE_NOT_ROLLED",
  NotEnoughResources = "NOT_ENOUGH_RESOURCES",
}

enum FailedCheckReason {
  CornersNotAdjacent = "CORNERS_NOT_ADJACENT",
  EdgeOccupied = "EDGE_OCCUPIED",
  DisconnectedEdge = "DISCONNECTED_EDGE",
  DisconnectedCorner = "DISCONNECTED_CORNER",
  CornerOccupiedByOtherPlayer = "CORNER_OCCUPIED_BY_OTHER_PLAYER",
  CornerOccupied = "CORNER_OCCUPIED",
  CornerAdjacentToOccupiedCorner = "CORNER_ADJACENT_TO_OCCUPIED_CORNER",
  CornerWithoutSettlement = "CORNER_WITHOUT_SETTLEMENT",
  ThiefIsAlreadyInTile = "THIEF_IS_ALREADY_IN_TILE",
  PlayerCantStealFromThemselves = "PLAYER_CANT_STEAL_FROM_THEMSELVES",
  CannotStealFromThatPlayer = "CANNOT_STEAL_FROM_THAT_PLAYER",
  MustStealFromSomePlayer = "MUST_STEAL_FROM_SOME_PLAYER",
  CardAlreadyPlayed = "CARD_ALREADY_PLAYED",
  CardHasNoHolder = "CARD_HAS_NO_HOLDER",
  CardDrawnInThisTurn = "CARD_DRAWN_IN_THIS_TURN",
  UndefinedDestinyTile = "UNDEFINED_DESTINY_TILE",
  UndefinedMonopolyResource = "UNDEFINED_MONOPOLY_RESOURCE",
  UndefinedRoadBuildingCorners = "UNDEFINED_ROAD_BUILDING_CORNERS",
  VictoryPointCardIsNotPlayable = "VICTORY_POINT_CARD_IS_NOT_PLAYABLE",
  UndefinedYearOfPlentyResources = "UNDEFINED_YEAR_OF_PLENTY_RESOURCES",
  EmptyDeck = "EMPTY_DECK",
  NotEnoughResources = "NOT_ENOUGH_RESOURCES",
  SameOriginAndDestinyPlayer = "SAME_ORIGIN_AND_DESTINY_PLAYER",
  NoResourcesGiven = "NO_RESOURCES_GIVEN",
  NoResourcesTaken = "NO_RESOURCES_TAKEN",
  DestinyPlayerNotEnoughResources = "DESTINY_PLAYER_NOT_ENOUGH_RESOURCES",
  CardNotOwnedByPlayer = "CARD_NOT_OWNED_BY_PLAYER",
  RoadAlreadyBuilt = "ROAD_ALREADY_BUILT",
  SettlementNotBuilt = "SETTLEMENT_NOT_BUILT",
  RoadAndSettlementNotAdjacent = "ROAD_AND_SETTLEMENT_NOT_ADJACENT",
  SettlementAlreadyBuilt = "SETTLEMENT_ALREADY_BUILT",
  RoadNotBuilt = "ROAD_NOT_BUILT",
  NotAllowedInThisTurn = "NOT_ALLOWED_IN_THIS_TURN",
  DiceAlreadyRolled = "DICE_ALREADY_ROLLED",
  ResourcesNotAvailable = "RESOURCES_NOT_AVAILABLE",
  ResourcesNotDiscardable = "RESOURCES_NOT_DISCARDABLE",
  DiceRollIsNot7 = "DICE_ROLL_IS_NOT_7",
  ThiefAlreadyMoved = "THIEF_ALREADY_MOVED",
  DiceNotRolled = "DICE_NOT_ROLLED",
  ResourcesNotDiscarded = "RESOURCES_NOT_DISCARDED",
  ThiefNotMoved = "THIEF_NOT_MOVED",
  TurnFinished = "TURN_FINISHED",
  OtherPlayersTurn = "OTHER_PLAYERS_TURN",
  DevelopmentCardAlreadyPlayedInTurn = "DEVELOPMENT_CARD_ALREADY_PLAYED_IN_TURN",
}

export type ErrorReason = GameplayErrorReason | FailedCheckReason;

type ErrorMessageGetter = <A extends Action>(
  action: A,
  args: ActionArguments<A>
) => string;

const errorMessages: {
  [key in ErrorReason]?: ErrorMessageGetter;
} = {
  DISCONNECTED_EDGE: () =>
    "El camino debe ser adyacente a alguna de tus construcciones.",
  CORNER_ADJACENT_TO_OCCUPIED_CORNER: () =>
    "No puedes construir en una posición adyacente a una posición ya ocupada.",
  RESOURCES_NOT_AVAILABLE: (_, args) => {
    if (hasKey(args, "resources")) {
      const resourcesRequested = (
        Object.entries(args.resources) as [Resource, number][]
      ).filter(([, quantity]) => quantity > 0);
      if (resourcesRequested.length === 1 && resourcesRequested[0][1] === 1) {
        return `No tienes ${getResourceName(
          resourcesRequested[0][0]
        )} disponible para recoger en este momento.`;
      }
    }
    return "No tienes suficiente de esos recursos para recoger en este momento.";
  },
  RESOURCES_NOT_DISCARDABLE: () =>
    "No debes descartar recursos en este momento.",
  NOT_ALLOWED_IN_THIS_TURN: () =>
    "Esa acción no está permitida en este momento del juego.",
};

export const getErrorMessage = <A extends Action>(
  errorReason: ErrorReason,
  action: A,
  args: ActionArguments<A>
) => {
  if (hasKey(errorMessages, errorReason)) {
    return errorMessages[errorReason](action, args);
  } else {
    return `Ocurrió un error: ${errorReason}`;
  }
};
