<template>
  <div class="inactive-player-area player-area-subarea">
    <div class="section cards">
      <card-deck
        class="development-cards"
        :quantity="player.developmentCardCount"
      >
        <development-card :disabled="player.developmentCardCount === 0" />
        <template #extra-card>
          <development-card no-icon :development="resource" />
        </template>
      </card-deck>

      <card-deck class="resources" :quantity="player.resourcesCount">
        <resource-card :disabled="player.resourcesCount === 0" />
        <template #extra-card>
          <resource-card no-icon />
        </template>
      </card-deck>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Player from "@/models/Player";

import CardDeck from "@/components/Elements/CardDeck.vue";
import ResourceCard from "@/components/Elements/ResourceCard.vue";
import DevelopmentCard from "@/components/Elements/DevelopmentCard.vue";

export default defineComponent({
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
  components: { CardDeck, ResourceCard, DevelopmentCard },
});
</script>

<style lang="scss">
.inactive-player-area {
  .section.cards {
    display: inline-flex;
  }
}
</style>
