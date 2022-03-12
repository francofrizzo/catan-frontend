<template>
  <div class="initial-menu">
    <h1>CATÁN</h1>
    <template v-if="!joiningGame">
      <button @click="createGame()">Crear una partida</button>
      <button @click="joiningGame = true">
        Unirse a una partida existente
      </button>
      <button @click="createDebugGame()">Crear partida de prueba</button>
    </template>
    <template v-else>
      <form @submit.prevent="joinGame()">
        <label for="#game-id">Escribe el ID de la partida</label>
        <input type="text" autofocus v-model="joiningGameId" />
        <div>
          <button @click="joiningGame = false">Cancelar</button>
          <button type="submit">Unirse</button>
        </div>
      </form>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { createGame, createDebugGame } from "@/api/actions";

export default defineComponent({
  data: () => ({ joiningGame: false, joiningGameId: "" }),
  methods: {
    async createGame() {
      const gameId = await createGame();
      this.$router.push({ name: "game", params: { gameId } });
    },
    async createDebugGame() {
      const gameId = await createDebugGame();
      this.$router.push({ name: "game", params: { gameId } });
    },
    joinGame() {
      this.$router.push({
        name: "game",
        params: { gameId: this.joiningGameId },
      });
    },
  },
});
</script>

<style lang="scss">
.initial-menu {
  &,
  & form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 3rem;
    font-weight: 600;
    letter-spacing: 0.2rem;
    margin-bottom: 0.5rem;
  }

  button {
    background-color: $secondary-background-color;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  button,
  input,
  label {
    margin-top: 1.5rem;
  }

  button,
  input {
    padding: 0.6rem 1rem;
    margin-top: 1.5rem;
  }
}
</style>
