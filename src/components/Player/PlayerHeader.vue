<template>
  <div
    class="player-header"
    :class="[`player-header-${player.id}`, { 'current-turn': isCurrentTurn }]"
  >
    <div class="current-turn-marker" v-if="isCurrentTurn"></div>
    <player-picture :player="player" />
    <h2>{{ player.name }}</h2>

    <template v-if="isActive">
      <button
        class="header-action-button"
        v-if="availableActions.includes('RollDice')"
        @click="rollDice()"
      >
        Tirar dados
      </button>
      <button
        class="header-action-button"
        v-else-if="isCurrentTurn"
        :disabled="!availableActions.includes('Pass')"
        @click="pass()"
      >
        Finalizar turno
      </button>
    </template>
    <rolled-dice v-if="isCurrentTurn && diceRoll" :dice="diceRoll" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Action from "@/models/Action";
import Player from "@/models/Player";

import RolledDice from "@/components/Elements/RolledDice.vue";
import PlayerPicture from "@/components/Elements/PlayerPicture.vue";

export default defineComponent({
  inject: ["game"],
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
  computed: {
    isActive(): boolean {
      return this.game.activePlayerId === this.player.id;
    },
    isCurrentTurn(): boolean {
      return this.game.publicState?.currentTurn.player === this.player.id;
    },
    diceRoll(): [number, number] | null {
      return this.game.publicState?.currentTurn.eachDiceRoll ?? null;
    },
    availableActions(): Action[] {
      return this.game.availableActions;
    },
  },
  methods: {
    rollDice() {
      this.game.rollDice();
    },
    pass() {
      this.game.pass();
    },
  },
  components: { RolledDice, PlayerPicture },
});
</script>

<style lang="scss">
.player-header {
  display: flex;
  align-items: center;
  position: relative;

  h2 {
    margin: 0 1rem;
    font-size: 1.6rem;
    font-weight: 600;
  }

  .header-action-button {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .current-turn-marker {
    position: absolute;
    width: 0;
    height: 0;
    border-width: $current-turn-marker-size;
    border-style: solid;
  }

  .dice-canvas {
    position: absolute;
  }

  @each $player, $color in $player-colors {
    &.player-header-#{$player} {
      .header-action-button {
        color: color-yiq($color, black, white);
        background-color: $color;
      }

      .current-turn-marker {
        border-color: $color;
      }
    }
  }
}

.player-area-top-left,
.player-area-bottom-left {
  .player-header {
    flex-direction: row;
  }
}

.player-area-top-right,
.player-area-bottom-right {
  .player-header {
    flex-direction: row-reverse;
  }
}

.player-area-top-left {
  .current-turn-marker {
    border-bottom-color: transparent !important;
    border-right-color: transparent !important;
    top: -$player-area-padding;
    left: -$player-area-padding;
  }
  .dice-canvas {
    top: $dice-canvas-position-y;
    right: -$dice-canvas-position-x;
  }
}

.player-area-bottom-left {
  .current-turn-marker {
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    bottom: -$player-area-padding;
    left: -$player-area-padding;
  }
  .dice-canvas {
    bottom: $dice-canvas-position-y;
    right: -$dice-canvas-position-x;
  }
}

.player-area-top-right {
  .current-turn-marker {
    border-bottom-color: transparent !important;
    border-left-color: transparent !important;
    top: -$player-area-padding;
    right: -$player-area-padding;
  }
  .dice-canvas {
    top: $dice-canvas-position-y;
    left: -$dice-canvas-position-x;
  }
}

.player-area-bottom-right {
  .current-turn-marker {
    border-top-color: transparent !important;
    border-left-color: transparent !important;
    bottom: -$player-area-padding;
    right: -$player-area-padding;
  }
  .dice-canvas {
    bottom: $dice-canvas-position-y;
    left: -$dice-canvas-position-x;
  }
}
</style>
