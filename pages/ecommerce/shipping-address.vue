<script setup>
const title = ref('Address | YRL')

const { cart, updateLocalStorage } = useCart()
const { errorMsg } = useAppState()
const { signup, isAuthenticated, updateLoggedInUserData } = useAuth()
const { fetchAll, saveOrder, saveDoc } = useHttp()
const router = useRouter()
// const newAddress = ref({})
// const newEmail = ref('')
// const newPhoneNumbers = ref([])
const countries = ref([])
const states = ref([])
let response

// newPhoneNumbers.value.push({ phoneType: '', phoneCountryCode: '', phoneNumber: '' })
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

// const addNewAddress = () => {
//   newAddress.value = {}
//   showAddressModal.value = true
// }

const currentCart = JSON.stringify(cart.value)

if (!cart.value.shippingAddress)
	cart.value.shippingAddress = {
		title: 'Mr',
		name: 'Abbas Lamouri',
		email: 'lamouri@genvac.com',
		company: 'YRL Consulting, LLC',
		addressLine1: '11 Alpha Park',
		addressLine2: 'Room 6',
		city: 'Highland Heights',
		state: '62ae38b407479c2cdf9b4ff8',
		postalCode: '44143',
		country: '62ae373e2347015d44d3fb2d',
		deliveryInstructions: 'Take good care of goods',
	}
if (!cart.value.billingAddress) cart.value.billingAddress = { sameAsShipping: true }
// if (!cart.value.phoneNumber) cart.value.phoneNumbers = []

const updateDbOrder = async () => {
	const order = await saveOrder(cart.value)
	console.log('OOOO', order)
	if (order) {
		cart.value.id = order.id
		updateLocalStorage()
	}
}

const updatePhoneNumbers = (event) => {
	console.log('EE', event)
	cart.value.customerPhoneNumber = event[0]
	console.log(cart.value)
}

const updateCustomerShippingAddress = (event) => {
	console.log('EE', event)
	cart.value.shippingAddress = event
	console.log(cart.value)
}

const updateCustomerBillingAddress = (event) => {
	console.log('EE', event)
	cart.value.billingAddress = event
	console.log(cart.value)
}

const goBack = () => {
	cart.value = JSON.parse(currentCart)
	console.log(cart.value)
	router.push({ name: 'ecommerce-checkout' })
}

const continueToShipping = async () => {
	console.log(cart.value)
	if (!cart.value.customerPhoneNumber || !cart.value.customerPhoneNumber.phoneNumber)
		return (errorMsg.value = 'Phone number is required')

	const customePhNbr = await saveDoc('phonenumbers', cart.value.customerPhoneNumber)
	// console.log(customePhNbr)
	if (customePhNbr) {
		cart.value.shippingAddress.phoneNumber = customePhNbr
		cart.value.customerPhoneNumber = customePhNbr
	}

	const shippingAdrs = await saveDoc('shippingaddresses', cart.value.shippingAddress)
	// console.log(shippingAdrs)
	if (shippingAdrs) cart.value.shippingAddress = shippingAdrs

	if (cart.value.billingAddress && cart.value.billingAddress.sameAsShipping) {
		cart.value.billingAddress = {
			...cart.value.billingAddress,
			addressLine1: cart.value.shippingAddress.addressLine1,
			addressLine2: cart.value.shippingAddress.addressLine2,
			city: cart.value.shippingAddress.city,
			state: cart.value.shippingAddress.state,
			postalCode: cart.value.shippingAddress.postalCode,
			country: cart.value.shippingAddress.country,
		}
	}
	const billingAdrs = await saveDoc('billingaddresses', cart.value.billingAddress)
	// console.log(billingAdrs)
	if (billingAdrs) cart.value.shippingAddress = billingAdrs

	cart.value.customer.title = cart.value.customer.shippingAddresses[0].title
	cart.value.customer.name = cart.value.customer.shippingAddresses[0].name
	cart.value.customer.email = cart.value.customer.shippingAddresses[0].email
	cart.value.customer.password = '$3f%6X*kqRN!5+nDwWYmgnb='
	cart.value.customer.role = 'customer'
	cart.value.customer.shippingAddresses = [cart.value.shippingAddress]
	cart.value.customer.billingAddress = cart.value.billingAddress
	cart.value.customer.phoneNumbers = [cart.value.phoneNumber]
	const customer = await signup(cart.value.customer)
	console.log('CUSTOMER', customer)

	// cart.value.customer.shippingAddresses[0].isDefault = true
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
	console.log(cart.value)
	updateDbOrder()
	// if (isAuthenticated.value) {
	//   const response = await updateLoggedInUserData({
	//     shippingAddresses: cart.value.customer.shippingAddresses,
	//   })
	//   console.log('RRRRRR', response)
	// }
	// router.push({ name: 'ecommerce-shipping' })
}

onMounted(() => {
	console.log(cart.value)
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
			<div class="w-996p" v-if="cart.items && cart.items.length">
				<div class="flex-row gap-2">
					<div class="flex-1">
						<EcommerceCheckoutShippingAddressForm
							class="flex-row gap-2 bg-slate-50 p-2"
							:countries="countries"
							:states="states"
							:customerShippingAddress="cart.shippingAddress"
							@updateCustomerShippingAddress="updateCustomerShippingAddress"
							@updatePhoneNumbers="updatePhoneNumbers"
						/>
						<div class="flex-row items-end justify-between gap-2 px-3 py-1 text-sm bg-slate-50">
							<button class="btn btn__link px-2 py-05 gap-05 text-sm tracking-wide items-center" @click="goBack">
								<IconsArrowWest class="fill-yellow-800 w-2 h-2" />Back to Basket
							</button>
							<button class="btn btn__checkout px-2 py-05" @click="continueToShipping">
								continue<IconsChevronRight />
							</button>
						</div>
					</div>

					<EcommerceCheckoutBillingAddressForm
						class="flex-row gap-2 bg-slate-50 p-2 min-w-30"
						:countries="countries"
						:states="states"
						:billingAddress="cart.billingAddress"
						@updateCustomerBillingAddress="updateCustomerBillingAddress"
					/>
				</div>
			</div>
			<EcommerceCheckoutEmptyCart v-else class="bg-slate-50 p3" />
		</ClientOnly>
	</div>
</template>

<style lang="scss" scoped></style>
