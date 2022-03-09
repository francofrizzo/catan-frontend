<template>
  <div class="inactive-player-area">
    <p><strong>Resource cards:</strong> {{ player.resourcesCount }}</p>

    <h4>Development cards</h4>
    <ul class="resources">
      <li v-for="card in player.playedDevelopmentCards" :key="card.id">
        {{ card.type }}
      </li>
      <li>
        {{ player.developmentCardCount - player.playedDevelopmentCards.length }}
        not played yet.
      </li>
    </ul>

    <h4>Achievement tokens</h4>
    <ul class="resources">
      <li v-for="token in player.achievementTokens" :key="token.id">
        {{ token.type }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Player from "@/models/Player";

export default defineComponent({
  props: {
    player: { type: Object as PropType<Player>, required: true },
  },
});
</script>
