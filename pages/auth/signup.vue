<script setup>
const title = ref('Products | YRL')

const config = useRuntimeConfig()
const router = useRouter()
const nuxtApp = useNuxtApp()

const { signup } = useAuth()
const { cart, updateLocalStorage } = useCart()
const { errorMsg, message } = useAppState()
const user = reactive({
  name: 'Abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  password: 'adrar0714',
  passwordConfirm: 'adrar0714',
})
const loading = ref(false)
onMounted(() => {
  console.log(window.location.protocol)
})
// let response
// const errorMsg = ref('')

const register = async () => {
  if (user.password !== user.passwordConfirm)
    return (errorMsg.value = "Your password and confirmation password don't match")
  const response = await signup({
    user,
    url: `${window.location.protocol}//${window.location.host}/auth/verify-email`,
    emailSubject: 'Please verify your email',
  })
  console.log('U', response)
  if (!response) return

  // response = await signupEmail({
  //   user: response.user,
  //   token: response.token,
  //   url: `http://localhost:3000/auth/verify-email`,
  //   emailSubject: 'Please verify your email',
  // })
  // console.log(response)
  // if (!response) return
  // router.push({ name: 'ecommerce-products' })
  message.value = 'Thank you for signing up.  Pleaase check your email to verify your account'

  // const customer = response.user
  // cart.value.customer = customer
  // cart.value.name = customer.name
  // cart.value.email = customer.email
  // cart.value.billingAddress = customer.billingAddress
  // const cartShippingAddress = customer.shippingAddresses.find((a) => a.isDefault)
  // if (cartShippingAddress) cart.value.shippingAddress = cartShippingAddress
  // else cart.value.shippingAddress = customer.shippingAddresses[0]
  // const cartPhoneNumber = customer.phoneNumbers.find((p) => p.isDefault)
  // if (cartPhoneNumber) cart.value.phoneNumber = cartPhoneNumber
  // else cart.value.phoneNumber = customer.phoneNumbers[0]

  // console.log(cart.value)

  // router.push({ name: 'ecommerce-shipping' })
}
</script>

<template>
  <div class="h-100vh flex-1 bg-slate-700 flex-row justify-center items-start pt-10">
    <Title>{{ title }}</Title>
    <div class="bg-slate-50 p-4 br-3 flex-row gap-2 w-996p">
      <div class="flex-col gap-1 min-w-30">
        <h2>Ready to try YRL</h2>
        <div class="flex-row items-center gap-1">
          <IconsCheck class="w-2 h-2 bg-slate-400 br-50per p-02 fill-slate-50" />
          <span>Forever free</span>
        </div>
        <div class="flex-row items-center gap-1">
          <IconsCheck class="w-2 h-2 bg-slate-400 br-50per p-02 fill-slate-50" />
          <span>No Credit card required</span>
        </div>
      </div>
      <AdminSignupForm :user="user" @updateUser="user = $event" @register="register" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
