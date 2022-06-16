<script setup>
const title = ref('Products | YRL')

const route = useRoute()
console.log('RP', route.query)

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

const fetchAllProducts = async (event = {}) => {
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
  console.log(response)
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
  console.log(key)
  console.log(searchObject.value)
  searchObject.value[key] = { title: searchObject.value[key].title }
  console.log(searchObject.value)
  await fetchAllProducts()
}

const clearAllFilters = async () => {
  for (const prop in searchObject.value) {
    console.log(prop)
    searchObject.value[prop] = { title: searchObject.value[prop].title }
  }
  await fetchAllProducts()
}

const showSearchResults = async (event = {}) => {
  searchObject.value = { ...searchObject.value, ...event }
  showProductFiltersSlideout.value = false
  page.value = 1
  await fetchAllProducts()
}

await fetchAllProducts()

onMounted(async () => {
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
})
</script>

<template>
  <div class="flex-1 flex-col p-3">
    <Title>{{ title }}</Title>
    <div class="flex-1 flex-col justify-between gap-3" v-if="products">
      <main class="flex-1 flex-row justify-center">
        <div class="w-996p flex-col gap-1">
          <div class="sticky top-18 bg-slate-50 z-1">
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
// .product-list {
//   &.tile {
//     display: flex;
//     flex-direction: column;
//     flex-wrap: wrap;
//   }
// }

// svg {
//   width: 1.5rem;
// }

// .search-object-key {
//   border-radius: 2rem 0 0 2rem;
// }

// .search-object-value {
//   border-radius: 0 2rem 2rem 0;
// }
</style>
