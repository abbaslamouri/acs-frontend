<script setup>
const title = ref('Address | YRL')

const { cart, updateLocalStorage } = useCart()
const { isAuthenticated, updateLoggedInUserData } = useAuth()
const { fetchAll, saveOrder } = useHttp()
const router = useRouter()
const newAddress = ref({})
const newEmail = ref('')
const newPhoneNumbers = ref([])
const countries = ref([])
const states = ref([])
let response

newPhoneNumbers.value.push({ phoneType: '', phoneCountryCode: '', phoneNumber: '' })
// const showAddressModal = ref()
response = await fetchAll('countries', { sort: 'countryName' })
console.log(response)
if (response) countries.value = response.docs

response = await fetchAll('states', { sort: 'name' })
console.log(response)
if (response) states.value = response.docs
// const states = await fetchAll('states', { sort: 'name' })
provide('countries', countries)
provide('states', states)

onMounted(() => {
  // if (
  //   cart.value.customer.shippingAddresses.length > 0 &&
  //   Object.values(cart.value.customer.shippingAddresses[0]).length
  // )
  //   address.value = cloneDeep(cart.value.customer.shippingAddresses[0])
  // else
  //   address.value = {
  //     email: 'abbaslamouri@yrlus.com',
  //     title: 'Mr',
  //     name: 'Abbas Lamouri',
  //     company: 'YRL Consulting LLC',
  //     addressLine1: '599 Deep Woods Dr.',
  //     city: 'Aurora',
  //     postalCode: '44202',
  //     state: states.find((s) => s._id == '624ef322b9e91e20c3e32390'), // set default to OH
  //     country: countries.find((c) => c._id == '624ef31fb9e91e20c3e3215e'), // Set default to USA
  //     phones: [
  //       {
  //         phoneType: 'Cell',
  //         phoneNumber: '2165026378',
  //         phoneCountryCode: countries.find((c) => c._id == '624ef31fb9e91e20c3e3215e'), // Set default to USA
  //       },
  //     ],
  //     deliveryInstructions: 'Some delivery instructions',
  //   }
})

const addNewAddress = () => {
  newAddress.value = {}
  showAddressModal.value = true
}

const updateDbOrder = async () => {
  const order = await saveOrder(cart.value)
  console.log('OOOO', order)
  if (order) {
    cart.value.id = order.id
    updateLocalStorage()
  }
}

const continueToShipping = async () => {
  cart.value.customer.shippingAddresses[0] = { ...address.value, selected: true, isDefault: true }
  cart.value.status = 'address'
  updateDbOrder()
  if (isAuthenticated.value) {
    const response = await updateLoggedInUserData({
      shippingAddresses: cart.value.customer.shippingAddresses,
    })
    console.log('RRRRRR', response)
  }
  router.push({ name: 'ecommerce-shipping' })
}
</script>

<template>
  <div class="secure w-full flex-1 bg-slate-900 flex-col items-center gap-1">
    <div class="content flex-row items-start gap-2 w-996p">
      <EcommerceCheckoutSteps :step="2" activeColor="#16a34a" />
    </div>
    <ClientOnly>
      <div class="w-996p bg-slate-50 p-2 flex-col gap-2" v-if="cart.items && cart.items.length">
        <!-- <EcommerceCheckoutShippingAddresses @addNewAddress="addNewAddress" /> -->
        <EcommerceCheckoutShippingAddressForm
          :countries="countries"
          :states="states"
          :email="newEmail"
          :phoneNumbers="newPhoneNumbers"
          :customerAddress="newAddress"
          @updateAddress="address = $event"
        />
        <div class="flex-row items-end justify-between gap-2 px-3 py-1 text-sm">
          <NuxtLink class="link btn__link" :to="{ name: 'ecommerce-checkout' }">
            <IconsChevronLeft /><span>Back to Basket</span>
          </NuxtLink>
          <button class="btn btn__checkout px-2 py-05" @click="continueToShipping">
            continue<IconsChevronRight />
          </button>
        </div>
      </div>
      <EcommerceCheckoutEmptyCart v-else class="bg-slate-50 p3" />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped></style>
