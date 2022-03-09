<template>
  <div class="edge" :class="className" @click="handleClick()"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Road from "@/models/Road";

import game from "@/game";

export default defineComponent({
  props: {
    corners: { type: Array as PropType<number[]>, required: true },
    road: { type: [Object, null] as PropType<Road | null>, required: true },
  },
  computed: {
    activePlayerId(): number {
      return game.activePlayerId;
    },
    buildingRoad(): boolean {
      return game.isBuildingRoad;
    },
    className(): string[] {
      const classes = [];

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
  },
  methods: {
    handleClick() {
      console.log(this.buildingRoad, this.road !== null);
      if (this.buildingRoad && this.road === null) {
        game.buildRoad([this.corners[0], this.corners[1]]);
      }
    },
  },
});
</script>

<style lang="scss">
$players: (
  "0": yellow,
  "1": red,
  "2": blue,
  "3": white,
);

.edge {
  position: absolute;
  width: 2px;
  margin-left: -1px;

  &.edge-building-road {
    cursor: pointer;
  }

  @each $player, $color in $players {
    &.edge-player-#{$player} {
      &.edge-road,
      &.edge-building-road:hover {
        background-color: $color;
      }
    }
  }
}
</style>
