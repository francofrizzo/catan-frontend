import DevelopmentCard from "@/models/DevelopmentCard";
import Resource from "@/models/Resource";

export default interface PrivatePlayerState {
  id: number;
  allDevelopmentCards: DevelopmentCard[];
  resources: Record<Resource, number>;
  totalVictoryPoints: number;
}
