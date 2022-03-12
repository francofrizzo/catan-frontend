<template>
  <div class="game-view">
    <template v-if="loading">Cargando...</template>
    <template v-else>
      <game-generator v-if="!gameStarted" />
      <playtable v-else />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import toastr from "toastr";

import GameInterface from "@/game/GameInterface";

import Playtable from "@/components/Screens/Playtable.vue";
import GameGenerator from "@/components/Screens/GameGenerator.vue";

export default defineComponent({
  data() {
    return {
      loading: true,
      game: new GameInterface(this.gameId),
    };
  },
  provide() {
    return {
      game: this.game,
    };
  },
  props: {
    gameId: { type: String, required: true },
  },
  computed: {
    gameStarted(): boolean {
      return this.game.started;
    },
  },
  async created() {
    try {
      await this.game.updateState();
      await this.game.subscribeToUpdates();
      this.loading = false;
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err?.toString() === "Error: GAME_NOT_FOUND"
      ) {
        toastr.error("La partida que buscas no existe.");
        this.$router.push({ name: "start" });
      }
    }
  },
  components: { Playtable, GameGenerator },
});
</script>

<style lang="scss">
.game-view {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
