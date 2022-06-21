<script setup>
const router = useRouter()
const { cart, updateLocalStorage } = useCart()
const { showCartSlideout } = useAppState()
const { saveOrder } = useHttp()

const checkout = async () => {
  showCartSlideout.value = false
  cart.value.status = 'cart'
  console.log(cart.value)
  // const newItems = []
  // let newTotal = 0

  // await Promise.all(
  //   cart.value.items.map(async (item) => {
  //     const response = await fetchDoc('products', item.product.id)
  //     console.log(response)
  //     if (response) {
  //       const product = response.doc
  //       const orderItem = await saveDoc('orderitems', {
  //         product: product,
  //         name: product.name,
  //         price: product.price,
  //         salePrice: product.salePrice,
  //         quantity: item.quantity,
  //       })

  //       if (orderItem) {
  //         newItems.push(orderItem)
  //         newTotal += product.price * item.quantity * 1
  //       }
  //     }
  //   })
  // )

  // console.log('PPPPP', newItems)
  // console.log(newTotal)

  // router.push({ name: 'ecommerce-checkout' })

  // const order = await saveOrder(cart.value)
  // if (order) {
  // cart.value = order
  // updateLocalStorage()
  router.push({ name: 'ecommerce-checkout' })
  // }
}
</script>

<template>
  <div>
    <div class="fixed inset-0 w-100vw h-100vh z-99 bg-slate-900 opacity-70"></div>
    <div class="fixed top-0 right-0 h-100vh z-99 max-w-415p w-100-percent text-slate-800">
      <ClientOnly>
        <div class="h-100vh flex-col justify-between bg-white">
          <div class="bg-stone-300 p-1 flex-row items-center justify-between py-1 px-2">
            <h3 class="font-bold text-md uppercase">Shopping Bag</h3>
            <button class="btn btn__close" @click.prevent="showCartSlideout = false"><IconsClose /></button>
          </div>
          <div class="flex-1 p-2 flex-col gap-2">
            <div class="flex-row gap-1 items-center">
              <IconsCoffee class="w-4 h-4" />
              <div>
                <div class="font-bold">Free Coffee Samples with all orders.</div>
                <div>Add at Checkout</div>
              </div>
            </div>
            <div>
              <span>Free shipping from $35</span>
            </div>
            <div v-if="cart.items && cart.items.length">
              <EcommerceCheckoutCartItemList />
              <EcommerceCheckoutCartTotal />
              <p class="text-xs">(Shipping costs, special offers not included)</p>
            </div>
            <EcommerceCheckoutEmptyCart v-else class="bg-slate-50 p3" />
          </div>
          <div class="p-1 bg-stone-300">
            <div class="flex-row justify-end px-3" v-if="cart.items && cart.items.length">
              <button class="btn btn__checkout px-3 py-1" @click="checkout">Checkout</button>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
