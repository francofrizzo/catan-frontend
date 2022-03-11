<template>
  <div class="corner" :class="className" @click="handleClick()"></div>
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
.corner {
  @include board-element;
  @include absolute-center($corner-size);
  @include board-piece-shadow;

  &.corner-building-settlement,
  &.corner-building-city {
    @include board-element-interactive;
  }

  &.corner-settlement,
  &.corner-building-settlement,
  &.corner-city,
  &.corner-building-city {
    @include board-piece-animation;
  }

  &.corner-settlement,
  &.corner-building-settlement:hover {
    @include board-piece-animation-active(90%);
  }

  &.corner-city,
  &.corner-building-city:hover {
    @include board-piece-animation-active;
  }

  @each $player, $color-name in $player-color-names {
    &.corner-player-#{$player} {
      &.corner-settlement,
      &.corner-building-settlement {
        @include board-piece-image(
          url("../../assets/settlement-#{$color-name}.png")
        );
      }

      &.corner-city,
      &.corner-building-city:hover {
        @include board-piece-image(url("../../assets/city-#{$color-name}.png"));
      }
    }
  }
}
</style>
