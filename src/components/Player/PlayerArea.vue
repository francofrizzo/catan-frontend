<template>
  <div
    class="player-area"
    :class="[`player-${player.id}`, { active: isActive }]"
  >
    <h3>{{ player.name }}</h3>

    <active-player-area v-if="isActive" :player="player" />
    <inactive-player-area v-else :player="player" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Player from "@/models/Player";

import game from "@/game";

import ActivePlayerArea from "@/components/Player/ActivePlayerArea.vue";
import InactivePlayerArea from "@/components/Player/InactivePlayerArea.vue";

export default defineComponent({
  components: { ActivePlayerArea, InactivePlayerArea },
  props: {
    playerId: { type: Number, required: true },
  },
  computed: {
    player(): Player {
      return game.publicState!.players.find(({ id }) => id === this.playerId)!;
    },
    isActive(): boolean {
      return game.activePlayerId === this.playerId;
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
.player-area {
  @each $player, $color in $players {
    &.player-#{$player} h3::before {
      content: "";
      width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-right: 0.5rem;
      display: inline-block;
      background-color: $color;
    }
  }
}
</style>
