import Resource from "@/models/Resource";

export default interface Port {
  exchangeRate: number;
  accepts: Resource[];
}
