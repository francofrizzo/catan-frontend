<template>
  <div class="app-view">
    <template v-if="!game.gameState">
      <div class="loading">Cargando...</div>
    </template>
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
  watch: {
    gameStarted(started: boolean) {
      if (started) {
        document.body.classList.remove("show-map-bg");
      }
    },
  },
  mounted() {
    document.body.classList.add("show-map-bg");
  },
  beforeUnmount() {
    document.body.classList.remove("show-map-bg");
  },
  async created() {
    try {
      await this.game.subscribeToUpdates();
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
.app-view .loading {
  font-size: 1.35rem;
}
</style>
