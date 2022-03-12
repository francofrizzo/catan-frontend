<template>
  <div class="playtable" v-if="gameState">
    <div class="lateral-column">
      <div class="player-area-container">
        <player-area
          v-if="playerIds.length >= 1"
          :player-id="playerIds[0]"
          position="top-left"
        />
      </div>
      <div class="player-area-container">
        <player-area
          v-if="playerIds.length >= 2"
          :player-id="playerIds[1]"
          position="bottom-left"
        />
      </div>
    </div>
    <div class="board-column">
      <board />
    </div>
    <div class="lateral-column">
      <div class="player-area-container">
        <player-area
          v-if="playerIds.length >= 4"
          :player-id="playerIds[3]"
          position="top-right"
        />
      </div>
      <div class="player-area-container">
        <player-area
          v-if="playerIds.length >= 3"
          :player-id="playerIds[2]"
          position="bottom-right"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Board from "@/components/Board/GameBoard.vue";
import PlayerArea from "@/components/Player/PlayerArea.vue";

import PublicGameState from "@/models/PublicGameState";

export default defineComponent({
  name: "StartedGameView",
  inject: ["game"],
  computed: {
    activePlayerId(): number | null {
      return this.game.activePlayerId;
    },
    gameState(): PublicGameState | null {
      return this.game.publicState;
    },
    playerIds(): number[] {
      const ids = this.gameState?.players.map(({ id }) => id) ?? [];
      if (this.activePlayerId && !this.game.isDebug) {
        const activePlayerIndex = ids.findIndex(
          (id) => this.activePlayerId === id
        );
        return [
          ...ids.slice(activePlayerIndex),
          ...ids.slice(0, activePlayerIndex),
        ];
      } else {
        return ids;
      }
    },
  },
  components: {
    Board,
    PlayerArea,
  },
});
</script>

<style lang="scss">
.playtable {
  width: 100%;
  height: 100%;
  display: flex;

  .lateral-column {
    flex-basis: 20%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .board-column {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .player-area-container {
    height: 40%;
    padding: $player-area-padding;
    flex-grow: 0;
  }
}
</style>
