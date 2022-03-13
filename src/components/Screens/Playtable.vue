<template>
  <div class="playtable" v-if="gameState">
    <div class="winner" :class="`winner-${winner.id}`" v-if="winner !== null">
      <player-picture :player="winner" />
      <div class="winner-name">{{ winner.name }}</div>
      <div>ganó la partida</div>
    </div>
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
import PlayerPicture from "@/components/Elements/PlayerPicture.vue";

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
    winner(): { id: number; name: string } | null {
      return this.gameState?.winner
        ? this.game.getPlayer(this.gameState?.winner) ?? null
        : null;
    },
  },
  components: {
    Board,
    PlayerArea,
    PlayerPicture,
  },
});
</script>

<style lang="scss">
.playtable {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

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

  .winner {
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(0, 0, 0, 0.5);
    background-clip: border-box;
    background-repeat: no-repeat;
    box-shadow: 0 -10px 75px rgba(0, 0, 0, 0.4) inset;
    border-radius: 12px;
    width: 20rem;
    margin-left: -10rem;
    height: 12rem;
    margin-top: -12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    filter: drop-shadow(0px 18px 10px rgba(0, 0, 0, 0.45));
    font-size: 1.1rem;

    .player-picture {
      width: 3.4rem;
      height: 3.4rem;
    }

    .winner-name {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 1.6rem;
      font-weight: 600;
    }

    @each $player, $gradient in $player-dark-gradients {
      &.winner-#{$player} {
        background-image: $gradient;
      }
    }
  }
}
</style>
