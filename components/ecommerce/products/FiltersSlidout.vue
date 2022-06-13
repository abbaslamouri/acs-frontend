<script setup>
const props = defineProps({
	// product: {
	// 	type: Object,
	// 	required: true,
	// },
})
const emit = defineEmits(['toggleProductFiltersSlideout'])
const router = useRouter()
// const { cart, updateLocalStorage } = useCart()
// const { showCartSlideout } = useAppState()
const { fetchAll, saveDoc } = useHttp()

const eligibilities = ref([])
const eligibilityKeyword = ref('')

let response = ''

// const checkout = async () => {
//   showCartSlideout.value = false
//   cart.value.status = 'cart'
//   const order = await saveDoc('orders', cart.value)
//   console.log(order)
//   if (order) {
//     cart.value.id = order._id
//     updateLocalStorage()
//     router.push({ name: 'ecommerce-checkout' })
//   }
// }

response = await fetchAll('eligibilities')
console.log('E', response)
if (response && response.docs) eligibilities.value = response.docs
</script>

<template>
	<div>
		<div class="fixed inset-0 w-100vw h-100vh z-99 bg-slate-900 opacity-70"></div>
		<div class="fixed top-0 left-0 h-100vh z-99 max-w-415p w-100-percent text-slate-800">
			<ClientOnly>
				<div class="h-100vh flex-col justify-between bg-white">
					<header class="bg-stone-300 p-1 flex-row items-center justify-between py-1 px-2">
						<h3 class="font-bold text-md uppercase">Filters</h3>
						<button class="btn btn__close" @click.prevent="$emit('toggleProductFiltersSlideout')">
							<IconsClose />
						</button>
					</header>
					<main class="flex-1 p-2 flex-col gap-2">
						<FormsBaseSelectNew
							label="JJJJJJJ"
							v-model="eligibilityKeyword"
							nullOption="Eligibility"
							:options="
								eligibilities.map((e) => {
									return { key: e.id, name: e.name }
								})
							"
						/>
					</main>
					<footer class="p-1 bg-stone-300">
						<div class="flex-row justify-end px-3">
							<button class="btn btn__checkout px-3 py-1" @click="checkout">Show Results</button>
						</div>
					</footer>
				</div>
			</ClientOnly>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
