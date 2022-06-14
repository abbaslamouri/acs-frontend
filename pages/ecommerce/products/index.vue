<script setup>
const title = ref('Products | YRL')

const config = useRuntimeConfig()
const { errorMsg, message } = useAppState()
const { fetchAll, productsSearchAll, deleteDoc, deleteDocs } = useHttp()

const quantitySelectors = ref([])
const listType = ref('tile')

const showProductFiltersSlideout = ref(false)

const products = ref([])
const totalCount = ref(null) // Total item count in the database
const count = ref(null) // item count taking into account params

const searchObject = ref({
	acsPartNumber: {},
	oem: {},
	oemPartNumber: {},
	eligibility: {},
	nextHigherAssembly: {},
})
const searchResults = ref(0)
const page = ref(1)
const perPage = ref(10)
const fields = '-updatedAt'
const keyword = ref('')
const sort = reactive({
	field: 'createdAt',
	order: '-',
})

let response = null
const sortOptions = [
	{ key: 'sortOrder', name: 'Order' },
	{ key: 'name', name: 'Name' },
	{ key: 'createdAt', name: 'Date Created' },
]

const params = computed(() => {
	const params = {
		fields,
		page: page.value,
		limit: perPage.value,
		sort: `${sort.order}${sort.field}, _id `,
		keyword: keyword.value ? keyword.value : null,
	}
	if (!keyword.value) delete params.keyword
	return params
})

const pages = computed(() => {
	return totalCount.value % perPage.value
		? parseInt(totalCount.value / perPage.value) + 1
		: parseInt(totalCount.value / perPage.value)
})

const fetchAllProducts = async () => {
	response = await fetchAll('products', params.value)
	console.log(response)
	if (!response) return
	products.value = response.docs
	count.value = response.results
	totalCount.value = response.totalCount
}

const resetSelectQuantities = () => {
	for (const prop in products.value) {
		quantitySelectors.value[prop] = false
	}
}

const toggleQuantitySelectors = (status, i) => {
	console.log(status, i)
	resetSelectQuantities()
	quantitySelectors.value[i] = status
	// addItem(props.products[i], event.quantity)
	// console.log(cart.value)
}

const handleSearch = async (searchKeyword) => {
	keyword.value = searchKeyword
	page.value = 1
	await fetchAllProducts()
}

const toggleSort = async (event) => {
	sort.field = event.field
	sort.order = event.order
	await fetchAllProducts()
}

const setPage = async (currentPage) => {
	page.value = currentPage
	await fetchAllProducts()
}

const setPerPage = async () => {
	await fetchAllProducts()
}

const showSearchResults = async (event) => {
	console.log(event)
	searchObject.value = event
	showProductFiltersSlideout.value = false
	perPage.value = 10000
	response = await fetchAll('products', { ...params.value, ...event })
	console.log(response)
	if (!response) return
	products.value = response.docs
	searchResults.value = response.results
	console.log(searchResults.value)
}

await fetchAllProducts()
</script>

<template>
	<div class="flex-1 flex-col p-3">
		<Title>{{ title }}</Title>
		<div class="flex-1 flex-col justify-between gap-3" v-if="totalCount">
			<header class="flex-row items-center justify-between w-full">
				<h3 class="title">Products</h3>
				<NuxtLink :to="{ name: 'admin-ecommerce-products-slug', params: { slug: '_' } }">
					<button class="btn btn__primary btn__pill px-2 py-05">
						<IconsPlus />
						<span>Add</span>
					</button>
				</NuxtLink>
			</header>
			<main class="flex-1 max-width-130 w-full flex-col gap-3">
				<div class="flex-col gap-3 flex-col br-5">
					<div class="flex-row items-center gap-4" v-if="totalCount">
						<FormsBaseInput name="Per Page" label="Per Page" v-model="perPage" @update:modelValue="setPerPage" />
						<Sort
							:sort="sort"
							:sortOptions="sortOptions"
							@toggleSort="toggleSort"
							v-if="totalCount && products.length > 1"
						/>
						<Search class="flex-1" @searchKeywordSelected="handleSearch" v-if="totalCount && products.length > 1" />
					</div>

					<section class="flex-row justify-center">
						<div class="w-996p">
							{{ searchObject }}
							<!-- <EcommerceProductsHero /> -->
							<div class="sticky top-18 bg-slate-50 z-9 border-red">
								<EcommerceProductsFiltersAndViews
									@setListType="listType = $event"
									@toggleProductFiltersSlideout="showProductFiltersSlideout = !showProductFiltersSlideout"
								/>
								<div>
									<div>{{ searchResults }} products found</div>
									<button class="btn btn__primary px-2 py-1 items-self-end" @click="searchObject = {}">
										Clear Filtes
									</button>
									<div>
										<div v-for="item in searchObject">{{ item }}</div>
									</div>
								</div>
							</div>

							<div
								class="flex-col gap-4 justify-center items-center h-16 bg-center bg-no-repeat bg-size-cover"
								:style="{ backgroundImage: `url('${config.backendUrl}/uploads/acshomepage-1654948453809.jpg')` }"
							>
								<h3 class="text-4xl text-slate-50 tracking-wider uppercase">Aviation Component Solutions</h3>
								<h4 class="text-md text-slate-50 tracking-wider uppercase">
									Delivering the Difference Through Innovation and Integrity
								</h4>
							</div>
							<div class="list" :class="{ list: listType == 'list', tile: listType == 'tile' }">
								<EcommerceProductsCard
									v-for="(product, i) in products"
									:key="product.id"
									:product="product"
									:listType="listType"
									:showQuantitySelector="quantitySelectors[i]"
									@toggleQuantitySelectors="toggleQuantitySelectors($event, i)"
									@resetSelectQuantities="resetSelectQuantities"
								/>
							</div>
						</div>
					</section>
					<!-- <EcommerceProductList :products="products" :totalCount="totalCount" @deleteProduct="deleteProduct" /> -->
				</div>
			</main>
			<footer class="w-full max-width-130">
				<Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" />
			</footer>
		</div>
		<AdminEmptyMsg v-else>
			<template #header>Add your first physical or digital product</template>
			<template #default>
				<div class="">Add your product and variants. Products must have at least a name and a price</div>
				<NuxtLink
					class="btn btn__primary btn__pill px-3 py-05 text-xs items-self-end"
					:to="{ name: 'admin-ecommerce-products-slug', params: { slug: '_' } }"
				>
					<IconsPlus class="w-2 h-2" />
					<span>Add</span>
				</NuxtLink>
			</template>
		</AdminEmptyMsg>

		<LazyEcommerceProductsFiltersSlidout
			v-if="showProductFiltersSlideout"
			:products="products"
			:searchObject="searchObject"
			@toggleProductFiltersSlideout="showProductFiltersSlideout = !showProductFiltersSlideout"
			@showSearchResults="showSearchResults"
		/>
	</div>
</template>

<style lang="scss" scoped>
.list {
	&.tile {
		display: flex;
		flex-direction: columns;
		flex-wrap: wrap;
	}
}
</style>
