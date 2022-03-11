<template>
  <card-deck :quantity="quantity">
    <resource-card :resource="resource" :disabled="quantity === 0" />
    <template #extra-card>
      <resource-card no-icon :resource="resource" />
    </template>
  </card-deck>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Resource from "@/models/Resource";

import ResourceCard from "@/components/Elements/ResourceCard.vue";
import CardDeck from "@/components/Elements/CardDeck.vue";

export default defineComponent({
  props: {
    resource: { type: String as PropType<Resource> },
    quantity: { type: Number, default: 1 },
  },
  components: { ResourceCard, CardDeck },
});
</script>
