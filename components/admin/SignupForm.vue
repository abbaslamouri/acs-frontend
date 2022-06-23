<script setup>
const title = ref('Products | YRL')

const props = defineProps({
	user: {
		type: Object,
		required: true,
	},
})

defineEmits(['updateUser', 'register'])

const config = useRuntimeConfig()
const router = useRouter()
const { signup } = useAuth()
const { cart, updateLocalStorage } = useCart()
const { errorMsg, message } = useAppState()
const localUser = ref({ ...props.user })
// const user = reactive({
// 	name: 'Abbas Lamouri',
// 	email: 'abbaslamouri@yrlus.com',
// 	password: 'adrar0714',
// 	passwordConfirm: 'adrar0714',
// })
const loading = ref(false)
// const errorMsg = ref('')

// const register = async () => {
// 	if (user.password !== user.passwordConfirm)
// 		return (errorMsg.value = "Your password and confirmation password don't match")
// 	const response = await signup(user)
// 	console.log(response)
// 	if (!response) return
// 	const customer = response.user
// 	cart.value.customer = customer
// 	cart.value.name = customer.name
// 	cart.value.email = customer.email
// 	cart.value.billingAddress = customer.billingAddress
// 	const cartShippingAddress = customer.shippingAddresses.find((a) => a.isDefault)
// 	if (cartShippingAddress) cart.value.shippingAddress = cartShippingAddress
// 	else cart.value.shippingAddress = customer.shippingAddresses[0]
// 	const cartPhoneNumber = customer.phoneNumbers.find((p) => p.isDefault)
// 	if (cartPhoneNumber) cart.value.phoneNumber = cartPhoneNumber
// 	else cart.value.phoneNumber = customer.phoneNumbers[0]

// 	console.log(cart.value)

// 	router.push({ name: 'ecommerce-shipping' })
// }

watch(
	() => localUser.value,
	(newVal) => {
		emit('updateUser', newVal)
	},
	{ deep: true }
)
</script>

<template>
	<form class="flex-col gap-1" @submit.prevent="$emit('register')">
		<div class="p-2 br-3 text-xs flex-col gap-1" v-if="errorMsg">
			<!-- <div v-html="errorMsg"></div> -->
			<NuxtLink class="link items-self-end text-md" :to="{ name: 'auth-forgotpassword' }">
				<span>Reset Password</span>
				<IconsChevronRight />
			</NuxtLink>
		</div>
		<p class="text-sm">Fields marked with * are required.</p>
		<FormsBaseInput v-model="user.name" label="Name" placeholder="name" />
		<FormsBaseInput type="email" v-model="user.email" label="Email" placeholder="Email" />
		<FormsBaseInput type="password" v-model="user.password" label="Password" placeholder="Password" />
		<FormsBaseInput
			type="password"
			v-model="user.passwordConfirm"
			label="Confirm Password"
			placeholder="Confirm Password"
		/>
		<p class="text-xs">
			By clicking on “continue” you acknowledge that you have read and agree with YRL Privacy Notice & Terms of Service.
		</p>
		<button class="btn btn__primary py-05 px-1 items-self-end">Continue<IconsChevronRight /></button>
	</form>
</template>

<style lang="scss" scoped></style>
