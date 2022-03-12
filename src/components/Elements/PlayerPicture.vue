<template>
  <div class="player-picture" :class="`player-picture-${player.id}`"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Player from "@/models/Player";

export default defineComponent({
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
});
</script>

<style lang="scss">
.player-picture {
  @include round($player-picture-size);
  background-image: url("../../assets/someone.png");
  background-size: cover;
  border-width: $player-picture-border-width;
  border-style: solid;
}

@each $player, $color in $player-colors {
  .player-picture-#{$player} {
    border-color: $color;
  }
}
</style>
