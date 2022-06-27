<script setup>
const title = ref('Products | YRL')

const router = useRouter()
const { cart, cartTotal, updateLocalStorage } = useCart()
const freeSamples = ref([])
const { isAuthenticated, fetchLoggedInUser } = useAuth()
const { fetchAll, saveOrder } = useHttp()

onMounted(() => {
  // cart.value = JSON.parse(localStorage.getItem('cart')) || {}
  // console.log(cart.value)
})

const updateDbOrder = async () => {
  const order = await saveOrder(cart.value)
  console.log('OOOO', order)
  if (order) {
    cart.value.id = order.id
    updateLocalStorage()
  }
}

const response = await fetchAll('products', { price: '0' })
if (response) freeSamples.value = response.docs

const checkout = async () => {
  cart.value.status = 'checkout'
  if (!isAuthenticated.value) return router.push({ name: 'ecommerce-secure' })

  const response = await fetchLoggedInUser()
  console.log(response)
  if (response && response.user) {
    cart.value.customer = response.user
    updateLocalStorage()
    console.log(cart.value)
    router.push({ name: 'ecommerce-shipping' })
  }

  // const customer = response.user
  // cart.value.name = customer.name
  // cart.value.email = customer.email
  // cart.value.billingAddress = customer.billingAddress
  // const cartShippingAddress = customer.shippingAddresses.find((a) => a.isDefault)
  // if (cartShippingAddress) cart.value.shippingAddress = cartShippingAddress
  // else cart.value.shippingAddress = customer.shippingAddresses[0]
  // const cartPhoneNumber = customer.phoneNumbers.find((p) => p.isDefault)
  // if (cartPhoneNumber) cart.value.phoneNumber = cartPhoneNumber
  // else cart.value.phoneNumber = customer.phoneNumbers[0]

  // if (
  //   !cart.value.billingAddress ||
  //   cart.value.shippingAddresses ||
  //   !cart.value.shippingAddresses.length ||
  //   !cart.value.phoneNumbers ||
  //   !cart.value.phoneNumbers.length
  // )
  //   return router.push({ name: 'ecommerce-shipping-address' })

  // router.push({ name: 'ecommerce-shipping' })
}
</script>

<template>
  <div class="flex-1 flex-col items-center bg-slate-900 p-3">
    <Title>{{ title }}</Title>
    <div class="w-996p">
      <div><EcommerceCheckoutSteps :step="1" /></div>
      <ClientOnly>
        <div class="flex-row items-start gap-2" v-if="cart.items && cart.items.length">
          <div class="flex-1 bg-slate-50 flex-col gap-2">
            <EcommerceCheckoutProductList />
            <nuxt-link class="link" :to="{ name: 'index' }">
              <IconsChevronLeft />
              <div>Continue Shopping</div>
            </nuxt-link>
            <EcommerceCheckoutCoupons />
            <div class="px-3">
              <EcommerceCheckoutCartTotal :showTaxesAndTotal="true" />
            </div>
            <div class="px-3 py-2 items-self-end">
              <button class="btn btn__checkout px-3 py-1" @click="checkout">Continue</button>
            </div>
          </div>
          <EcommerceCheckoutFreeItems :freeSamples="freeSamples" class="w-32" />
        </div>
        <EcommerceCheckoutEmptyCart v-else class="bg-slate-50 p3" />
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
