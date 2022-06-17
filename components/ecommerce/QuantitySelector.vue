<script setup>
const props = defineProps({
  product: {
    type: Object,
    // required: true
  },
  minVal: {
    type: Number,
    required: true,
  },
  maxVal: {
    type: Number,
    required: true,
  },
  stepVal: {
    type: Number,
    required: true,
  },
  btnText: {
    type: [String, Number],
  },
  showQuantitySelector: {
    type: Boolean,
  },
  btnWidth: {
    type: String,
    default: '0.2rem',
  },
  parentComponent: {
    type: String,
    default: 'products',
  },
})

const emit = defineEmits(['toggleQuantitySelectors', 'cancel'])
const { addItem } = useCart()
const uuid = useUniqueId().getId()
const quantity = ref(null)
const quantitySelectorPosition = ref(null)
const quantityArr = ref([])
const quantitySelectorOffset = ref(null)
const cartQuantitySelectorOffset = ref(null)

let i = props.minVal
while (i <= props.maxVal) {
  quantityArr.value.push(i)
  i += props.stepVal
}
if (quantityArr.value.length <= 5) {
  quantitySelectorOffset.value = `-85px`
  cartQuantitySelectorOffset.value = `-25px`
} else if (quantityArr.value.length > 5 && quantityArr.value.length <= 10) {
  quantitySelectorOffset.value = `-150px`
  cartQuantitySelectorOffset.value = `-40px`
} else if (quantityArr.value.length > 10 && quantityArr.value.length <= 15) {
  quantitySelectorOffset.value = `-190px`
  cartQuantitySelectorOffset.value = `-55px`
} else if (quantityArr.value.length > 15 && quantityArr.value.length <= 20) {
  quantitySelectorOffset.value = `-230px`
  cartQuantitySelectorOffset.value = `-70px`
} else if (quantityArr.value.length > 20 && quantityArr.value.length <= 25) {
  quantitySelectorOffset.value = `-270px`
  cartQuantitySelectorOffset.value = `-85px`
} else if (quantityArr.value.length > 25 && quantityArr.value.length <= 30) {
  quantitySelectorOffset.value = `-310px`
  cartQuantitySelectorOffset.value = `-100px`
} else {
  quantitySelectorOffset.value = `-350px`
  cartQuantitySelectorOffset.value = `-100px`
}

if (process.client) {
  document.addEventListener('click', (event) => {
    if (
      !event.target.closest(`.quantity-selector-${uuid}`) &&
      !event.target.classList.contains(`quantity-selector-input`)
    ) {
      emit('cancel')
    }
  })
}
const setQuantitySelectorPosition = (event) => {
  console.log(event.target.getBoundingClientRect())
  const position = event.target.getBoundingClientRect().y
  if (position < 320) quantitySelectorPosition.value = 'below'
  else quantitySelectorPosition.value = null
  emit('toggleQuantitySelectors', !props.showQuantitySelector)
}

const setQuantity = (qty) => {
  emit('toggleQuantitySelectors', false)
  addItem(props.product, qty)
  quantity.value = null
}
</script>

<template>
  <div class="quantity-selector relative flex-row justify-center" :class="{ cart: parentComponent === 'cart' }">
    <client-only>
      <button
        class="qtyBtn btn btn__quantity-selector"
        @click.stop="setQuantitySelectorPosition"
        v-if="parentComponent !== 'product'"
      >
        <div class="" v-if="btnText">{{ btnText }}</div>
        <IconsPlus v-else class="w-2 h-2 fill-slate-50" />
      </button>
      <button
        class="qty-btn-product btn btn__quantity-selector"
        :class="{ 'btn-text': btnText }"
        @click.stop="setQuantitySelectorPosition"
        v-else
      >
        <div class="flex-row items-center gap-1" v-if="btnText">
          <div class="qty">{{ btnText }}</div>
          <div>Update</div>
        </div>
        <div class="px-1 flex-row items-center justify-between gap-2" v-else>
          <IconsCart />
          <span>Add To Bag</span>
          <IconsPlus/>
        </div>
      </button>
    </client-only>
    <div
      class="selector absolute bg-stone-200 z-9 p-1 br-3"
      v-if="showQuantitySelector"
      :class="quantitySelectorPosition"
    >
      <ul class="flex-row wrap">
        <li
          class="quantity flex-row justify-center text-xs cursor-pointer w-3 h-3"
          v-for="n in quantityArr"
          :key="`predefined-quantity-${n}`"
          @click="setQuantity(n)"
        >
          <span>{{ n }}</span>
        </li>
      </ul>
      <div class="flex-row">
        <input
          class="px-05 w-12 text-xs"
          type="text"
          v-model="quantity"
          placeholder="Custom quantity"
          @change="setQuantity(quantity)"
        />
        <button class="btn btn__quantity-selector p-05" @click="setQuantity(quantity)">OK</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.quantity-selector {
  .qtyBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: v-bind(btnWidth);
    height: v-bind(btnWidth);
  }

  .qty-btn-product {
    padding: 1rem 2rem 1rem 1rem;
    border-radius: 3px;

    &.btn-text {
      border-radius: 2rem;
    }

    .qty {
      background-color: $slate-50;
      width: 2rem;
      height: 2rem;
      border-radius: 1rem;
      color: $green-900;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .selector {
    top: v-bind(quantitySelectorOffset);
    left: 50%;
    width: 170px;
    transform: translateX(-50%);
    background-color: $stone-300;

    // input{
    //   width: 12rem;
    // }

    &.below {
      top: 130%;
      &::before {
        top: -20px;
        border-color: transparent transparent $stone-300 transparent;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px;
      border-style: solid;
      border-color: $stone-300 transparent transparent transparent;
    }

    .quantity {
      border-right: 1px solid $stone-400;
      span {
        padding: 0.5rem;
        border-radius: 3px;
        // width: 30px;
        // height: 30px;
        text-align: center;
      }

      &:hover {
        span {
          border: 1px solid $stone-400;
        }
      }

      &:nth-of-type(5n) {
        border-right: none;
      }
    }
  }

  &.cart {
    .selector {
      top: v-bind(cartQuantitySelectorOffset);
      left: -95px;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 170px;
        transform: translateY(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent transparent $stone-300;
      }
    }
  }
}
</style>
