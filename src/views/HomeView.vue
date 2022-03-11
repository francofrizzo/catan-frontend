<template>
  <div class="playtable" v-if="gameState">
    <div class="lateral-column">
      <div class="player-area-container">
        <player-area
          v-if="playerIds.includes(0)"
          :player-id="0"
          position="top-left"
        />
      </div>
      <div class="player-area-container">
        <player-area
          v-if="playerIds.includes(1)"
          :player-id="1"
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
          v-if="playerIds.includes(3)"
          :player-id="3"
          position="top-right"
        />
      </div>
      <div class="player-area-container">
        <player-area
          v-if="playerIds.includes(2)"
          :player-id="2"
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

import game from "@/game";
import PublicGameState from "@/models/PublicGameState";

export default defineComponent({
  name: "HomeView",
  computed: {
    gameState(): PublicGameState | null {
      return game.publicState;
    },
    playerIds(): number[] {
      return this.gameState?.players.map(({ id }) => id) ?? [];
    },
    activePlayerId(): number | null {
      return game.activePlayerId;
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
  height: 100vh;
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
