<template>
  <div class="corner" :class="className" @click="handleClick()">
    <template v-if="corner.port">
      {{ corner.port.exchangeRate
      }}{{
        corner.port.accepts.length > 1
          ? "❓"
          : getResourceIcon(corner.port.accepts[0])
      }}
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Corner from "@/models/Corner";

import game from "@/game";
import { getResourceIcon } from "@/models/Resource";

export default defineComponent({
  props: {
    corner: { type: Object as PropType<Corner>, required: true },
  },
  computed: {
    activePlayerId(): number {
      return game.activePlayerId;
    },
    buildingSettlement(): boolean {
      return game.isBuildingSettlement;
    },
    buildingCity(): boolean {
      return game.isBuildingCity;
    },
    className(): string[] {
      const classes = [];
      if (this.corner.construction !== null) {
        classes.push(
          `corner-${this.corner.construction.type.toLowerCase()}`,
          `corner-player-${this.corner.construction.player}`
        );
        if (
          this.buildingCity &&
          this.corner.construction.type === "Settlement" &&
          this.corner.construction.player === this.activePlayerId
        ) {
          classes.push("corner-building-city");
        }
      } else if (this.buildingSettlement) {
        classes.push(
          "corner-building-settlement",
          `corner-player-${this.activePlayerId}`
        );
      }

      return classes;
    },
  },
  methods: {
    getResourceIcon,
    handleClick() {
      if (this.buildingSettlement && this.corner.construction === null) {
        game.buildSettlement(this.corner.id);
      } else if (
        this.buildingCity &&
        this.corner.construction !== null &&
        this.corner.construction.type === "Settlement" &&
        this.corner.construction.player === this.activePlayerId
      )
        game.buildCity(this.corner.id);
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

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  margin-top: -15px;
  margin-left: -15px;

  &.corner-settlement,
  &.corner-building-settlement {
    border-radius: 50%;
  }

  &.corner-city,
  &.corner-building-city:hover {
    border-radius: 0;
  }

  &.corner-building-settlement,
  &.corner-building-city {
    cursor: pointer;
  }

  @each $player, $color in $players {
    &.corner-player-#{$player} {
      &.corner-settlement,
      &.corner-building-settlement:hover,
      &.corner-city,
      &.corner-building-city:hover {
        background-color: $color;
      }
    }
  }
}
</style>
