<script setup>
definePageMeta({
  layout: 'admin',
})
const pageTitle = ref('User | YRL')

const config = useRuntimeConfig()
const { errorMsg, message, galleryMedia, mediaReference, showMediaSelector } = useAppState()
const { fetchAll, fetchDoc, saveMedia, saveDoc, deleteDocs } = useHttp()
const route = useRoute()
const router = useRouter()
const addressToEditIndex = ref('')
const showAddressFormModal = ref(false)
let response = null
const user = ref({ userAddresses: [{ phoneNumbers: [] }] })
const id = route.params.id === '_' ? null : route.params.id

if (id) {
  response = await fetchDoc('users', id)
  if (response) user.value = response.doc
}
const countries = (await fetchAll('countries', { sort: 'countryName' })).docs
const states = (await fetchAll('states', { sort: 'name' })).docs

console.log(user.value)

const addAddress = () => {
  user.value.userAddresses.unshift({
    addressType: 'Residential',
    // email: 'abbaslamnouri1@yrlus.com',
    title: 'Ms',
    name: 'Nelly Vileikis',
    company: 'YRL Consulting LLC',
    addressLine1: '599 Deep Woods Dr.',
    addressLine2: 'Room 101',
    city: 'Aurora1',
    postalCode: '442021',
    state: states.find((s) => s._id == '624ef322b9e91e20c3e32390'),
    country: countries.find((c) => c._id == '624ef31fb9e91e20c3e3215e'),
    isDefault: true,

    phoneNumbers: [
      {
        phoneType: 'Cell',
        phoneNumber: '21650263781',
        phoneCountryCode: countries.find((c) => c._id == '624ef31fb9e91e20c3e3215e'),
        isDefault: true,
      },
    ],
    deliveryInstructions: 'Some delivery instructions1',
  })
  addressToEditIndex.value = user.value.userAddresses.length - 1
  showAddressFormModal.value = true
  // displayStatus.value = 'editing'
  // editAction.value = 'add'
}

const cancelAddressUpdate = () => {
  localAddress.value = {}
  displayStatus.value = 'displaying'
}

// watch(
//   () => galleryMedia.value,
//   (currentVal) => {
//     if (mediaReference.value === 'userMedia') user.value.gallery[0] = currentVal[0]
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="hfull flex-col items-center gap-2 p-3">
    <Title>{{ pageTitle }}</Title>
    <header class="flex-col gap-2 w-full max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'admin-ecommerce-products' }">
          <IconsArrowWest /><span>Users</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit User</h3>
    </header>
    <main class="main flex-1 max-width-130 w-full">
      <!-- <div class="left-sidebar shadow-md">
        <EcommerceAdminProductLeftSidebar :product="product" />
      </div> -->
      <div class="flex-col gap-2">
        <AdminUsersUserInfo />

        <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
          <div class="flex-row items-center justify-between text-sm mb-1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb05">User Addresses</div>
            <div></div>
          </div>
          <div class="flex-row gap-2">
            <AdminUsersUserAddress
              v-for="userAddress in user.userAddresses"
              :key="userAddress.id"
              :userAddress="userAddress"
            />
            <button class="btn btn__secondary px-2 py-05 items-self-end text-xs" @click="addAddress">
              Add Address
            </button>
          </div>
          <Modal :outerBoxWidth="75" :outerBoxHeight="70" @closeModal="cancelAddressUpdate" v-if="showAddressFormModal">
            <template v-slot:header>
              <h3>Edit User Address</h3>
            </template>
            <template v-slot:default>
              <AdminUsersUserAddressForm
                :userAddress="user.userAddresses[addressToEditIndex]"
                :countries="countries"
                :states="states"
                :showDefaultToggleField="true"
                @updateAddress="localAddress = $event"
              />
            </template>
            <template v-slot:footer>
              <section class="flex-row gap-2 justify-end px-3">
                <button class="btn btn__secondary px-2 py-1" @click="cancelAddressUpdate">Cancel</button>
                <button class="btn btn__primary px-2 py-1" @click="saveAddress">Save Address</button>
              </section>
            </template>
          </Modal>
        </section>
        <!-- <EcommerceAdminProductPrice :product="product" @updatePrice="product.value = { ...product.value, ...$event }" /> -->
        <!-- <EcommerceAdminProductEligibility /> -->
        <!-- <EcommerceAdminProductNextHigherAssembly /> -->
        <!-- <EcommerceAdminProductStockManagement
          :product="product"
          @updateStock="product.value = { ...product.value, ...$event }"
        /> -->

        <!-- <EcommerceAdminProductAttributesContent
          v-if="product.id && product.productType === 'variable'"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
        /> -->
        <!-- <EcommerceAdminProductAttributesSlideout
          v-if="showAttributesSlideout"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
          @saveAttributes="saveProduct"
        /> -->

        <!-- <EcommerceAdminProductVariantsContent
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          v-if="product.id && product.productType === 'variable' && product.attributes.length"
        /> -->
        <!-- <EcommerceAdminProductVariantsSlideout
          v-if="showVariantsSlideout"
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          @saveVariants="saveProduct"
        /> -->
        <!-- <EcommerceProductDetails :product="product" @updateDetails="product.value = { ...product.value, ...$event }" /> -->

        <!-- <EcommerceProductShippingOptions :product="product" /> -->
        <!-- <EcommerceProductDigitalDelivery :product="product" /> -->
        <!-- <EcommerceProductExtraFields :product="product" /> -->
        <!-- <EcommerceProductSeo :product="product" /> -->
        <!-- <EcommerceProductMisc :product="product" /> -->
      </div>
      <div class="right-sidebar">
        <!-- <EcommerceAdminProductRightSidebar @productStatusUpdated="product.status = $event" @saveProduct="saveProduct" /> -->
        <section class="admin-image-gallery shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
          <!-- <EcommerceAdminImageGallery :gallery="product.gallery" /> -->
        </section>
      </div>
    </main>
    <div class="w-full flex-row justify-end px-4 sticky bottom-4 go-to-top">
      <a href="#product-go-back" class="btn btn__secondary px-2 py-1">Go To Top</a>
    </div>
    <!-- <footer class="w-full max-width-130 bg-slate-300 px-2 py-1 br-5 flex-row justify-center text-2xl">Footer</footer> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

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
