<template>
  <div
    class="tile"
    :class="className"
    :style="tile.style"
    @click="handleClick()"
  >
    <div
      v-if="tile.hasThief && !movingThief"
      class="tile-thief"
      :class="{ movable: canMoveThief }"
      @click="handleThiefClick()"
    >
      <div class="tile-number-inner">X</div>
    </div>
    <div
      class="tile-number"
      :class="`tile-number-${probability}`"
      v-else-if="tile.number"
    >
      <div class="tile-number-inner">{{ tile.number }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Action from "@/models/Action";
import Tile from "@/models/Tile";

import game from "@/game";

export default defineComponent({
  props: {
    tile: { type: Object as PropType<Tile>, required: true },
  },
  computed: {
    canMoveThief(): boolean {
      return game.availableActions.includes(Action.MoveThief);
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

  &.moving-thief {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}

@each $tileType in ("desert", "brick", "lumber", "wool", "grain", "ore") {
  .tile-#{$tileType} {
    background-image: url("../../assets/tile-#{$tileType}.png");
  }
}

.tile-number {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -30px;
  margin-left: -30px;
  width: 40px;
  height: 40px;
  padding: 6px 8px 12px 8px;
  background-size: cover;
  background-image: url("../../assets/tile-number.png");
  background-repeat: no-repeat;
}

.tile-number-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Georgia";
}

.tile-number-1 {
  font-size: 0.9rem;
}

.tile-number-2 {
  font-size: 1rem;
}

.tile-number-3 {
  font-size: 1.1rem;
}

.tile-number-4 {
  font-size: 1.25rem;
}

.tile-number-5 {
  font-size: 1.4rem;
  color: darkred;
}

.tile-thief {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -30px;
  margin-left: -30px;
  width: 40px;
  height: 40px;
  padding: 6px 8px 12px 8px;
  background-size: cover;
  background-image: url("../../assets/tile-number.png");
  background-repeat: no-repeat;

  &.movable {
    cursor: pointer;
  }
}
</style>
