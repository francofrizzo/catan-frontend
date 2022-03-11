<template>
  <card-deck :quantity="quantity">
    <development-card :disabled="quantity === 0" />
    <template #extra-card>
      <development-card no-icon />
    </template>
  </card-deck>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import DevelopmentCard from "@/components/Elements/DevelopmentCard.vue";
import CardDeck from "@/components/Elements/CardDeck.vue";

export default defineComponent({
  props: {
    quantity: { type: Number, default: 1 },
  },
  components: { DevelopmentCard, CardDeck },
});
</script>
