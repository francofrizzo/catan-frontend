import Tile from "@/models/Tile";
import Corner from "@/models/Corner";
import Road from "@/models/Road";

export default interface Board {
  tiles: Tile[];
  corners: Corner[];
  roads: Road[];
}
