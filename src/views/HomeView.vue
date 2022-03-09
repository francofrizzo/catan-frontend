<template>
  <div class="playtable" v-if="gameState">
    <div class="lateral-column">
      <div class="player-area-container">
        <player-area v-if="playerIds.includes(0)" :player-id="0" />
      </div>
      <div class="player-area-container">
        <player-area v-if="playerIds.includes(1)" :player-id="1" />
      </div>
    </div>
    <div class="board-column">
      <board />
      <ul class="player-selector">
        <li
          v-for="player in gameState.players"
          :key="player.id"
          class="player-selector-item"
          :class="[
            `player-${player.id}`,
            { active: activePlayerId === player.id },
          ]"
          @click="switchActivePlayer(player.id)"
        >
          {{ player.name }}
        </li>
      </ul>
      <div class="dice" v-if="gameState && gameState.currentTurn.diceRoll">
        <h4>Dice: {{ gameState.currentTurn.diceRoll }}</h4>
      </div>
    </div>
    <div class="lateral-column">
      <div class="player-area-container">
        <player-area v-if="playerIds.includes(3)" :player-id="3" />
      </div>
      <div class="player-area-container">
        <player-area v-if="playerIds.includes(2)" :player-id="2" />
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
  methods: {
    switchActivePlayer(playerId: number) {
      game.switchActivePlayer(playerId);
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 0;
  }

  .board-column {
    position: relative;
    flex-basis: 60%;
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .player-area-container {
    height: 40%;
    padding: 1rem;
    flex-grow: 0;
    overflow-y: scroll;
  }
}

$players: (
  "0": yellow,
  "1": red,
  "2": blue,
  "3": white,
);

.player-selector {
  position: absolute;
  list-style: none;
  top: 10px;
  left: 10px;

  .player-selector-item {
    padding: 2px 4px;
    border-radius: 4px;
    margin-bottom: 6px;
    cursor: pointer;

    &.active {
      font-weight: bold;
    }
  }

  @each $player, $color in $players {
    .player-selector-item.player-#{$player}.active {
      background-color: $color;
    }
  }
}

.dice {
  position: absolute;
  top: 25px;
  right: 25px;
  padding: 10px 14px;
  border-radius: 4px;
  background-color: #fff;

  h4 {
    margin: 0;
  }
}
</style>
