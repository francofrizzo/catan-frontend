import Port from "@/models/Port";
import Construction from "@/models/Construction";

export default interface Corner {
  id: number;
  adjacentCorners: number[];
  adjacentTiles: number[];
  roads: { to: number; player: number }[];
  port: Port | null;
  construction: Construction | null;
}
