<script setup>
const title = ref("Products | YRL")

const config = useRuntimeConfig()
const { errorMsg, message } = useAppState()
const { fetchAll, productsSearchAll, deleteDoc, deleteDocs } = useHttp()

const quantitySelectors = ref([])
const listType = ref("tile")

const showProductFiltersSlideout = ref(false)

const products = ref([])
const eligibilities = ref([])
const oems = ref([])
const oemPartNumbers = ref([])
const nextHigherAssemblies = ref([])

const totalCount = ref(null) // Total item count in the database
const count = ref(null) // item count taking into account params

const searchObject = ref({
  acsPartNumber: { title: "ACS Part Number" },
  oem: { title: "OEM" },
  oemPartNumber: { title: "OEM Part Number" },
  eligibility: { title: "Eligibility" },
  nextHigherAssembly: { title: "Next Higher Assenbly" },
})
const searchResults = ref(0)
const page = ref(1)
const perPage = ref(10)
const fields = "-updatedAt"
const keyword = ref("")
const sort = reactive({
  field: "createdAt",
  order: "",
})

let response = null
const sortOptions = [
  { key: "sortOrder", name: "Order" },
  { key: "name", name: "Name" },
  { key: "createdAt", name: "Date Created" },
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
  response = await fetchAll("products")
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
  console.log("EVENT", event)
  searchObject.value = { ...searchObject.value, ...event }
  showProductFiltersSlideout.value = false
  perPage.value = 10000
  const queyParams = {}
  if (event.acsPartNumber && event.acsPartNumber.id)
    queyParams._id = event.acsPartNumber.id
  if (event.oemPartNumber && event.oemPartNumber.id)
    queyParams.oemPartNumber = event.oemPartNumber.id
  if (event.oem && event.oem.id) queyParams.oem = event.oem.id
  if (event.eligibility && event.eligibility.id)
    queyParams.eligibilities = event.eligibility.id
  if (event.nextHigherAssembly && event.nextHigherAssembly.id)
    queyParams.nextHigherAssemblies = event.nextHigherAssembly.id

  console.log("queyParams", queyParams)

  response = await fetchAll("products", { ...params.value, ...queyParams })
  console.log(response)
  if (!response) return
  products.value = response.docs
  searchResults.value = response.results
  console.log(searchResults.value)
}

await fetchAllProducts()

// response = await fetchAll('products')
// if (response && response.docs) products.value = response.docs
onMounted(async () => {
  response = await fetchAll("eligibilities")
  console.log("E", response)
  if (response && response.docs) eligibilities.value = response.docs

  response = await fetchAll("nexthigherassemblies")
  console.log("N", response)

  if (response && response.docs) nextHigherAssemblies.value = response.docs

  response = await fetchAll("oems")
  console.log("OEM", response)

  if (response && response.docs) oems.value = response.docs

  response = await fetchAll("oempartnumbers")
  console.log("OEMP", response)

  if (response && response.docs) oemPartNumbers.value = response.docs
})

if (process.client) {
  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    console.log({ scrollTop, scrollHeight, clientHeight })
  })
  // checkScreen()
}
// })
</script>

<template>
  <div class="flex-1 flex-col p-3">
    <Title>{{ title }}</Title>
    <div class="flex-1 flex-col justify-between gap-3" v-if="totalCount">
      <!-- <header class="flex-row items-center justify-between w-full">
        <h3 class="title">Products</h3>
        <NuxtLink :to="{ name: 'admin-ecommerce-products-slug', params: { slug: '_' } }">
          <button class="btn btn__primary btn__pill px-2 py-05">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </header> -->
      <main class="flex-1 max-width-130 w-full flex-col gap-3">
        <div class="flex-col gap-3 flex-col br-5">
          <!-- <div class="flex-row items-center gap-4" v-if="totalCount">
            <FormsBaseInput name="Per Page" label="Per Page" v-model="perPage" @update:modelValue="setPerPage" />
            <Sort
              :sort="sort"
              :sortOptions="sortOptions"
              @toggleSort="toggleSort"
              v-if="totalCount && products.length > 1"
            />
            <Search class="flex-1" @searchKeywordSelected="handleSearch" v-if="totalCount && products.length > 1" />
          </div> -->

          <section class="flex-row justify-center">
            <div class="w-996p">
              <!-- <EcommerceProductsHero /> -->
              <div class="sticky top-18 bg-slate-50 z-1">
                <EcommerceProductsFiltersAndViews
                  @setListType="listType = $event"
                  @toggleProductFiltersSlideout="
                    showProductFiltersSlideout = !showProductFiltersSlideout
                  "
                />
                <div class="flex-row items-center gap-2 p-1">
                  <div>{{ searchResults }} products found</div>
                  <div class="flex-row gap-1 wrap text-xs">
                    <div class="" v-for="(value, key, index) in searchObject">
                      <div class="flex-row items-center" v-if="value.name">
                        <div
                          class="search-object-key flex-row items-center bg-slate-400 px-1 h-3 text-slate-50"
                        >
                          {{ value.title }}
                        </div>
                        <div
                          class="search-object-value flex-row items-center gap-1 bg-slate-200 px-1 h-3 cursor-pointer"
                        >
                          {{ value.name }}<IconsClose class="" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    class="btn link px-2 py-1 items-self-end"
                    @click="searchObject = {}"
                  >
                    Clear All Filtes
                  </button>
                </div>
              </div>

              <div
                class="flex-col gap-4 justify-center items-center h-16 bg-center bg-no-repeat bg-size-cover"
                :style="{
                  backgroundImage: `url('${config.backendUrl}/uploads/acshomepage-1654948453809.jpg')`,
                }"
              >
                <h3 class="text-4xl text-slate-50 tracking-wider uppercase">
                  Aviation Component Solutions
                </h3>
                <h4 class="text-md text-slate-50 tracking-wider uppercase">
                  Delivering the Difference Through Innovation and Integrity
                </h4>
              </div>
              <div
                class="list"
                :class="{ list: listType == 'list', tile: listType == 'tile' }"
              >
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
        <Pagination
          :page="page"
          :pages="pages"
          @pageSet="setPage"
          v-if="pages > 1 && !keyword"
        />
      </footer>
    </div>
    <AdminEmptyMsg v-else>
      <template #header>Add your first physical or digital product</template>
      <template #default>
        <div class="">
          Add your product and variants. Products must have at least a name and a price
        </div>
        <NuxtLink
          class="btn btn__primary btn__pill px-3 py-05 text-xs items-self-end"
          :to="{ name: 'admin-ecommerce-products-slug', params: { slug: '_' } }"
        >
          <IconsPlus class="w-2 h-2" />
          <span>Add</span>
        </NuxtLink>
      </template>
    </AdminEmptyMsg>

    <EcommerceProductsFiltersSlidout
      v-if="showProductFiltersSlideout"
      :eligibilities="eligibilities"
      :nextHigherAssemblies="nextHigherAssemblies"
      :products="products"
      :oems="oems"
      :oemPartNumbers="oemPartNumbers"
      :searchObject="searchObject"
      @toggleProductFiltersSlideout="
        showProductFiltersSlideout = !showProductFiltersSlideout
      "
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
