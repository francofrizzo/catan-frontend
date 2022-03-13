<template>
  <div class="development-card" :class="{ disabled }">
    <div v-if="!noIcon" class="development-card-icon">D</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    disabled: { type: Boolean, default: false },
    noIcon: { type: Boolean, default: false },
  },
});
</script>

<style lang="scss">
.development-card {
  @include pillow;
  box-sizing: border-box;
  width: $development-card-width;
  height: $card-aspect-ratio * $development-card-width;
  font-size: $card-to-icon-size-proportion * $development-card-width;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-image: $development-card-gradient;

  .development-card-icon {
    font-weight: 600;
    color: $development-card-icon-color;
  }

  &.disabled {
    @include disabled;
  }
}

.card-deck {
  .development-card {
    padding-bottom: $quantity-indicator-size / 2;
  }
}
</style>
