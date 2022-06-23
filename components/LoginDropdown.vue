<script setup lang="">
const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()
const { user, token, isAuthenticated, signin } = useAuth()
const { errorMsg, message } = useAppState()
const showAuthDropdown = ref(false)
const formUser = reactive({
	email: '',
	password: '',
})

const signup = async () => {
	// if (user.password !== user.passwordConfirm)
	// 	return (errorMsg.value = "Your password and confirmation password don't match")
	// const response = await signup(user)
	// console.log(response)
	// if (!response) return
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
	router.push({ name: 'auth-signup', query: { redirect: route.name } })
	showAuthDropdown.value = false
}

const login = async () => {
	showAuthDropdown.value = false
	await signin(formUser)
}

const forgotPassword = async () => {
	router.push({ name: 'auth-forgot-password' })
	showAuthDropdown.value = false
}
</script>

<template>
	<div class="relative">
		<div class="overlay" v-if="showAuthDropdown" @click="showAuthDropdown = !showAuthDropdown"></div>
		<div class=" ">
			<div
				class="header flex-row items-center gap-1 text-xs text-slate-900 py-05 px-1 cursor-pointer br-3 relative z-99"
				:class="{ selected: showAuthDropdown }"
				@click="showAuthDropdown = !showAuthDropdown"
			>
				<IconsPersonFill class="fill-slate-900" />
				<h3 class="font-light uppercase">Sign in / Create acount</h3>
			</div>
			<form class="shadow-md flex-col gap-2 bg-slate-50 p-2 absolute z-99 text-slate-800" v-if="showAuthDropdown">
				<h3 class="title">Sin in</h3>
				<p class="text-xs">Access your account and place an order:</p>
				<div class="flex-col gap-1">
					<FormsBaseInput label="Email" type="email" v-model="formUser.email" required />
					<FormsBaseInput label="Password" type="password" v-model="formUser.password" required />
				</div>

				<div>
					<button class="btn btn__secondary w-full justify-between px-1 py-05 text-xs" @click.prevent="forgotPassword">
						<p>Forgot Password?</p>
						<IconsChevronRight />
					</button>
				</div>
				<button class="btn btn__secondary w-full flex-row justify-between px-1 py-05 text-xs" @click.prevent="login">
					<p>Sign in</p>
					<IconsChevronRight />
				</button>
				<p class="text-sm">New User?</p>
				<button class="btn btn__secondary w-full justify-between px-1 py-05 text-xs" @click.prevent="signup">
					<p>Create an account</p>
					<IconsChevronRight />
				</button>
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.header {
	border: 1px solid $slate-600;
	&:hover,
	&.selected {
		border: 1px solid #fff;
		background-color: #fff;
		color: $slate-800;
		border-radius: 3px 3px 0 0;

		svg {
			fill: $slate-800;
		}
	}
}
</style>
