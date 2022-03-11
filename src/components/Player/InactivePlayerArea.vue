<template>
  <div class="inactive-player-area player-area-subarea">
    <div class="section resources">
      <resource-deck :quantity="player.resourcesCount" />
    </div>

    <div class="section development-cards">
      <development-card-deck :quantity="player.developmentCardCount" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Player from "@/models/Player";

import ResourceDeck from "@/components/Elements/ResourceDeck.vue";
import DevelopmentCardDeck from "@/components/Elements/DevelopmentCardDeck.vue";

export default defineComponent({
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
  components: { ResourceDeck, DevelopmentCardDeck },
});
</script>

<style lang="scss"></style>
