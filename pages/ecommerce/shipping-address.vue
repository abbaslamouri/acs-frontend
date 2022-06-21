<script setup>
const title = ref('Address | YRL')

const { cart, updateLocalStorage } = useCart()
const { errorMsg } = useAppState()
const { signup, isAuthenticated, updateLoggedInUserData } = useAuth()
const { fetchAll, fetchDoc, saveOrder, saveDoc } = useHttp()
const router = useRouter()
// const orderShippingAddress = ref({})
// const orderBillingAddress = ref({})
// const orderPhoneNumber = ref({})
const orderCustomer = ref({})
const countries = ref([])
const states = ref([])
let response
const blankPhoneNumber = { phoneType: 'Cell', phoneCountryCode: '62ae373e2347015d44d3fb2d', phoneNumber: '2165026378' }

// newPhoneNumbers.value.push({ phoneType: '', phoneCountryCode: '', phoneNumber: '' })
// const showAddressModal = ref()
response = await fetchAll('countries', { sort: 'countryName' })
// console.log(response)
if (response) countries.value = response.docs

response = await fetchAll('states', { sort: 'name' })
// console.log(response)
if (response) states.value = response.docs
// const states = await fetchAll('states', { sort: 'name' })
provide('countries', countries)
provide('states', states)

const currentCart = JSON.stringify(cart.value)

cart.value.shippingAddress = cart.value.shippingAddress
  ? cart.value.shippingAddress
  : {
      addressType: 'Residential',
      company: 'YRL Consulting, LLC',
      addressLine1: '11 Alpha Park',
      addressLine2: 'Room 6',
      city: 'Highland Heights',
      state: '62ae38b407479c2cdf9b4ff8',
      postalCode: '44143',
      country: '62ae373e2347015d44d3fb2d',
      deliveryInstructions: 'Take good care of goods',
    }
cart.value.email = cart.value.email ? cart.value.email : 'lamouri@genvac.com'
cart.value.name = cart.value.name ? cart.value.name : 'Abbas Lamouri'
cart.value.title = cart.value.title ? cart.value.title : 'Mr.'
cart.value.billingAddress = cart.value.billingAddress ? cart.value.billingAddress : { sameAsShipping: true }
cart.value.phoneNumber = cart.value.phoneNumber ? cart.value.phoneNumber : { ...blankPhoneNumber, isDefault: true }

//   (cart.value.customer = cart.value.customer
//     ? cart.value.customer
//     : {
//         email: 'lamouri@genvac.com',
//         shippingAddresses: [
//           {
//             addressType: 'Residential',
//             title: 'Mr',
//             name: 'Abbas Lamouri',
//             company: 'YRL Consulting, LLC',
//             addressLine1: '11 Alpha Park',
//             addressLine2: 'Room 6',
//             city: 'Highland Heights',
//             state: '62ae38b407479c2cdf9b4ff8',
//             postalCode: '44143',
//             country: '62ae373e2347015d44d3fb2d',
//             deliveryInstructions: 'Take good care of goods',
//           },
//         ],
//         billingAddress: { sameAsShipping: true },
//         phoneNumbers: [blankPhoneNumber],
//       })
// )

// const insertNewPhoneNumber = () => {
//   console.log('HHHHHH')
//   cart.value.customer.phoneNumbers.push({ phoneType: '', phoneCountryCode: '', phoneNumber: '' })
// }

const updateDbOrder = async () => {
  const order = await saveOrder(cart.value)
  console.log('OOOO', order)
  if (order) {
    // cart.value = order
    // updateLocalStorage()
  }
}

const updatePhoneNumbers = (event) => {
  console.log('EE', event)
  cart.value.customerPhoneNumber = event[0]
  console.log(cart.value)
}

const updateorderShippingAddress = (event) => {
  console.log('EE', event)
  orderShippingAddress = event
  console.log(cart.value)
}

const updateorderBillingAddress = (event) => {
  console.log('EE', event)
  orderBillingAddress = event
  console.log(cart.value)
}

const goBack = () => {
  cart.value = JSON.parse(currentCart)
  console.log(cart.value)
  router.push({ name: 'ecommerce-checkout' })
}

