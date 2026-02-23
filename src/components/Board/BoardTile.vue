<template>
  <div
    class="tile"
    :class="className"
    :style="tile.style"
    @click="handleClick()"
  >
    <div
      class="tile-number"
      :class="`tile-number-${probability}`"
      v-if="tile.number"
    >
      {{ tile.number }}
    </div>
    <div
      class="tile-thief"
      :class="{ movable: canMoveThief && !movingThief }"
      @click="handleThiefClick()"
    ></div>
    <div class="tile-steal-from-menu" v-if="recievingThief">
      <player-picture
        v-for="playerId in candidatePlayersToStealFrom"
        :key="playerId"
        :player-id="playerId"
        @click="recieveThief(playerId)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Tile from "@/models/Tile";
import PlayerPicture from "@/components/Elements/PlayerPicture.vue";

export default defineComponent({
  components: { PlayerPicture },
  inject: ["game"],
  data: () => ({
    candidatePlayersToStealFrom: [] as number[],
  }),
  props: {
    tile: { type: Object as PropType<Tile>, required: true },
  },
  computed: {
    canMoveThief(): boolean {
      return this.game.availableActions.includes("MoveThief");
    },
    movingThief(): boolean {
      return this.game.isMovingThief;
    },
    recievingThief(): boolean {
      return this.game.tileRecievingThief === this.tile.id;
    },
    className(): string[] {
      const classes = [
        this.tile.resource
          ? `tile-${this.tile.resource.toLowerCase()}`
          : "tile-desert",
      ];
      if (this.tile.hasThief && !this.movingThief && !this.recievingThief) {
        classes.push("has-thief");
      }
      if (this.movingThief && !this.tile.hasThief) {
        classes.push("moving-thief");
      }
      if (this.recievingThief && this.candidatePlayersToStealFrom.length > 0) {
        classes.push("recieving-thief");
      }
      return classes;
    },
    probability(): number {
      return this.tile.number
        ? this.tile.number <= 7
          ? this.tile.number - 1
          : 13 - this.tile.number
        : 0;
    },
  },
  methods: {
    handleClick() {
      if (this.movingThief && !this.tile.hasThief) {
        this.prepareToRecieveThief();
      }
    },
    handleThiefClick() {
      if (this.canMoveThief) {
        this.game.startMovingThief();
      }
    },
    prepareToRecieveThief() {
      const stealablePlayers = this.game.getStealablePlayers(this.tile);
      if (stealablePlayers.length === 0) {
        this.recieveThief();
      } else {
        this.candidatePlayersToStealFrom = stealablePlayers;
        this.game.setTileRecievingThief(this.tile.id);
      }
    },
    recieveThief(stealFrom?: number) {
      this.game.moveThief(this.tile.id, stealFrom);
    },
  },
  watch: {
    recievingThief(newValue: boolean) {
      if (!newValue) {
        this.candidatePlayersToStealFrom = [];
      }
    },
  },
});
</script>

<style lang="scss">
.tile {
  background-size: cover;
  position: absolute;
  @include board-element;

  &.moving-thief {
    @include board-element-interactive;
  }
}

@each $tile-type in ("desert", "brick", "lumber", "wool", "grain", "ore") {
  .tile-#{$tile-type} {
    background-image: url("../../assets/tile-#{$tile-type}.webp");
  }
}

.tile-number {
  @include absolute-center($tile-number-size);
  border: 1px solid rgba(58, 32, 12, 0.3);
  background-clip: padding-box;
  box-shadow: 0 0px 3px rgba(58, 32, 12, 0.5) inset,
    0 -5px 16px rgba(58, 32, 12, 0.5) inset, 0 3px 4px rgba(0, 0, 0, 0.2);

  @include round($tile-number-size);
  background-image: radial-gradient(
    change-color($secondary-background-color, $alpha: 0.95) 50%,
    change-color($secondary-background-color, $alpha: 0.7)
  );
  color: $dark-font-color;
  font-weight: 700;
  transition: opacity 200ms ease;
  line-height: $tile-number-size;
  text-align: center;
}

.tile-number-1 {
  font-size: 1.7 * ($tile-number-size / 5);
}

.tile-number-2 {
  font-size: 2 * ($tile-number-size / 5);
}

.tile-number-3 {
  font-size: 2.5 * ($tile-number-size / 5);
}

.tile-number-4 {
  font-size: 3 * ($tile-number-size / 5);
  font-weight: 700;
}

.tile-number-5 {
  font-size: 3.5 * ($tile-number-size / 5);
  color: $red-font-color;
}

.tile-thief {
  @include board-element;
  @include board-piece-shadow;
  @include board-piece-image(url("../../assets/thief.webp"));
  @include board-piece-animation;
  @include absolute-center($thief-size, (4/3) * $thief-size);
  margin-top: -(5/6) * $thief-size;

  &.movable {
    @include board-element-interactive;
  }
}

.tile.has-thief,
.tile.moving-thief:hover,
.tile.recieving-thief {
  .tile-number {
    opacity: 0;
  }
  .tile-thief {
    @include board-piece-animation-active;
  }
}

.tile-steal-from-menu {
  pointer-events: none;
  position: absolute;
  z-index: 1;
  right: -0.1 * $tile-height;
  top: 0;
  height: 0.9 * $tile-height;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .player-picture {
    @include board-piece-shadow;
    pointer-events: all;
    cursor: pointer;
    width: 0.25 * $tile-height;
    height: 0.25 * $tile-height;
    margin: (0.025 * $tile-height) 0;
    transition: transform 200ms ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>
