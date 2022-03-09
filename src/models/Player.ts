import DevelopmentCard from "@/models/DevelopmentCard";
import AchievementToken from "@/models/AchievementToken";

export default interface Player {
  id: number;
  name: string;
  playedDevelopmentCards: DevelopmentCard[];
  developmentCardCount: number;
  achievementTokens: AchievementToken[];
  resourcesCount: number;
  visibleVictoryPoints: number;
  longestRoute: [number, number][];
}
