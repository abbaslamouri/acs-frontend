<script setup>
const pageTitle = ref("Product | YRL")

const config = useRuntimeConfig()
const {
  errorMsg,
  message,
  galleryMedia,
  mediaReference,
  showMediaSelector,
} = useAppState()
const { fetchAll, saveMedia, saveDoc, deleteDocs } = useHttp()
const route = useRoute()
const router = useRouter()

let response = null
const product = ref({})
const slug = route.params.slug === "_" ? null : route.params.slug

if (slug) {
  response = await fetchAll("products", { slug, populate: "gallery oemPartNumber" })
  if (response.docs) product.value = response.docs[0]
  console.log(response)
  // if (product.value.id) {
  //   response = await fetchAll('variants', { product: product.value.id })
  //   if (response.docs) product.value.variants = response.docs
  // }
}

const saveProduct = async () => {
  console.log(product.value)
  if (!product.value.name) return (errorMsg.value = "Product name is required")
  // const id = product.value.id ? product.value.id : null
  const newProduct = await saveDoc("products", product.value)
  console.log("newProduct", newProduct)
  if (!Object.values(newProduct).length) return
  // slug = newProduct.slug
  message.value = "product saved succesfully"
  // response = await deleteDocs('variants', { product: newProduct.id })
  // if (!response) return
  // if (product.value.variants.length) response = await $saveDoc('variants', product.value.variants)
  router.push({
    name: "admin-ecommerce-products-slug",
    params: { slug: newProduct.slug },
  })
  message.value = "product saved succesfully"
  // response = await $fetchBySlug('products', slug)
  // if (response) product.value = response
}

// const showMediaUploader = () => {
//   mediaReference.value = 'productMedia'
//   showMediaSelector.value = true
// }

// Set category gallery
// const addImagesToGallery = async (media) => {
//   // console.log('mediap', media)
//   // console.log(product.value)
//   for (const prop in media) {
//     const index = product.value.gallery.findIndex((el) => el._id == media[prop]._id)
//     if (index === -1) {
//       product.value.gallery.push(media[prop])
//     }
//   }
//   // console.log(product.value.gallery)
// }

watch(
  () => galleryMedia.value,
  (currentVal) => {
    if (mediaReference.value === "productMedia") product.value.gallery[0] = currentVal[0]
  },
  { deep: true }
)
</script>

<template>
  <div class="flex-1 flex-row justify-center items-center border-red">
    <Title>{{ pageTitle }}</Title>
    <div class="w-996p">
      <header class="flex-col gap-2 w-full max-width-130">
        <div class="go-back" id="product-go-back">
          <NuxtLink class="admin-link" :to="{ name: 'admin-ecommerce-products' }">
            <IconsArrowWest /><span>Products</span>
          </NuxtLink>
        </div>
      </header>
      <main class="flex-1 flex-col gap-2">
        <div class="flex-row gap-2">
          <div
            class="image w-20 h-20 flex-row justify-center items-center overflow-hidden"
          >
            <img
              class="w-full h-full cover br-3"
              v-if="
                product.gallery.length &&
                product.gallery[0] &&
                product.gallery[0].mimetype.includes('image')
              "
              :src="`${config.backendUrl}/${product.gallery[0].path}`"
            />
            <img
              v-else
              class="w-full h-full cover br-3"
              :src="`${config.backendUrl}/placeholder.png`"
            />
          </div>
          <div class="">
            <div>{{ product.name }}</div>
            <div>{{ product.oemPartNumber.name }}</div>
            <div>{{ product.description }}</div>
          </div>
        </div>
        <div class="flex-row gap-2">
          <div>
            <h3>Eligibility</h3>
          </div>
          <div>
            <h3>Next Higher Assembly</h3>
          </div>
        </div>
      </main>
      <div class="w-full flex-row justify-end px-4 sticky bottom-4 go-to-top">
        <a href="#product-go-back" class="btn btn__secondary px-2 py-1">Go To Top</a>
      </div>
    </div>

    <!-- <footer class="w-full max-width-130 bg-slate-300 px-2 py-1 br-5 flex-row justify-center text-2xl">Footer</footer> -->
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.main {
  display: grid;
  grid-template-columns: 1fr 25rem;
  gap: 2rem;
  align-items: flex-start;

  .left-sidebar {
    position: sticky;
    top: 10rem;
    background-color: white;
    border: 1px solid $slate-100;
    border-radius: 3px;
    padding: 2rem 0.5rem;
  }

  .right-sidebar {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}

// .go-to-top {
//   position: sticky;
//   bottom: 4rem;
// }
</style>
