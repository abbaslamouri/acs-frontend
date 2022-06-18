<script setup>
const props = defineProps({
  products: {
    type: Array,
  },
  listStyle: {
    type: String,
    default: 'tile',
  },
})

const emit = defineEmits(['toggleQuantitySelectors', 'resetSelectQuantities'])

const config = useRuntimeConfig()
const quantitySelectors = ref([])
// const showQuantitySelector = ref(false)

const resetSelectQuantities = () => {
  for (const prop in props.products) {
    quantitySelectors.value[prop] = false
  }
}

const toggleQuantitySelectors = (i, status) => {
  resetSelectQuantities()
  quantitySelectors.value[i] = status
  // addItem(props.products[i], event.quantity)
  // console.log(cart.value)
}
</script>
<template>
  <div class="product-list" :class="{ list: listStyle == 'list', tile: listStyle == 'tile' }" ref="scrollRef">
    <EcommerceProductsCard
      v-for="(product, i) in products"
      :key="product.id"
      :product="product"
      :listStyle="listStyle"
      :showQuantitySelector="quantitySelectors[i]"
      @toggleQuantitySelectors="toggleQuantitySelectors(i, $event)"
      @resetSelectQuantities="$emit('resetSelectQuantities')"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.product-list {
  &.tile {
    display: flex;
    // flex-direction: column;
    flex-wrap: wrap;
  }
}
</style>
