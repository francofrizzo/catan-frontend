<template>
  <div class="start-view">
    <initial-menu />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InitialMenu from "@/components/Screens/InitialMenu.vue";

export default defineComponent({
  components: { InitialMenu },
});
</script>

<style lang="scss">
.start-view {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
