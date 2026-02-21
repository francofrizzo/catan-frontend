<template>
  <div class="initial-menu">
    <h1>CATÁN</h1>
    <div class="divider" aria-hidden="true"><span></span></div>
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

export default defineComponent({
  components: { Flag, Anchor, Wrench, ArrowLeft },
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
@keyframes menu-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes divider-expand {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.initial-menu {
  &,
  & form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 5rem;
    font-weight: 700;
    letter-spacing: 0.6rem;
    margin-bottom: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 60px rgba($secondary-background-color, 0.06);
    animation: menu-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 1.25rem 0 0.5rem;
    animation: divider-expand 700ms cubic-bezier(0.22, 1, 0.36, 1) 150ms both;

    &::before,
    &::after {
      content: "";
      display: block;
      width: 3.5rem;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($secondary-background-color, 0.35),
        transparent
      );
    }

    span {
      display: block;
      width: 7px;
      height: 7px;
      background: rgba($secondary-background-color, 0.4);
      transform: rotate(45deg);
      flex-shrink: 0;
    }
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

  button {
    background-color: $secondary-background-color;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-variant: small-caps;
    font-size: 1.2em;
    font-weight: 500;
    letter-spacing: 0.04em;
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    &.btn-ghost {
      background-color: transparent;
      color: rgba($light-font-color, 0.5);
      border-color: rgba($light-font-color, 0.12);
      box-shadow: none;
      letter-spacing: 0.02em;

      &:hover,
      &:focus {
        color: rgba($light-font-color, 0.8);
        border-color: rgba($light-font-color, 0.25);
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
      font-family: "Bona Nova", Georgia, serif;
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
