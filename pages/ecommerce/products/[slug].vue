<script setup>
const pageTitle = ref('Product | YRL')

const config = useRuntimeConfig()
const { fetchAll } = useHttp()
const route = useRoute()

const { cart } = useCart()

const showQuantitySelector = ref(false)

let response = null
const product = ref({})
const relatedProducts = ref([])
const populate = 'gallery oemPartNumber eligibilities nextHigherAssemblies'
const slug = route.params.slug === '_' ? null : route.params.slug

if (slug) {
  response = await fetchAll('products', { slug, populate })
  if (response) {
    const nextHigherAssemblyIds = []
    product.value = response.docs[0]

    for (const prop in product.value.nextHigherAssemblies) {
      nextHigherAssemblyIds.push(product.value.nextHigherAssemblies[prop].id)
    }
    Promise.all(
      nextHigherAssemblyIds.map(async (nextHigherAssemblyId) => {
        const res = await fetchAll('products', {
          nextHigherAssemblies: nextHigherAssemblyId,
          populate,
          page: 1,
          limit: 5,
        })
        if (res) {
          for (const prop in res.docs) {
            const index = relatedProducts.value.findIndex((p) => p.id == res.docs[prop].id)
            if (index === -1) relatedProducts.value.push(res.docs[prop])
          }
        }
      })
    )
  }
}

const getcartItemCount = () => {
  if (cart.value.items && cart.value.items.length) {
    const found = cart.value.items.find((i) => i.product.id == product.value.id)
    return found ? found.quantity : 0
  }
  return ''
}
</script>

<template>
  <div class="flex-1 flex-row justify-center items-center">
    <Title>{{ pageTitle }}</Title>
    <div class="w-996p">
      <header class="flex-col gap-2 w-full max-width-130">
        <div class="go-back" id="product-go-back">
          <NuxtLink class="admin-link" :to="{ name: 'ecommerce-products' }">
            <IconsArrowWest /><span>Products</span>
          </NuxtLink>
        </div>
      </header>
      <main class="flex-1 flex-col gap-2">
        <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
          <div class="flex-row items-center justify-between text-sm mb-1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Product Details</div>
          </div>
          <div class="flex-row gap-4">
            <div class="image w-40 h-40 flex-row justify-center items-center">
              <img
                class="w-full h-full cover br-3"
                v-if="product.gallery.length && product.gallery[0] && product.gallery[0].mimetype.includes('image')"
                :src="`${config.backendUrl}/${product.gallery[0].path}`"
              />
              <img v-else class="w-full h-full cover br-3" :src="`${config.backendUrl}/placeholder.png`" />
            </div>
            <div class="flex-1 shadow-md flex-col items-center gap-2">
              <div class="text-4xl tracking-wide">{{ product.name }}</div>
              <div class="text-xl tracking-wide">{{ product.oemPartNumber.name }}</div>
              <div class="text-md tracking-wide text-slate-400">{{ product.description }}</div>
              <div class="text-xl tracking-wide text-yellow-700">${{ product.price.toFixed(2) }}</div>
              <EcommerceQuantitySelector
                parentComponent="product"
                btnWidth="3rem"
                :product="product"
                :minVal="0"
                :maxVal="4"
                :stepVal="1"
                :btnText="getcartItemCount()"
                :showQuantitySelector="showQuantitySelector"
                @toggleQuantitySelectors="showQuantitySelector = !showQuantitySelector"
                @cancel="$emit('resetSelectQuantities')"
              />
            </div>
          </div>
        </section>
        <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
          <div class="flex-row items-center justify-between text-sm mb-1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Eligibility</div>
            <div></div>
          </div>
          <div class="flex-row wrap gap-1">
            <div v-for="(eligibility, i) in product.eligibilities" :key="eligibility.id">
              <div
                class="flex-row gap-1 items-center text-xs text-slate-50 border border-slate-400 bg-slate-600 br-3 px-1 py-02"
              >
                <NuxtLink class="" :to="{ name: 'ecommerce-products', query: { eligibility: eligibility.id } }">
                  <span>{{ eligibility.name }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </section>
        <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
          <div class="flex-row items-center justify-between text-sm mb-1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Next Higher Assembly</div>
            <div></div>
          </div>
          <div class="flex-row wrap gap-1">
            <div v-for="(nextHigherAssembly, i) in product.nextHigherAssemblies" :key="nextHigherAssembly.id">
              <div
                class="flex-row gap-1 items-center text-xs text-slate-50 border border-slate-400 bg-slate-600 br-3 px-1 py-02"
              >
                <NuxtLink
                  class=""
                  :to="{ name: 'ecommerce-products', query: { nextHigherAssembly: nextHigherAssembly.id } }"
                >
                  <span>{{ nextHigherAssembly.name }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </section>
        <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
          <div class="flex-row items-center justify-between text-sm mb-1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">
              Additional Parts in this assembly
            </div>
          </div>
          <main class="flex-1 flex-row justify-center">
            <div class="w-996p flex-col gap-1">
              <EcommerceProductsList :products="relatedProducts" listStyle="tile" class="" />
            </div>
          </main>
        </section>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
</style>
