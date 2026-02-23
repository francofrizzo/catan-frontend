<template>
  <template v-if="!assetsLoaded"
    ><div class="loading">Cargando...</div></template
  >
  <div class="playtable" v-else-if="gameState">
    <div class="winner" :class="`winner-${winner.id}`" v-if="winner !== null">
      <player-picture :player="winner" />
      <div class="winner-name">{{ winner.name }}</div>
      <div>ganó la partida</div>
    </div>
    <board />
    <player-area
      v-if="playerIds.length >= 1"
      :player-id="playerIds[0]"
      position="top-left"
    />
    <player-area
      v-if="playerIds.length >= 2"
      :player-id="playerIds[1]"
      position="bottom-left"
    />
    <player-area
      v-if="playerIds.length >= 4"
      :player-id="playerIds[3]"
      position="top-right"
    />
    <player-area
      v-if="playerIds.length >= 3"
      :player-id="playerIds[2]"
      position="bottom-right"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Board from "@/components/Board/GameBoard.vue";
import PlayerArea from "@/components/Player/PlayerArea.vue";
import PlayerPicture from "@/components/Elements/PlayerPicture.vue";

import PublicGameState from "@/models/PublicGameState";

export default defineComponent({
  name: "StartedGameView",
  inject: ["game"],
  data: () => ({
    assetsLoaded: false,
  }),
  computed: {
    activePlayerId(): number | null {
      return this.game.activePlayerId;
    },
    gameState(): PublicGameState | null {
      return this.game.publicState;
    },
    playerIds(): number[] {
      const ids = this.gameState?.players.map(({ id }) => id) ?? [];
      if (this.activePlayerId && !this.game.isDebug) {
        const activePlayerIndex = ids.findIndex(
          (id) => this.activePlayerId === id
        );
        return [
          ...ids.slice(activePlayerIndex),
          ...ids.slice(0, activePlayerIndex),
        ];
      } else {
        return ids;
      }
    },
    winner(): { id: number; name: string } | null {
      return this.gameState?.winner
        ? this.game.getPlayer(this.gameState?.winner) ?? null
        : null;
    },
  },
  async beforeMount() {
    const preloadImage = (src: string) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = src;
      });
    const colors = ["yellow", "blue", "red", "white"];
    const resources = ["brick", "grain", "lumber", "ore", "wool"];

    await Promise.all(
      [
        ...colors.map((color) => require(`@/assets/road-${color}-front.webp`)),
        ...colors.map((color) => require(`@/assets/road-${color}-side.webp`)),
        ...colors.map((color) => require(`@/assets/road-${color}-side-2.webp`)),
        ...colors.map((color) => require(`@/assets/settlement-${color}.webp`)),
        ...colors.map((color) => require(`@/assets/city-${color}.webp`)),
        ...resources.map((resource) =>
          require(`@/assets/tile-${resource}.webp`)
        ),
        ...resources.map((resource) => require(`@/assets/${resource}.webp`)),
        require("@/assets/tile-desert.webp"),
        require("@/assets/dock.webp"),
        require("@/assets/thief.webp"),
        require("@/assets/someone.webp"),
        require("@/assets/board-background.webp"),
        ...[1, 2, 3, 4, 5, 6].map((i) => require(`@/assets/dice-${i}.webp`)),
      ].map((url) => preloadImage(url))
    );
    this.assetsLoaded = true;
  },
  components: {
    Board,
    PlayerArea,
    PlayerPicture,
  },
});
</script>

<style lang="scss">
.playtable {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;

  .player-area {
    position: absolute;
    z-index: 1;
    padding: $player-area-padding;
    pointer-events: none;

    > * {
      pointer-events: auto;
    }

    &.player-area-top-left {
      top: 0;
      left: 0;
    }
    &.player-area-top-right {
      top: 0;
      right: 0;
    }
    &.player-area-bottom-left {
      bottom: 0;
      left: 0;
    }
    &.player-area-bottom-right {
      bottom: 0;
      right: 0;
    }

    &::before {
      content: "";
      position: absolute;
      pointer-events: none;
      z-index: -1;
      width: 45vmin;
      height: 45vmin;
    }

    &.player-area-top-left::before {
      top: 0;
      left: 0;
    }
    &.player-area-top-right::before {
      top: 0;
      right: 0;
    }
    &.player-area-bottom-left::before {
      bottom: 0;
      left: 0;
    }
    &.player-area-bottom-right::before {
      bottom: 0;
      right: 0;
    }

    $corner-gradient-origins: (
      "top-left": 0% 0%,
      "top-right": 100% 0%,
      "bottom-left": 0% 100%,
      "bottom-right": 100% 100%,
    );

    @each $id, $color in $player-glow-colors {
      @each $corner, $origin in $corner-gradient-origins {
        &.player-area-#{$id}.player-area-#{$corner}::before {
          background: radial-gradient(
            circle at #{$origin},
            rgba($color, 0.7) 0%,
            transparent 70%
          );
        }
      }
    }
  }

  .winner {
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(0, 0, 0, 0.5);
    background-clip: border-box;
    background-repeat: no-repeat;
    box-shadow: 0 -10px 75px rgba(0, 0, 0, 0.4) inset;
    border-radius: 12px;
    width: 20rem;
    margin-left: -10rem;
    height: 12rem;
    margin-top: -12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    filter: drop-shadow(0px 18px 10px rgba(0, 0, 0, 0.45));
    font-size: 1.1rem;

    .player-picture {
      width: 3.4rem;
      height: 3.4rem;
    }

    .winner-name {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 1.6rem;
      font-weight: 600;
    }

    @each $player, $gradient in $player-dark-gradients {
      &.winner-#{$player} {
        background-image: $gradient;
      }
    }
  }
}
</style>
