<script setup>
const { numberOfItems } = useCart()
const { showCartSlideout } = useAppState()
</script>

<template>
  <div class="text-slate-600 br-3">
    <ClientOnly>
      <button
        class="btn bnt__secondary bg-white px-1 py-05 gap-1"
        :class="{ btn__checkout: numberOfItems() }"
        @click="showCartSlideout = true"
      >
        <IconsCartFill class="w-2 h-2 fill-slate-600" />
        <span class="text-xs">Your bag</span>
        <span class="">({{ numberOfItems() }})</span>
      </button>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

button {
  border: 1px solid $green-900;
  &:hover {
    border: 1px solid $green-400;

    span {
      // color: $slate-400;
    }

    svg {
      // fill: $slate-800;
    }
  }
}
</style>