const continueToShipping = async () => {
  // console.log(cart.value)
  // if (!cart.value.customerPhoneNumber || !cart.value.customerPhoneNumber.phoneNumber)
  //   return (errorMsg.value = 'Phone number is required')

  // const customePhNbr = await saveDoc('phonenumbers', cart.value.customerPhoneNumber)
  // // console.log(customePhNbr)
  // if (customePhNbr) {
  //   orderShippingAddress.phoneNumber = customePhNbr
  //   cart.value.customerPhoneNumber = customePhNbr
  // }

  // const shippingAdrs = await saveDoc('shippingaddresses', orderShippingAddress)
  // // console.log(shippingAdrs)
  // if (shippingAdrs) orderShippingAddress = shippingAdrs
  // cart.value.customer.shippingAddresses[0].isDefault = true

  // cart.value.shippingAddress = cart.value.customer.shippingAddresses.find((a) => a.isDefault)
  // cart.value.billingAddress = cart.value.customer.billingAddress
  // cart.value.phoneNumber = cart.value.customer.phoneNumbers[0]

  // cart.value.billingAddress =
  //   cart.value.customer.billingAddress && cart.value.customer.billingAddress.sameAsShipping
  //     ? {
  //         ...cart.value.customer.billingAddress,
  //         addressLine1: cart.value.customer.shippingAddresses[0].addressLine1,
  //         addressLine2: cart.value.customer.shippingAddresses[0].addressLine2,
  //         city: cart.value.customer.shippingAddresses[0].city,
  //         state: cart.value.customer.shippingAddresses[0].state,
  //         postalCode: cart.value.customer.shippingAddresses[0].postalCode,
  //         country: cart.value.customer.shippingAddresses[0].country,
  //       }
  //     : cart.value.customer.billingAddress

  // const billingAdrs = await saveDoc('billingaddresses', orderBillingAddress)
  // // console.log(billingAdrs)
  // if (billingAdrs) orderShippingAddress = billingAdrs

  // cart.value.customer.title = cart.value.shippingAddress.title
  // cart.value.customer.name = cart.value.shippingAddress.name
  // cart.value.customer.email = cart.value.shippingAddress.email
  // cart.value.customer.password = '$3f%6X*kqRN!5+nDwWYmgnb='
  // cart.value.customer.role = 'customer'
  // cart.value.customer.shippingAddresses = [orderShippingAddress]
  // cart.value.customer.billingAddress = orderBillingAddress
  // cart.value.customer.phoneNumbers = [cart.value.phoneNumber]
  // const customer = await signup(cart.value.customer)
  // console.log('CUSTOMER', customer)

  // if (cart.value.customer.billingAddress.sameAsShipping) {
  //   cart.value.customer.billingAddress = {
  //     ...cart.value.customer.billingAddress,
  //     addressLine1: cart.value.customer.shippingAddresses[0].addressLine1,
  //     addressLine2: cart.value.customer.shippingAddresses[0].addressLine2,
  //     city: cart.value.customer.shippingAddresses[0].city,
  //     state: cart.value.customer.shippingAddresses[0].state,
  //     postalCode: cart.value.customer.shippingAddresses[0].postalCode,
  //     country: cart.value.customer.shippingAddresses[0].country,
  //   }
  // }
  // cart.value.customer.phoneNumbers[0].isDefault = true
  // cart.value.customer.email = cart.value.customer.shippingAddresses[0].email
  // cart.value.customer.name = cart.value.customer.shippingAddresses[0].name
  cart.value.status = 'address'
  if (cart.value.billingAddress.sameAsShipping) cart.value.billingAddress = { ...cart.value.shippingAddress }

  const verifiedItems = []
  await Promise.all(
    cart.value.items.map(async (item) => {
      // let newItem
      const product = await fetchDoc('products', item.product.id)
      console.log('PPPPP', product)
      if (!product) return
      const newItemParts = {
        product,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        quantity: item.quantity,
      }

      const newItem = await saveDoc('orderitems', { ...item, newItemParts })
      if (!newItem) return

      const response = await fetchAll('orderitems', { _id: newItem.id, populate: "product" })
      if (!response) return

      verifiedItems.push(response.docs[0])
      cart.value.total += response.docs[0].product.price * response.docs[0].quantity * 1
    })
  )
  cart.value.items = verifiedItems

  const phoneNumber = await saveDoc('phonenumbers', cart.value.phoneNumber)
  if (phoneNumber) cart.value.phoneNumber = phoneNumber

  const shippingAddress = await saveDoc('shippingaddresses', cart.value.shippingAddress)
  if (shippingAddress) cart.value.shippingAddress = shippingAddress

  const billingAddress = await saveDoc('billingaddresses', cart.value.billingAddress)
  if (billingAddress) cart.value.billingAddress = billingAddress
  updateLocalStorage()

  console.log(cart.value)

  // console.log(response)
  // updateDbOrder()
  // if (isAuthenticated.value) {
  //   const response = await updateLoggedInUserData({
  //     shippingAddresses: cart.value.customer.shippingAddresses,
  //   })
  //   console.log('RRRRRR', response)
  // }
  // router.push({ name: 'ecommerce-shipping' })
}

onMounted(() => {
  // console.log(cart.value)
  // cart.value.customer.phoneNumbers = [{ phoneType: '', phoneCountryCode: '', phoneNumber: '' }]
  // cart.value.customer.shippingAddresses = [{}]
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
</script>

<template>
  <div class="secure w-full flex-1 bg-slate-900 flex-col items-center gap-1">
    <div class="content flex-row items-start w-996p">
      <EcommerceCheckoutSteps :step="2" activeColor="#16a34a" />
    </div>
    <ClientOnly>
      <div class="w-996p flex-col gap-2" v-if="cart.items && cart.items.length">
        <!-- <div class="flex-row gap-2"> -->
        <!-- <div class="flex-1"> -->
        <EcommerceCheckoutAddressForm :countries="countries" :states="states" />
        <div class="flex-row items-end justify-between gap-2 px-3 py-1 text-sm bg-slate-50">
          <button class="btn btn__link px-2 py-05 gap-05 text-sm tracking-wide items-center" @click="goBack">
            <IconsArrowWest class="fill-yellow-800 w-2 h-2" />Back to Basket
          </button>
          <button class="btn btn__checkout px-2 py-05" @click="continueToShipping">
            continue<IconsChevronRight />
          </button>
        </div>
        <!-- </div> -->

        <!-- <EcommerceCheckoutBillingAddressForm
            class="flex-row gap-2 bg-slate-50 p-2 min-w-30"
            :countries="countries"
            :states="states"
            :billingAddress="cart.billingAddress"
            @updateorderBillingAddress="updateorderBillingAddress"
          /> -->
        <!-- </div> -->
      </div>
      <EcommerceCheckoutEmptyCart v-else class="bg-slate-50 p3" />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped></style>
