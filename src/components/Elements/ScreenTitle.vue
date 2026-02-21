<template>
  <div class="screen-title">
    <h1>CATÁN</h1>
    <div class="divider" aria-hidden="true"><span></span></div>
  </div>
</template>

<style lang="scss">
.screen-title {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 5rem;
    font-weight: 700;
    letter-spacing: 0.6rem;
    margin-bottom: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 60px rgba($secondary-background-color, 0.06);
    animation: menu-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 1.25rem 0 0.5rem;
    animation: divider-expand 700ms cubic-bezier(0.22, 1, 0.36, 1) 150ms both;

    &::before,
    &::after {
      content: "";
      display: block;
      width: 3.5rem;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($secondary-background-color, 0.35),
        transparent
      );
    }

    span {
      display: block;
      width: 7px;
      height: 7px;
      background: rgba($secondary-background-color, 0.4);
      transform: rotate(45deg);
      flex-shrink: 0;
    }
  }
}
</style>
