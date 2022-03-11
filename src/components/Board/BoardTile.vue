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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Tile from "@/models/Tile";

import game from "@/game";

export default defineComponent({
  props: {
    tile: { type: Object as PropType<Tile>, required: true },
  },
  computed: {
    canMoveThief(): boolean {
      return game.availableActions.includes("MoveThief");
    },
    movingThief(): boolean {
      return game.isMovingThief;
    },
    className(): string[] {
      const classes = [
        this.tile.resource
          ? `tile-${this.tile.resource.toLowerCase()}`
          : "tile-desert",
      ];
      if (this.tile.hasThief && !this.movingThief) {
        classes.push("has-thief");
      }
      if (this.movingThief && !this.tile.hasThief) {
        classes.push("moving-thief");
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
        game.moveThief(this.tile.id);
      }
    },
    handleThiefClick() {
      if (this.canMoveThief) {
        game.startMovingThief();
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
    background-image: url("../../assets/tile-#{$tile-type}.png");
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
  @include board-piece-image(url("../../assets/thief.png"));
  @include board-piece-animation;
  @include absolute-center($thief-size, (4/3) * $thief-size);
  margin-top: -(5/6) * $thief-size;

  &.movable {
    @include board-element-interactive;
  }
}

.tile.has-thief,
.tile.moving-thief:hover {
  .tile-number {
    opacity: 0;
  }
  .tile-thief {
    @include board-piece-animation-active;
  }
}
</style>
