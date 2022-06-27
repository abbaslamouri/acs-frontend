<script setup>
defineProps({
  userAddress: {
    type: Object,
  },
})

const user = useState('user')
</script>

<template>
  <div class="flex-row gap-4">
    <div class="flex-col gap-1 min-w-20">
      <div class="flex-col">
        <h3>Address</h3>
        <div class="flex-row gap-05">
          <div v-if="userAddress.title">{{ userAddress.title }}.</div>
          <div>{{ userAddress.name }}</div>
        </div>
        <div>{{ userAddress.company }}</div>
        <div>{{ userAddress.addressLine1 }}</div>
        <div>{{ userAddress.addressLine2 }}</div>
        <div class="flex-row gap-03" v-if="userAddress.city && userAddress.state">
          <div>{{ userAddress.city }},</div>
          <div v-if="userAddress.state">
            {{ userAddress.state.name }}
          </div>
          <div>{{ userAddress.postalCode }}</div>
        </div>
        <div v-if="userAddress.country">
          {{ userAddress.country.countryName }}
        </div>
      </div>

      <div class="flex-col gap-05">
        <div class="link flex-row items-center" v-if="userAddress.defaultShippingAddress">
          <IconsCheck class="w-16px h-16px" /> <span>Customer default shipping address</span>
        </div>
        <div class="link flex-row items-center" v-if="userAddress.defaultBillingAddress">
          <IconsCheck class="w-16px h-16px" /> <span>Customer default billing address</span>
        </div>
      </div>
    </div>
    <div class="flex-col">
      <h3>Phone Numbers</h3>
      <div class="flex-row" v-for="phoneNbr in userAddress.phoneNumbers">
        <div v-if="phoneNbr.phoneCountryCode">+{{ phoneNbr.phoneCountryCode.phoneCode }}-</div>
        <div class="flex-row gap-1">
          <span>{{ phoneNbr.phoneNumber }}</span
          ><span class="link" v-if="phoneNbr.default">Default phone Number</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
