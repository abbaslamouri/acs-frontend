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
const countries = ref([])
const states = ref([])
let response = null
const user = ref({ userAddresses: [] })
const id = route.params.id === '_' ? null : route.params.id

if (id) {
  response = await fetchDoc('users', id)
  if (response) user.value = response.doc
}
response = await fetchAll('countries', { sort: 'countryName' })
if (response) countries.value = response.docs
// console.log(countries.value)
response = await fetchAll('states', { sort: 'name' })
if (response) states.value = response.docs
// console.log(states.value)

const currentUserAddress = JSON.stringify(user.value.userAddresses)

console.log(user.value)

const insertNewAddress = () => {
  user.value.userAddresses.unshift({
    addressType: 'Residential',
    // email: 'abbaslamnouri1@yrlus.com',
    title: 'Ms',
    name: 'Nelly Vileikis',
    company: 'YRL Consulting LLC',
    addressLine1: '599 Deep Woods Dr.',
    addressLine2: 'Room 101',
    city: 'Aurora',
    postalCode: '442021',
    state: states.value.find((c) => c.name === 'Alaska'),
    country: countries.value.find((c) => c.countryName === 'Algeria'),

    phoneNumbers: [
      {
        phoneType: 'Cell',
        phoneNumber: '21650263781',
        phoneCountryCode: countries.value.find((c) => c.countryName === 'Algeria'),
        isDefault: true,
      },
    ],
    deliveryInstructions: 'Some delivery instructions1',
  })
  if (user.value.userAddresses.length == 1) user.value.userAddresses[0].isDefault = true
  addressToEditIndex.value = user.value.userAddresses.length - 1
  showAddressFormModal.value = true
  // displayStatus.value = 'editing'
  // editAction.value = 'add'
}

const editAddress = (i) => {
  addressToEditIndex.value = i
  showAddressFormModal.value = true
  // displayStatus.value = 'editing'
  // editAction.value = 'add'
}

const insertNewPhoneNumber = () => {
  console.log('HHHHHH')
  user.value.userAddresses[addressToEditIndex.value].phoneNumbers.push({
    phoneType: '',
    phoneCountryCode: '',
    phoneNumber: '',
    isDefault: false,
  })
}

const removePhoneNumber = (event) => {
  console.log('HHHHHH', event)
  user.value.userAddresses[addressToEditIndex.value].phoneNumbers.splice(event, 1)
  if (user.value.userAddresses[addressToEditIndex.value].phoneNumbers.length === 1) {
    user.value.userAddresses[addressToEditIndex.value].phoneNumbers[0].isDefault = true
  } else {
    if (!user.value.userAddresses[addressToEditIndex.value].phoneNumbers.find((p) => p.isDefault))
      user.value.userAddresses[addressToEditIndex.value].phoneNumbers[0].isDefault = true
  }
}

const setDefaultPhoneNumber = (event) => {
  console.log('HHHHHH', event)
  for (const prop in user.value.userAddresses[addressToEditIndex.value].phoneNumbers) {
    user.value.userAddresses[addressToEditIndex.value].phoneNumbers[prop].isDefault = false
  }
  user.value.userAddresses[addressToEditIndex.value].phoneNumbers[event].isDefault = true
}

const closeModal = () => {
  if (currentUserAddress !== JSON.stringify(user.value.userAddresses))
    return alert('You have unsaved changes, please save your chnages or click cancel to discard your changes')
  showAddressFormModal.value = false
}

const cancelAddressUpdate = () => {
  user.value.userAddresses = JSON.parse(currentUserAddress)
  showAddressFormModal.value = false
}

// const updateUserAddress = (event) => {
// console.log(event)
// user.userAddresses[addressToEditIndex] = $event
// }

const saveAddress = () => {
  console.log(user.value)
  showAddressFormModal.value = false
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
      {{ user }}
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
        <AdminUsersUserInfo :user="user" @updateUser="user = $event" />

        <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
          <div class="flex-row items-center justify-between text-sm mb-1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb05">User Addresses</div>
            <div></div>
          </div>
          <div class="flex-col gap-4">
            <div
              class="flex-row items-center gap-4 text-xs"
              v-for="(userAddress, i) in user.userAddresses"
              :key="userAddress.id"
            >
              <AdminUsersUserAddress :userAddress="userAddress" :countries="countries" :states="states" />
              <button class="btn btn__secondary px-2 py-05 text-xs br-3" @click="editAddress(i)">Edit Address</button>
            </div>

            <button class="btn btn__secondary px-2 py-05 items-self-end text-xs" @click="insertNewAddress">
              Add Address
            </button>
          </div>
          <Modal :outerBoxWidth="75" :outerBoxHeight="70" @closeModal="closeModal" v-if="showAddressFormModal">
            <template v-slot:header>
              <h3>Edit User Address</h3>
            </template>
            <template v-slot:default>
              <AdminUsersUserAddressForm
                :userAddress="user.userAddresses[addressToEditIndex]"
                :countries="countries"
                :states="states"
                :showDefaultToggleField="true"
                @updateUserAddress="user.userAddresses[addressToEditIndex] = $event"
                @insertNewPhoneNumber="insertNewPhoneNumber"
                @removePhoneNumber="removePhoneNumber"
                @setDefaultPhoneNumber="setDefaultPhoneNumber"
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
