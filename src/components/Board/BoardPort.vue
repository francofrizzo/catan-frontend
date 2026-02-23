<template>
  <div class="port">
    <div class="port-exchange-rate">{{ port.exchangeRate }}:1</div>
    <div class="port-icon">
      <resource-icon v-if="resource" :resource="resource" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ResourceIcon from "@/components/Elements/ResourceIcon.vue";

import Port from "@/models/Port";
import Resource from "@/models/Resource";

export default defineComponent({
  props: {
    port: { type: Object as PropType<Port>, required: true },
  },
  computed: {
    resource(): Resource | null {
      if (this.port.accepts.length === 1) {
        return this.port.accepts[0];
      } else {
        return null;
      }
    },
  },
  components: { ResourceIcon },
});
</script>

<style lang="scss">
.port {
  @include board-piece-image(url("../../assets/dock.webp"));
  background-position: center bottom;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  animation: fade-in 1600ms;

  width: $port-size;
  height: $port-size;

  margin-top: -($port-size / 2);

  .port-exchange-rate {
    color: $dark-font-color;
    font-size: 0.9rem;
    font-weight: 600;
    font-feature-settings: normal;
    filter: drop-shadow(0 0 3px white);
  }

  .port-icon {
    font-size: 1.54rem;
    filter: drop-shadow(0 2px 3px black);
    margin-bottom: -10%;
  }
}
</style>
