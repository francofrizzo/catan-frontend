import Resource from "@/models/Resource";

type ResourceCollection = { [K in Resource]?: number };

export type ActionRegistry = {
  RollDice: {
    jsonArguments: Record<string, never>;
  };
  BuildRoad: {
    jsonArguments: { corners: [number, number] };
  };
  BuildSettlement: {
    jsonArguments: { corner: number };
  };
  BuildCity: {
    jsonArguments: { corner: number };
  };
  BuyDevelopmentCard: {
    jsonArguments: Record<string, never>;
  };
  PlayDevelopmentCard: {
    jsonArguments: { card: number };
  };
  Collect: {
    jsonArguments: { resources: ResourceCollection };
  };
  Discard: {
    jsonArguments: { resources: ResourceCollection };
  };
  Exchange: {
    jsonArguments: {
      otherPlayer: number;
      resourcesGiven: ResourceCollection;
      resourcesTaken: ResourceCollection;
    };
  };
  Trade: {
    jsonArguments: { resourceGiven: Resource; resourceTaken: Resource };
  };
  MoveThief: {
    jsonArguments: { tile: number; stealFrom: number | null };
  };
  Pass: {
    jsonArguments: Record<string, never>;
  };
};

export type Action = keyof ActionRegistry;

export type ActionArguments<A extends Action> =
  ActionRegistry[A]["jsonArguments"];

export default Action;
