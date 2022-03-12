import GameInterface from "@/game/GameInterface";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    game: GameInterface;
  }
}
