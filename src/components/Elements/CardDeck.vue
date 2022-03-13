<template>
  <div class="card-deck">
    <div
      class="extra-card-container"
      v-for="i in Math.max(0, quantity - 1)"
      :key="i"
    >
      <div class="extra-card-content">
        <slot name="extra-card" v-bind="{ index: i }"><slot></slot></slot>
      </div>
    </div>
    <div class="main-card-container">
      <div class="main-card-content">
        <slot></slot>
      </div>
      <div class="quantity-indicator">
        {{ quantity }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    quantity: { type: Number, default: 1 },
  },
});
</script>

<style lang="scss">
.card-deck {
  display: inline-flex;
  flex-direction: row-reverse;
  vertical-align: bottom;

  .main-card-container {
    position: relative;
    display: flex;
    justify-content: center;
    z-index: 1;
  }

  .extra-card-container {
    opacity: 0.7;
    width: $card-deck-spacing;
    position: relative;
    z-index: 0;
  }

  .extra-card-content {
    position: absolute;
    top: 0;
    right: 0;
  }

  .main-card-container,
  .extra-card-container {
    padding-bottom: ($quantity-indicator-size / 2);
  }

  .quantity-indicator {
    position: absolute;
    bottom: 0;
    z-index: 2;
  }
}
</style>
