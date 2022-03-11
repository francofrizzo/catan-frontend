<template>
  <div
    class="resource-card"
    :class="[
      `resource-card-${resource ? resource.toLowerCase() : 'unknown'}`,
      { disabled },
    ]"
  >
    <template v-if="!noIcon">
      <resource-icon v-if="resource" :resource="resource" />
      <span class="unknown-resource-icon" v-else>R</span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ResourceIcon from "@/components/Elements/ResourceIcon.vue";

import Resource from "@/models/Resource";

export default defineComponent({
  props: {
    resource: { type: String as PropType<Resource> },
    disabled: { type: Boolean, default: false },
    noIcon: { type: Boolean, default: false },
  },
  components: { ResourceIcon },
});
</script>

<style lang="scss">
.resource-card {
  @include pillow;
  box-sizing: border-box;
  width: $resource-card-width;
  height: $card-aspect-ratio * $resource-card-width;
  font-size: $card-to-icon-size-proportion * $resource-card-width;
  display: flex;
  align-items: center;
  justify-content: center;

  .unknown-resource-icon {
    font-weight: 600;
    color: $unknown-resource-icon-color;
  }

  &.disabled {
    @include disabled;
  }
}

.card-deck {
  .resource-card {
    padding-bottom: $quantity-indicator-size / 2;
  }
}

@each $resource, $gradient in $resource-gradients {
  .resource-card-#{$resource} {
    background-image: $gradient;
  }
}
</style>
