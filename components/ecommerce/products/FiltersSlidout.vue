<script setup>
const props = defineProps({
  products: {
    type: Array,
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

const searchObject = ref({
  acsPartNumber: '',
  oem: '',
  oemPartNumber: '',
  eligibilities: '',
  nextHigherAssemblies: '',
})

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
if (response && response.docs) eligibilities.value = response.docs

response = await fetchAll('nexthigherassemblies')
if (response && response.docs) nextHigherAssemblies.value = response.docs

response = await fetchAll('oems')
if (response && response.docs) oems.value = response.docs

response = await fetchAll('oempartnumbers')
if (response && response.docs) oemPartNumbers.value = response.docs
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
          {{ searchObject }}
          <main class="flex-1 p-2 flex-col gap-2">
            <h3>Filter by</h3>
            <div class="flex-1 flex-col gap-2">
              <FormsBaseSelectSearch
                label=""
                v-model="searchObject.acsPartNumber"
                nullOption="ACS Part Number"
                :options="
                  products.map((e) => {
                    return { key: e.id, name: e.name }
                  })
                "
              />
              <FormsBaseSelectSearch
                label=""
                v-model="searchObject.oem"
                nullOption="OEM"
                :options="
                  oems.map((e) => {
                    return { key: e.id, name: e.name }
                  })
                "
              />
              <FormsBaseSelectSearch
                label=""
                v-model="searchObject.oemPartNumber"
                nullOption="OEM Part Number"
                :options="
                  oemPartNumbers.map((e) => {
                    return { key: e.id, name: e.name }
                  })
                "
              />
              <FormsBaseSelectSearch
                label=""
                v-model="searchObject.eligibilities"
                nullOption="Eligibility"
                :options="
                  eligibilities.map((e) => {
                    return { key: e.id, name: e.name }
                  })
                "
              />
              <FormsBaseSelectSearch
                label=""
                v-model="searchObject.nextHigherAssemblies"
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
              <button class="btn btn__checkout px-3 py-1" @click="$emit('showSearchResults', searchObject)">
                Show Results
              </button>
            </div>
          </footer>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
