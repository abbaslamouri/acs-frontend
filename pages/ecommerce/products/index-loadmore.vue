<script setup>
const title = ref('Products | YRL')

const config = useRuntimeConfig()
const { errorMsg, message } = useAppState()
const { fetchAll, productsSearchAll, deleteDoc, deleteDocs } = useHttp()

const quantitySelectors = ref([])
const listStyle = ref('tile')

const showProductFiltersSlideout = ref(false)

const products = ref([])
const searchProducts = ref([])
const eligibilities = ref([])
const oems = ref([])
const oemPartNumbers = ref([])
const nextHigherAssemblies = ref([])

const scrollRef = ref('')

const totalCount = ref(null) // Total item count in the database
const count = ref(null) // item count taking into account params

const searchObject = ref({
  acsPartNumber: { title: 'ACS Part Number' },
  oem: { title: 'OEM' },
  oemPartNumber: { title: 'OEM Part Number' },
  eligibility: { title: 'Eligibility' },
  nextHigherAssembly: { title: 'Next Higher Assenbly' },
})
const searchResults = ref(0)
const page = ref(1)
const perPage = ref(2)
const fields = 'name, slug, price'
const keyword = ref('')
const sort = reactive({
  field: 'createdAt',
  order: '',
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

const fetchAllProducts = async (queryParams) => {
  response = await fetchAll('products', queryParams)
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
  resetSelectQuantities()
  quantitySelectors.value[i] = status
  // addItem(props.products[i], event.quantity)
}

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAllProducts(params.value)
}

const toggleSort = async (event) => {
  sort.field = event.field
  sort.order = event.order
  await fetchAllProducts(params.value)
}

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAllProducts(params.value)
}

const setPerPage = async () => {
  await fetchAllProducts(params.value)
}

const clearFilter = async (key) => {
  searchObject.value[key] = { title: searchObject.value[key].title }
  await showSearchResults()
}

const clearAllFilters = async () => {
  for (const prop in searchObject.value) {
    searchObject.value[prop] = { title: searchObject.value[prop].title }
  }
  await showSearchResults()
}

const showSearchResults = async (event = {}) => {
  searchObject.value = { ...searchObject.value, ...event }
  showProductFiltersSlideout.value = false
  // perPage.value = 10000
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

  await fetchAllProducts({ ...params.value, ...queyParams })
}

await fetchAllProducts(params.value)

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

// const loadMore = async () => {
//   const element = scrollRef.value
//   console.log(element.getBoundingClientRect().bottom, window.innerHeight)
//   if (element.getBoundingClientRect().bottom <= window.innerHeight) {
//     page.value = page.value + 1
//     response = await fetchAll('products', params.value)
//     if (!response) return
//     products.value.push(...response.docs)
//     if (products.value.length == response.totalCount) window.removeEventListener('scroll', loadMore)
//   }
// }
// onMounted(() => {
//   window.addEventListener('scroll', loadMore)
// })
// onUnmounted(() => {
//   window.removeEventListener('scroll', loadMore)
// })
//  {
//   window.addEventListener(
//     'scroll',
//     loadMore
//     // async () => {
//     //   const { scrollTop, scrollHeight, clientHeight } = document.documentElement
//     //   // console.log({ scrollTop, scrollHeight, clientHeight })
//     //   if (scrollTop + clientHeight >= scrollHeight) {
//     //   }
//     // }
//   )

// window.addEventListener(
//   'scroll',
//   loadMore
//   // async () => {
//   //   const { scrollTop, scrollHeight, clientHeight } = document.documentElement
//   //   // console.log({ scrollTop, scrollHeight, clientHeight })
//   //   if (scrollTop + clientHeight >= scrollHeight) {
//   //   }
//   // }
// )
// checkScreen()
// }
// })
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
          <div class="product-list" :class="{ list: listStyle == 'list', tile: listStyle == 'tile' }" ref="scrollRef">
            <EcommerceProductsCard
              v-for="(product, i) in products"
              :key="product.id"
              :product="product"
              :listStyle="listStyle"
              :showQuantitySelector="quantitySelectors[i]"
              @toggleQuantitySelectors="toggleQuantitySelectors($event, i)"
              @resetSelectQuantities="resetSelectQuantities"
            />
          </div>
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
.product-list {
  &.tile {
    display: flex;
    flex-direction: columns;
    flex-wrap: wrap;
  }
}

svg {
  width: 1.5rem;
}

.search-object-key {
  border-radius: 2rem 0 0 2rem;
}

.search-object-value {
  border-radius: 0 2rem 2rem 0;
}
</style>
