<script setup>
const title = ref('Secure | YRL')

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

const { user, token, isAuthenticated, signin } = useAuth()
const { errorMsg, message } = useAppState()
const { cart, updateLocalStorage } = useCart()
const { fetchAll, saveOrder } = useHttp()

// import { useAuth } from '~/store/useAuth'
// import { useCart } from '~/store/useCart'
// import { useMessage } from '~/store/useMessage'

// const router = useRouter()

// const auth = useAuth()
// const { cart } = useCart()
// onMounted(() => {
// cart.value = JSON.parse(localStorage.getItem('cart')) || {}

// console.log(cart.value)
// })
// const appMessage = useMessage()

const formUser = reactive({
  email: 'abbaslamouri@yrlus.com',
  password: 'adrar0714',
})

const updateDbOrder = async () => {
  const order = await saveOrder(cart.value)
  console.log('OOOO', order)
  if (order) {
    cart.value.id = order.id
    updateLocalStorage()
  }
}

const login = async () => {
  const response = await signin(formUser)
  if (!response) return
  const customer = user.value
  cart.value.customer = customer
  cart.value.name = customer.name
  cart.value.email = customer.email
  cart.value.billingAddress = customer.billingAddress
  const cartShippingAddress = customer.shippingAddresses.find((a) => a.isDefault)
  if (cartShippingAddress) cart.value.shippingAddress = cartShippingAddress
  else cart.value.shippingAddress = customer.shippingAddresses[0]
  const cartPhoneNumber = customer.phoneNumbers.find((p) => p.isDefault)
  if (cartPhoneNumber) cart.value.phoneNumber = cartPhoneNumber
  else cart.value.phoneNumber = customer.phoneNumbers[0]

  updateLocalStorage()

  console.log(cart.value)

  if (
    !cart.value.billingAddress ||
    cart.value.shippingAddresses ||
    !cart.value.shippingAddresses.length ||
    !cart.value.phoneNumbers ||
    !cart.value.phoneNumbers.length
  )
    return router.push({ name: 'ecommerce-shipping-address' })

  router.push({ name: 'ecommerce-shipping' })

  // const auth = useCookie('auth', {
  //   expires: new Date(Date.now() + config.COOKIE_EXPIRES_IN * 24 * 3600 * 1000),
  //   path: '/',
  // })
  // auth.value = data.auth
  // user.value = data.auth.user
  // token.value = data.auth.token
  // isAuthenticated.value = true
  // cart.value.customer = data.auth.user
  // if (!cart.value.customer.shippingAddresses.length) {
  //   cart.value.status = 'address'
  //   updateDbOrder()
  //   router.push({ name: 'ecommerce-customer-address' })
  // } else {
  //   cart.value.status = 'shipping'
  //   const i = cart.value.customer.shippingAddresses.findIndex((a) => a.selected)
  //   if (i === -1) {
  //     const j = cart.value.customer.shippingAddresses.findIndex((a) => a.isDefault)
  //     if (j !== -1) cart.value.customer.shippingAddresses[j].selected = true
  //     else cart.value.customer.shippingAddresses[0].selected = true
  //     updateDbOrder()
  //   }
  // }
  // }
  // appMessage.errorMsg = null
  // appMessage.successMsg = null
  // try {
  // 	let response = await $fetch('/api/v1/auth/login', {
  // 		method: 'POST',
  // 		body: user,
  // 	})
  // 	auth.user = response.user
  // 	auth.token = response.token
  // 	appMessage.showCartSlideout = false
  // 	// if (auth.authenticated) {
  // 	appMessage.errorMsg = null
  // 	// try {
  // 	response = await $fetch('/api/v1/users', { params: { id: auth.user._id } })
  // 	cart.updateCartCustomer(response)
  // 	router.push({ name: 'checkout' })
  // } catch (error) {
  // 	appMessage.errorMsg = error.data
  // }
  // router.push({ name: 'checkout' })
}

const checkoutAsGuest = () => {
  cart.value.customer = {
    title: 'Mr',
    name: 'Abbas Lamouri',
    email: 'abbaslamouri@yrlus.com',
    shippingAddresses: [
      {
        addressType: 'Residential',
        company: 'YRL Consulting, LLC',
        addressLine1: '11 Alpha Park',
        addressLine2: 'Room 6',
        city: 'Highland Heights',
        state: '62ae38b407479c2cdf9b4ff8',
        postalCode: '44143',
        country: '62ae373e2347015d44d3fb2d',
        deliveryInstructions: 'Take good care of goods',
        isDefault: true,
      },
    ],
    billingAddress: {},
    phoneNumbers: [
      { phoneType: 'Cell', phoneCountryCode: '62ae373e2347015d44d3fb2d', phoneNumber: '2165026378', isDefault: true },
    ],
  }
  updateLocalStorage()

  router.push({ name: 'ecommerce-shipping-address' })
}
</script>

<template>
  <div class="w-full flex-1 bg-slate-900 flex-row justify-center">
    <Title>{{ title }}</Title>
    <div class="content flex-row items-start gap-2 w-996p">
      <div class="flex-1 bg-slate-50 h-35 mt-6">
        <h3 class="bg-stone-200 px-2 py-1 uppercase tracking-wide text-sm">I am a Returning Customer</h3>
        <form @submit.prevent="login" class="main p-2 flex-col items-center gap-2">
          <div class="w-full">
            <FormsBaseInput type="email" label="Email" v-model="formUser.email" :required="true" />
          </div>
          <div class="w-full">
            <FormsBaseInput type="password" label="Password" v-model="formUser.password" :required="true" />
          </div>

          <button class="btn btn__primary items-self-end px-2 py-1">Sign In <IconsChevronRight /></button>
          <NuxtLink class="link items-self-start" :to="{ name: `index` }">Forgot Password?</NuxtLink>
        </form>
      </div>
      <div class="flex-1 bg-slate-50 h-35 mt-6">
        <h3 class="bg-stone-200 px-2 py-1 uppercase tracking-wide text-sm">I am a New Customer</h3>
        <div class="main p-2 flex-col items-center gap-1">
          <h4 class="text-center">Create a YRL account</h4>
          <p class="text-center">and receive these great benefits</p>
          <div class="promos flex-row justify-evenly my-4 w-full">
            <div class="flex-col justify-center items-center font-bold text-sm">
              <IconsWelcomeGift />
              <p>Welcome</p>
              <p>Gift</p>
            </div>
            <div class="flex-col justify-center items-center font-bold text-sm">
              <IconsFirstClass />
              <p>Early Coffee</p>
              <p>Access</p>
            </div>
            <div class="flex-col justify-center items-center font-bold text-sm">
              <IconsShoppingBag />
              <p>Exclusive</p>
              <p>Promotions</p>
            </div>
            <div class="flex-col justify-center items-center font-bold text-sm">
              <IconsShoppingCartCheckout />
              <p>Express</p>
              <p>Checkout</p>
            </div>
          </div>
          <div class="actions flex-row gap-2">
            <NuxtLink class="btn btn__checkout text-xs px-2 py-1" :to="{ name: 'auth-signup' }">
              <span>Create an Accoun</span>
            </NuxtLink>
            <!-- <button class="btn btn__link items-self-end px-2 py-1" @click="guestCheckout">
              Checkout as a guest <IconsChevronRight class="fill-yellow-700" />
            </button> -->
            <button class="btn btn__link" @click="checkoutAsGuest">
              <span>Checkout as a guest</span>
              <IconsChevronRight class="fill-yellow-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
