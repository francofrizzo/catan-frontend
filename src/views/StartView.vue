<template>
  <div class="app-view">
    <initial-menu />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InitialMenu from "@/components/Screens/InitialMenu.vue";

export default defineComponent({
  components: { InitialMenu },
  mounted() {
    document.body.classList.add("show-map-bg");
  },
  beforeUnmount() {
    document.body.classList.remove("show-map-bg");
  },
});
</script>
