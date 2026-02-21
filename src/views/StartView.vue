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
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("~@/assets/old-world-map.jpg") center / cover no-repeat;
    opacity: 0.4;
    mix-blend-mode: soft-light;
    filter: saturate(0.4);
    pointer-events: none;
  }
}
</style>
