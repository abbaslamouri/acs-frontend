<script setup>
const title = ref('Products | YRL')

const router = useRouter()
const route = useRoute()

const config = useRuntimeConfig()
const { fetchAll } = useHttp()

const listStyle = ref('tile')

const showProductFiltersSlideout = ref(false)

const products = ref([])
const searchProducts = ref([])
const eligibilities = ref([])
const oems = ref([])
const oemPartNumbers = ref([])
const nextHigherAssemblies = ref([])

const totalCount = ref(null) // Total item count in the database
const count = ref(null) // item count taking into account params

const searchObject = ref({
  acsPartNumber: { title: 'ACS Part Number' },
  oem: { title: 'OEM' },
  oemPartNumber: { title: 'OEM Part Number' },
  eligibility: { title: 'Eligibility' },
  nextHigherAssembly: { title: 'Next Higher Assenbly' },
})
const page = ref(1)
const perPage = ref(10)
const fields = 'name, slug, price, description'
const keyword = ref('')
const sort = reactive({
  field: 'createdAt',
  order: '',
})

let response = null

const params = computed(() => {
  const params = {
    fields,
    page: page.value,
    limit: perPage.value,
    sort: `${sort.order}${sort.field}, _id `,
    populate: 'gallery',
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

const isFilterActive = computed(() => {
  let active = false
  for (const prop in searchObject.value) {
    if (searchObject.value[prop].id) {
      active = true
      break
    }
  }
  return active
})

const fetchAllProducts = async () => {
  const queyParams = {}
  if (searchObject.value.acsPartNumber && searchObject.value.acsPartNumber.id)
    queyParams._id = searchObject.value.acsPartNumber.id
  if (searchObject.value.oemPartNumber && searchObject.value.oemPartNumber.id)
    queyParams.oemPartNumber = searchObject.value.oemPartNumber.id
  if (searchObject.value.oem && searchObject.value.oem.id) queyParams.oem = searchObject.value.oem.id
  if (searchObject.value.eligibility && searchObject.value.eligibility.id)
    queyParams.eligibilities = searchObject.value.eligibility.id
  if (searchObject.value.nextHigherAssembly && searchObject.value.nextHigherAssembly.id)
    queyParams.nextHigherAssemblies = searchObject.value.nextHigherAssembly.id

  response = await fetchAll('products', { ...params.value, ...queyParams })
  if (!response) return
  products.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
}

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAllProducts()
}

const clearFilter = async (key) => {
  searchObject.value[key] = { title: searchObject.value[key].title }
  router.push({ name: 'ecommerce-products' })
  await fetchAllProducts()
}

const clearAllFilters = async () => {
  for (const prop in searchObject.value) {
    searchObject.value[prop] = { title: searchObject.value[prop].title }
  }
  router.push({ name: 'ecommerce-products' })
  await fetchAllProducts()
}

const showSearchResults = async (event = {}) => {
  searchObject.value = { ...searchObject.value, ...event }
  showProductFiltersSlideout.value = false
  page.value = 1
  await fetchAllProducts()
}

// const handleItemQuantitySelected = (event) => {
//   resetSelectQuantities()
//   showSelectQty = event.status
//   cart.addItem(props.products[i], event.quantity)
// }

// onMounted(async () => {
response = await fetchAll('products', { fields: 'name' })
if (response && response.docs) searchProducts.value = response.docs
response = await fetchAll('eligibilities', { fields: 'name' })
if (response && response.docs) eligibilities.value = response.docs
response = await fetchAll('nexthigherassemblies', { fields: 'name' })
if (response && response.docs) nextHigherAssemblies.value = response.docs
response = await fetchAll('oems', { fields: 'name' })
if (response && response.docs) oems.value = response.docs
response = await fetchAll('oempartnumbers', { fields: 'name' })
if (response && response.docs) oemPartNumbers.value = response.docs
// })

if (route.query.eligibility) {
  searchObject.value.eligibility.id = route.query.eligibility
  const eligibility = eligibilities.value.find((e) => e.id == route.query.eligibility)
  if (eligibility) searchObject.value.eligibility.name = eligibility.name
}

if (route.query.nextHigherAssembly) {
  searchObject.value.nextHigherAssembly.id = route.query.nextHigherAssembly
  const nextHigherAssembly = nextHigherAssemblies.value.find((e) => e.id == route.query.nextHigherAssembly)
  if (nextHigherAssembly) searchObject.value.nextHigherAssembly.name = nextHigherAssembly.name
}

await fetchAllProducts()
</script>

<template>
  <div class="flex-1 flex-col bg-white p-2">
    <Title>{{ title }}</Title>
    <div class="flex-1 flex-col justify-between gap-3" v-if="products">
      <main class="flex-1 flex-row justify-center">
        <div class="w-996p flex-col">
          <div class="filters bg-slate-200 z-1 p-1">
            <EcommerceProductsFiltersAndViews
              :totalCount="totalCount"
              :isFilterActive="isFilterActive"
              :searchObject="searchObject"
              @setListStyle="listStyle = $event"
              @toggleProductFiltersSlideout="showProductFiltersSlideout = !showProductFiltersSlideout"
              @clearFilter="clearFilter"
              @clearAllFilters="clearAllFilters"
            />
          </div>
          <div
            class="flex-col gap-1 justify-center items-center h-16 bg-center bg-no-repeat bg-size-cover"
            :style="{
              backgroundImage: `url('${config.backendUrl}/uploads/acshomepage-1654948453809.jpg')`,
            }"
          >
            <h3 class="text-4xl text-slate-50 tracking-wider uppercase">Aviation Component Solutions</h3>
            <h4 class="text-md text-slate-50 tracking-wider uppercase">
              Delivering the Difference Through Innovation and Integrity
            </h4>
          </div>
          <EcommerceProductsList :products="products" :listStyle="listStyle" />
        </div>
      </main>
      <footer class="w-full max-width-130">
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" />
      </footer>
      <EcommerceProductsFiltersSlidout
        v-if="showProductFiltersSlideout"
        :eligibilities="eligibilities"
        :nextHigherAssemblies="nextHigherAssemblies"
        :products="searchProducts"
        :oems="oems"
        :oemPartNumbers="oemPartNumbers"
        :searchObject="searchObject"
        @toggleProductFiltersSlideout="showProductFiltersSlideout = !showProductFiltersSlideout"
        @showSearchResults="showSearchResults"
      />
    </div>
    <div v-else>There are no products</div>
  </div>
</template>

<style lang="scss" scoped>
.filters {
  position: sticky;
  top: 16rem;
}
</style>
