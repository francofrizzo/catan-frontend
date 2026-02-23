<template>
  <div
    class="dice-canvas"
    :style="{ transform: `rotate(${canvasRotation}deg)` }"
  >
    <div class="dice" :class="`dice-${dice[0]}`">
      <div
        class="dice-inner"
        :style="{ transform: `rotate(${dice1Rotation}deg)` }"
      ></div>
    </div>
    <div class="dice" :class="`dice-${dice[1]}`">
      <div
        class="dice-inner"
        :style="{ transform: `rotate(${dice2Rotation}deg)` }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  data: () => ({
    canvasRotation: Math.floor(Math.random() * 360),
    dice1Rotation: Math.floor(Math.random() * 360),
    dice2Rotation: Math.floor(Math.random() * 360),
  }),
  props: {
    dice: { type: Array as PropType<number[]>, required: true },
  },
});
</script>

<style lang="scss">
.dice-canvas {
  width: $dice-size + $dice-distance-x;
  height: $dice-size + $dice-distance-y;
  z-index: 100;
}

.dice {
  width: $dice-size;
  height: $dice-size;
  position: absolute;
  animation: rotate 500ms ease;

  &:nth-child(1) {
    left: 0;
    top: 0;
  }

  &:nth-child(2) {
    left: $dice-distance-x;
    top: $dice-distance-y;
  }

  .dice-inner {
    width: 100%;
    height: 100%;
  }
}

@each $i in (1, 2, 3, 4, 5, 6) {
  .dice-#{$i} .dice-inner {
    background-image: url("../../assets/dice-#{$i}.webp");

    background-size: contain;
  }
}
</style>
