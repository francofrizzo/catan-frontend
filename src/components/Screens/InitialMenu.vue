<template>
  <div class="initial-menu screen">
    <screen-title />
    <div class="menu-content">
      <div v-if="!joiningGame" class="menu-actions">
        <button @click="createGame()">
          <Flag :size="18" :stroke-width="1.5" /> Crear una partida
        </button>
        <button @click="joiningGame = true">
          <Anchor :size="18" :stroke-width="1.5" /> Unirse a una partida
          existente
        </button>
        <button class="btn-ghost" @click="createDebugGame()">
          <Wrench :size="16" :stroke-width="1.5" /> Crear partida de prueba
        </button>
      </div>
      <form v-else @submit.prevent="joinGame()">
        <label for="#game-id">Escribe el ID de la partida</label>
        <input
          type="text"
          autofocus
          v-model="joiningGameId"
          class="game-id-input"
        />
        <div class="form-actions">
          <button @click="joiningGame = false">
            <ArrowLeft :size="16" :stroke-width="1.5" /> Cancelar
          </button>
          <button type="submit">
            <Anchor :size="16" :stroke-width="1.5" /> Unirse
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Flag, Anchor, Wrench, ArrowLeft } from "lucide-vue-next";

import { createGame, createDebugGame } from "@/api/actions";
import ScreenTitle from "@/components/Elements/ScreenTitle.vue";

export default defineComponent({
  components: { Flag, Anchor, Wrench, ArrowLeft, ScreenTitle },
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

  .menu-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 14rem;
  }

  .menu-actions {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      animation: menu-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both;

      &:nth-child(1) {
        animation-delay: 300ms;
      }
      &:nth-child(2) {
        animation-delay: 400ms;
      }
      &:nth-child(3) {
        animation-delay: 500ms;
      }
    }
  }

  button,
  input,
  label {
    margin-top: 1.5rem;
  }

  button,
  input {
    padding: 0.7rem 1.4rem;
  }

  form {
    animation: menu-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;

    .game-id-input {
      font-family: $font-family-regular;
      font-size: 1.25em;
      text-transform: lowercase;
      text-align: center;
      width: 20rem;
      padding: 0.6rem 1rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
    }
  }
}
</style>
