<template>
  <div
    class="player-area"
    :class="[
      `player-area-${player.id}`,
      `player-area-${position}`,
      { active: isActive },
      { 'must-discard': resourcesToDiscard > 0 },
    ]"
  >
    <player-header :player="player" />
    <active-player-area v-if="isActive" :player="player" />
    <inactive-player-area v-else :player="player" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Player from "@/models/Player";

import PlayerHeader from "@/components/Player/PlayerHeader.vue";
import ActivePlayerArea from "@/components/Player/ActivePlayerArea.vue";
import InactivePlayerArea from "@/components/Player/InactivePlayerArea.vue";

export default defineComponent({
  inject: ["game"],
  components: { PlayerHeader, ActivePlayerArea, InactivePlayerArea },
  props: {
    playerId: { type: Number, required: true },
    position: {
      type: String as PropType<
        "top-left" | "top-right" | "bottom-left" | "bottom-right"
      >,
      required: true,
    },
  },
  computed: {
    player(): Player {
      return this.game.publicState!.players.find(
        ({ id }) => id === this.playerId
      )!;
    },
    isActive(): boolean {
      return this.game.activePlayerId === this.playerId;
    },
    resourcesToDiscard(): number {
      return (
        this.game.publicState?.currentTurn.resourcesToDiscard[this.player.id] ??
        0
      );
    },
  },
});
</script>

<style lang="scss">
.player-area {
  display: flex;
  height: 100%;

  &.player-area-top-left,
  &.player-area-top-right {
    flex-direction: column;
    justify-content: start;
  }

  &.player-area-bottom-left,
  &.player-area-bottom-right {
    flex-direction: column-reverse;
    justify-content: flex-end;
    justify-content: end;
  }

  &.player-area-top-left,
  &.player-area-bottom-left {
    text-align: left;
  }

  &.player-area-top-right,
  &.player-area-bottom-right {
    text-align: right;
  }

  .resources {
    transition: filter 200ms ease;
  }

  &.must-discard {
    .resources {
      filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.8));
    }
  }
}

.player-area-subarea {
  display: flex;

  .section {
    margin: 0.6rem -0.4rem;

    > * {
      margin-left: 0.4rem;
      margin-right: 0.4rem;
    }
  }
}

.player-area-top-left,
.player-area-top-right {
  .player-area-subarea {
    flex-direction: column;
    padding-top: 0.6rem;

    .section {
      align-items: flex-start;
    }
  }
}

.player-area-bottom-left,
.player-area-bottom-right {
  .player-area-subarea {
    flex-direction: column-reverse;
    padding-bottom: 0.6rem;

    .section {
      align-items: flex-end;
    }
  }
}

.player-area-top-left,
.player-area-bottom-left {
  .player-area-subarea {
    .section {
      flex-direction: row;
    }
  }
}

.player-area-top-right,
.player-area-bottom-right {
  .player-area-subarea {
    .section {
      flex-direction: row-reverse;
    }
  }
}
</style>
