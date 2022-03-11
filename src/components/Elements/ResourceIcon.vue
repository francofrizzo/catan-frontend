<template>
  <div
    class="resource-icon"
    :class="`resource-icon-${resource.toLowerCase()}`"
  ></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Resource from "@/models/Resource";

export default defineComponent({
  props: {
    resource: { type: String as PropType<Resource>, required: true },
  },
});
</script>

<style lang="scss">
$resource-images: (
  "brick": "brick.png",
  "grain": "grain.png",
  "lumber": "wood.png",
  "ore": "ore.png",
  "wool": "sheep.png",
);

.resource-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  background-size: contain;
}

@each $resource, $image in $resource-images {
  .resource-icon-#{$resource} {
    background-image: url("../../assets/#{$image}");
  }
}
</style>
