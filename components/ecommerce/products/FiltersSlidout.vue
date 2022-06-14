<script setup>
const props = defineProps({
	products: {
		type: Array,
		required: true,
	},
	searchObject: {
		type: Object,
		required: true,
	},
})
const emit = defineEmits(['toggleProductFiltersSlideout', 'showSearchResults'])
const router = useRouter()
// const { cart, updateLocalStorage } = useCart()
// const { showCartSlideout } = useAppState()
const { fetchAll, saveDoc } = useHttp()

const eligibilities = ref([])
const oems = ref([])
const oemPartNumbers = ref([])
const nextHigherAssemblies = ref([])
// const nextHigherAssemblyKeyword = ref('')

const composeSearchObject = () => {
	const searchObj = {}
	let found
	console.log(props.searchObject)

	found = props.products.find((p) => p.id == props.searchObject.acsPartNumber.id)
	console.log('F', found)
	if (found) {
		searchObj.acsPartNumber = { id: props.searchObject.acsPartNumber.id, name: found.name }
	}

	found = oems.value.find((p) => p.id == props.searchObject.oem.id)
	console.log('F', found)
	if (found) {
		searchObj.oem = { id: props.searchObject.oem.id, name: found.name }
	}

	const eligibility = eligibilities.value.find((p) => p.id == props.searchObject.eligibility.id)
	console.log('F', eligibility)
	if (eligibility) {
		searchObj.eligibility = { id: props.searchObject.eligibility.id, name: eligibility.name }
	}

	// console.log('EL', oemPartNumbers.value)

	// searchObj.oemPartNumber = {
	// 	...props.searchObject.oemPartNumber,
	// 	name: oemPartNumbers.value.find((p) => p.id == props.searchObject.oemPartNumber.id).name,
	// }
	// searchObj.oem = {
	// 	...props.searchObject.oem,
	// 	name: oems.value.find((p) => p.id == props.searchObject.oem.id).name,
	// }
	// searchObj.eligibilitiea = {
	// 	...props.searchObject.eligibilitiea,
	// 	name: eligibilities.value.find((p) => p.id == props.searchObject.eligibilitiea.id).name,
	// }
	// searchObj.nextHigherAssemblies = {
	// 	...props.searchObject.nextHigherAssemblies,
	// 	name: nextHigherAssemblies.value.find((p) => p.id == props.searchObject.nextHigherAssemblies.id).name,
	// }

	console.log('OBJ', searchObj)

	emit('showSearchResults', searchObj)
}

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
onMounted(async () => {
	response = await fetchAll('eligibilities')
	if (response && response.docs) eligibilities.value = response.docs

	response = await fetchAll('nexthigherassemblies')
	if (response && response.docs) nextHigherAssemblies.value = response.docs

	response = await fetchAll('oems')
	if (response && response.docs) oems.value = response.docs

	response = await fetchAll('oempartnumbers')
	if (response && response.docs) oemPartNumbers.value = response.docs
})
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
						<h3>Filter by</h3>
						<div class="flex-col gap-2">
							<FormsBaseSelectSearch
								label=""
								v-model="searchObject.acsPartNumber.id"
								nullOption="ACS Part Number"
								:options="
									products.map((e) => {
										return { key: e.id, name: e.name }
									})
								"
							/>
							<FormsBaseSelectSearch
								label=""
								v-model="searchObject.oem.id"
								nullOption="OEM"
								:options="
									oems.map((e) => {
										return { key: e.id, name: e.name }
									})
								"
							/>
							<FormsBaseSelectSearch
								label=""
								v-model="searchObject.oemPartNumber.id"
								nullOption="OEM Part Number"
								:options="
									oemPartNumbers.map((e) => {
										return { key: e.id, name: e.name }
									})
								"
							/>
							<FormsBaseSelectSearch
								label=""
								v-model="searchObject.eligibility.id"
								nullOption="Eligibility"
								:options="
									eligibilities.map((e) => {
										return { key: e.id, name: e.name }
									})
								"
							/>
							<FormsBaseSelectSearch
								label=""
								v-model="searchObject.nextHigherAssembly.id"
								nullOption="Next Higher Assembly"
								:options="
									nextHigherAssemblies.map((e) => {
										return { key: e.id, name: e.name }
									})
								"
							/>
						</div>
					</main>
					<footer class="p-1 bg-stone-300">
						<div class="flex-row justify-end px-3">
							<button class="btn btn__checkout px-3 py-1" @click="composeSearchObject">Show Results</button>
						</div>
					</footer>
				</div>
			</ClientOnly>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
