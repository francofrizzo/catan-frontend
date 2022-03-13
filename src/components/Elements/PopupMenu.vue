<template>
  <div class="popup-menu-container" :class="{ disabled }">
    <div class="popup-menu" v-show="!disabled">
      <slot name="buttons"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    disabled: { type: Boolean, default: false },
  },
});
</script>

<style lang="scss">
.popup-menu-container {
  position: relative;
  display: inline-block;

  &.disabled {
    @include disabled;
  }

  .popup-menu {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    flex-direction: column-reverse;
    padding-bottom: $quantity-indicator-size / 2 + 0.5rem;
    visibility: hidden;
    z-index: 1;

    button {
      @include round(1.75rem);
      font-size: 1.2rem;
      background-color: $secondary-background-color;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      margin-top: 0.2rem;
      transition: transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
        opacity 200ms ease;
      opacity: 0;
      transform: scale(-20%);
    }
  }

  &:hover {
    .popup-menu {
      visibility: visible;

      button {
        opacity: 1;
        transform: none;
      }
    }
  }
}
</style>
