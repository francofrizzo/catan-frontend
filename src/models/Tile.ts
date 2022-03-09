import Resource from "@/models/Resource";

export default interface Tile {
  id: number;
  number: number | null;
  resource: Resource | null;
  corners: number[];
  isDesert: boolean;
  hasThief: boolean;
}
