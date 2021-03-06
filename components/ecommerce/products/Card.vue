<script setup>
const props = defineProps({
  product: {
    type: Object,
  },
  listStyle: {
    type: String,
    default: 'tile',
  },
  showQuantitySelector: {
    type: Boolean,
  },
})

const emit = defineEmits([
  'selectQuantityBtnClicked',
  'closeSelectQuantity',
  'toggleQuantitySelectors',
  'resetSelectQuantities',
])

const config = useRuntimeConfig()

const { cart } = useCart()

const router = useRouter()

const hideImage = ref(false)

const getcartItemCount = () => {
  if (cart.value.items && cart.value.items.length) {
    const found = cart.value.items.find((i) => i.product.id == props.product.id)
    return found ? found.quantity : 0
  }
  return 0
}
</script>
<template>
  <div class="card" :class="{ list: listStyle == 'list', tile: listStyle == 'tile' }">
    <div class="content">
      <div
        class="image-description cursor-pointer"
        @mouseenter="hideImage = true"
        @mouseleave="hideImage = false"
        v-if="listStyle == 'tile'"
      >
        <NuxtLink class="" :to="{ name: 'ecommerce-products-slug', params: { slug: product.slug } }">
          <div
            class="description w-14 h-14 flex-row justify-center items-center text-xs text-slate-600"
            v-if="listStyle == 'tile' && hideImage"
          >
            {{ product.description }}
          </div>
        </NuxtLink>
        <div class="image w-14 h-14 flex-row justify-center items-center overflow-hidden" v-if="!hideImage">
          <img
            class="w-full h-full cover br-3"
            v-if="product.gallery.length && product.gallery[0] && product.gallery[0].mimetype.includes('image')"
            :src="`${config.backendUrl}/${product.gallery[0].path}`"
          />
        </div>
      </div>
      <div class="image w-14 h-14 flex-row justify-center items-center overflow-hidden" v-else>
        <NuxtLink class="" :to="{ name: 'ecommerce-products-slug', params: { slug: product.slug } }">
          <img
            class="w-full h-full cover br-3"
            v-if="product.gallery.length && product.gallery[0] && product.gallery[0].mimetype.includes('image')"
            :src="`${config.backendUrl}/${product.gallery[0].path}`"
          />
        </NuxtLink>
      </div>
      <div class="title w-full flex-1 text-sm flex-col gap-1">
        <div class="flex-row justify-between">
          <div class="flex-col gap-1">
            <NuxtLink class="" :to="{ name: 'ecommerce-products-slug', params: { slug: product.slug } }">
              <div class="name font-bold">{{ product.name }}</div>
            </NuxtLink>
            <div class="text-slate-500" v-if="listStyle == 'list'">
              {{ product.description }}
            </div>
          </div>

          <NuxtLink
            class="py-02 text-xs -tems-self-center flex-row items-center gap-02"
            :to="{ name: 'ecommerce-products-slug', params: { slug: product.slug } }"
          >
            <IconsListBulleted class="icon fill-slate-600 cursor-pointer" />
            <span>Details</span>
          </NuxtLink>
        </div>

        <div class="flex-row gap-2 items-center">
          <div class="price text-yellow-700">${{ product.price.toFixed(2) }}</div>
          <EcommerceQuantitySelector
            :product="product"
            btnWidth="3rem"
            :minVal="0"
            :maxVal="9"
            :stepVal="1"
            :btnText="getcartItemCount()"
            :showQuantitySelector="showQuantitySelector"
            @toggleQuantitySelectors="$emit('toggleQuantitySelectors', $event)"
            @cancel="$emit('resetSelectQuantities')"
          />
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.card {
  border: 1px solid $slate-400;
  padding: 1rem;
  margin-top: -1px;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  &.list {
    .content {
      display: flex;
      gap: 2rem;
      align-items: center;
      .title {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-self: stretch;
      }
    }

    .icon {
      align-self: center;
    }
  }

  &.tile {
    width: 20%;
    margin-right: -1px;

    .content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;

      .title {
        display: flex;
        justify-content: space-between;
        // font-size: 1.4rem;
        padding: 0 1rem;
      }

      .price {
        font-size: 1.4rem;
      }
    }
  }
  img {
    transform: scale(105%);
  }

  .image-description {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;

    .image {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    .description {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
  }
}
</style>
