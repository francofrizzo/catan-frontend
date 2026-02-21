<template>
  <div class="game-generator screen">
    <screen-title />
    <div class="menu-content">
      <div class="generator-body">
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
            <button
              class="btn-remove-player"
              @click="removePlayer(player.id)"
              title="Quitar jugador"
            >
              <X :size="14" :stroke-width="2" />
            </button>
          </div>
        </template>
        <form
          v-if="players.length < 4 && activePlayerId === null"
          @submit.prevent="createPlayer()"
        >
          <input type="text" v-model="creatingPlayerName" autofocus />
          <button type="submit">
            <UserPlus :size="16" :stroke-width="1.5" /> Agregar jugador
          </button>
        </form>
        <div class="option-row">
          <input type="checkbox" id="autocollect" v-model="autoCollect" />
          <label for="autocollect">Recolectar recursos automáticamente</label>
        </div>
        <div class="game-id">
          ID de partida: <code>{{ gameId }}</code>
        </div>
        <div class="form-actions">
          <button class="btn-ghost" @click="goBack()">
            <ArrowLeft :size="16" :stroke-width="1.5" /> Cancelar
          </button>
          <button :disabled="players.length < 3" @click="startGame()">
            <Play :size="16" :stroke-width="1.5" /> Comenzar partida
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { UserPlus, ArrowLeft, Play, X } from "lucide-vue-next";

import * as api from "@/api/actions";
import PlayerPicture from "@/components/Elements/PlayerPicture.vue";
import ScreenTitle from "@/components/Elements/ScreenTitle.vue";

export default defineComponent({
  components: { PlayerPicture, ScreenTitle, UserPlus, ArrowLeft, Play, X },
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
      this.creatingPlayerName = "";
    },
    removePlayer(playerId: number) {
      api.removePlayerFromGame(this.game.gameId, playerId);
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

  .menu-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 14rem;
  }

  .generator-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: menu-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) 300ms both;
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

    .btn-remove-player {
      all: unset;
      cursor: pointer;
      margin-left: 0.75rem;
      padding: 0.2rem;
      opacity: 0.35;
      transition: opacity 200ms ease;
      display: inline-flex;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .option-row {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  form {
    display: flex;
    align-items: center;
    margin-top: 1rem;

    input[type="text"] {
      font-family: "Bona Nova", Georgia, serif;
      font-size: 1.1em;
      width: 10rem;
    }
  }

  button,
  input[type="text"] {
    margin-top: 1rem;
    padding: 0.65rem 1.2rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
}
</style>
