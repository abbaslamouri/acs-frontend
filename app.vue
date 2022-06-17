<script setup>
const { cart, updateLocalStorage } = useCart()
const { message, errorMsg, showMediaSelector, showCartSlideout } = useAppState()
const hideSnackbar = () => {
  errorMsg.value = null
  message.value = null
}

onMounted(() => {
  const storageCart = JSON.parse(localStorage.getItem('cart'))
  if (!storageCart) {
    cart.value = { items: [], total: 0, customer: {}, shippingAddress: {}, billingAddress: {} }
    updateLocalStorage()
  } else {
    cart.value = storageCart
  }
  // console.log(storageCart)
})
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <SnackBar
        :show="errorMsg ? true : message ? true : false"
        :message="errorMsg ? errorMsg : message ? message : ''"
        :snackbarType="errorMsg ? 'Error' : 'Success'"
        duration="0"
        @hideSnackbar="hideSnackbar"
      />
      <div class="media-selector" v-if="showMediaSelector">
        <LazyMediaUploader @mediaSelectCancel="showMediaSelector = false" />
      </div>
      <transition name="slideout">
        <EcommerceCheckoutCart v-if="showCartSlideout" />
      </transition>
    </NuxtLayout>
  </div>
</template>

<style></style>
