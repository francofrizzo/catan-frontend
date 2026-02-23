<template>
  <div
    class="player-picture"
    :class="`player-picture-${actualPlayer.id}`"
  ></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Player from "@/models/Player";

export default defineComponent({
  inject: ["game"],
  props: {
    playerId: { type: Number },
    player: { type: Object as PropType<Player> },
  },
  computed: {
    actualPlayer(): { id: number; name: string } | undefined {
      return this.player ?? this.game.getPlayer(this.playerId!);
    },
  },
});
</script>

<style lang="scss">
.player-picture {
  @include round($player-picture-size);
  background-image: url("../../assets/someone.webp");
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
