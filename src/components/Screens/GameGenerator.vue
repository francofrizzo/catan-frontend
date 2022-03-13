<template>
  <div class="game-generator">
    <h1>CATÁN</h1>

    <h2>Jugadores</h2>
    <template v-if="players.length > 0">
      <div
        class="player"
        :class="[
          `player-${player.id}`,
          { 'player-active': player.id === activePlayerId },
        ]"
        v-for="player in players"
        :key="player.id"
      >
        <player-picture :player="player" />
        {{ player.name }}
      </div>
    </template>
    <form
      v-if="players.length < 4 && activePlayerId === null"
      @submit.prevent="createPlayer()"
    >
      <input type="text" v-model="creatingPlayerName" autofocus />
      <button tpye="submit">Agregar jugador</button>
    </form>
    <div>
      <input type="checkbox" id="autocollect" v-model="autoCollect" /><label
        for="autocollect"
        >Recolectar recursos automáticamente</label
      >
    </div>
    <div class="game-id">
      ID de partida: <code>{{ gameId }}</code>
    </div>
    <div>
      <button @click="goBack()">Cancelar</button>
      <button :disabled="players.length < 3" @click="startGame()">
        Comenzar partida
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import * as api from "@/api/actions";
import PlayerPicture from "@/components/Elements/PlayerPicture.vue";

export default defineComponent({
  components: { PlayerPicture },
  name: "NotStartedGameView",
  inject: ["game"],
  data: () => ({
    creatingPlayerName: "",
    autoCollect: false,
  }),
  computed: {
    gameId(): string {
      return this.game.gameId;
    },
    players(): Array<{ id: number; name: string }> {
      return this.game.players;
    },
    activePlayerId(): number | null {
      return this.game.activePlayerId;
    },
  },
  methods: {
    goBack() {
      this.$router.push({ name: "start" });
    },
    createPlayer() {
      api.addPlayerToGame(this.game.gameId, this.creatingPlayerName);
    },
    startGame() {
      api.startGame(this.game.gameId, this.autoCollect);
    },
  },
});
</script>

<style lang="scss">
.game-generator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 3rem;
    font-weight: 600;
    letter-spacing: 0.2rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    margin-bottom: 0.4rem;
    font-weight: 600;
  }

  .game-id {
    margin-top: 1.5rem;
    code {
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      padding: 2px 3px 1px;
      margin: 0 0.3rem;
      user-select: all;
    }
  }

  .player {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    margin-top: 1rem;

    .player-picture {
      margin-right: 1rem;
    }
  }

  button {
    background-color: $secondary-background-color;
  }

  button,
  input {
    margin-top: 2rem;
  }

  button,
  input[type="text"] {
    padding: 0.6rem 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  input[type="text"] {
    width: 8rem;
  }
}
</style>
