<template>
  <div class="edge-container">
    <div class="edge" :class="className" @click="handleClick()"></div>
    <board-port
      class="edge-port"
      :class="{ 'edge-port-reverse': reversePort }"
      v-if="port"
      :port="port"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Road from "@/models/Road";
import Port from "@/models/Port";

import BoardPort from "@/components/Board/BoardPort.vue";

export default defineComponent({
  inject: ["game"],
  props: {
    corners: { type: Array as PropType<number[]>, required: true },
    road: { type: [Object, null] as PropType<Road | null>, required: true },
    direction: { type: Number as PropType<0 | 1 | 2> },
  },
  computed: {
    activePlayerId(): number {
      return this.game.activePlayerId!;
    },
    buildingRoad(): boolean {
      return this.game.isBuildingRoad;
    },
    className(): string[] {
      const classes = [`edge-direction-${this.direction}`];

      if (this.road !== null) {
        classes.push("edge-road", `edge-player-${this.road.player}`);
      } else if (this.buildingRoad) {
        classes.push(
          "edge-building-road",
          `edge-player-${this.activePlayerId}`
        );
      }
      return classes;
    },
    port(): Port | boolean {
      if (this.game.publicState) {
        const corner1 = this.game.publicState.board.corners.find(
          ({ id }) => id === this.corners[0]
        );
        if (corner1 && corner1.port !== null) {
          const corner2 = this.game.publicState.board.corners.find(
            ({ id }) => id === this.corners[1]
          );
          if (corner2 && corner2.port !== null) {
            return corner1.port;
          }
        }
      }
      return false;
    },
    reversePort(): boolean {
      return (
        this.corners[0] === 32 ||
        this.corners[0] === 34 ||
        (this.corners[0] >= 36 && this.corners[0] < 47) ||
        this.corners[0] === 48 ||
        this.corners[0] === 50
      );
    },
  },
  methods: {
    handleClick() {
      if (this.buildingRoad && this.road === null) {
        this.game.buildRoad([this.corners[0], this.corners[1]]);
      }
    },
  },
  components: { BoardPort },
});
</script>

<style lang="scss">
.edge-container {
  position: absolute;
  width: $edge-size;
  margin-left: -(1/2) * $edge-size;
}

.edge {
  @include board-element;
  @include board-piece-shadow;
  width: 100%;
  height: 100%;

  &.edge-building-road {
    @include board-element-interactive;
  }

  &.edge-road,
  &.edge-building-road {
    @include board-piece-animation;
  }

  &.edge-road,
  &.edge-building-road:hover {
    @include board-piece-animation-active;
  }

  @each $player, $color-name in $player-color-names {
    &.edge-player-#{$player} {
      &.edge-road,
      &.edge-building-road {
        &.edge-direction-0 {
          @include board-piece-image(
            url("../../assets/road-#{$color-name}-front.png")
          );
        }
        &.edge-direction-1 {
          @include board-piece-image(
            url("../../assets/road-#{$color-name}-side.png")
          );
        }
        &.edge-direction-2 {
          @include board-piece-image(
            url("../../assets/road-#{$color-name}-side-2.png")
          );
        }
      }
    }
  }
}

.edge-port {
  position: absolute;
  top: 50%;
  left: (0.014 * $board-height) + ($edge-size / 2);
  transform: rotate(90deg);

  &.edge-port-reverse {
    transform: rotate(270deg);
    left: initial;
    right: (0.014 * $board-height) + ($edge-size / 2);
  }
}
</style>
