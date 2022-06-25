<script setup>
defineProps({
  userAddress: {
    type: Object,
    required: true,
  },
  states: {
    type: Array,
  },
  countries: {
    type: Array,
  },
})
</script>

<template>
  <div class="flex-col gap-2">
    <div class="min-w-30">
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
      <div v-if="userAddress.country">{{ userAddress.country.countryName }}</div>
    </div>
    <div>
      <div v-for="phoneNbr in userAddress.phoneNumbers">
        <div>+{{phoneNbr.phoneCountryCode}} {{phoneNbr.phoneNumber }}</div>
      </div>
    </div>
    <div class="flex-col gap-05">
      <div class="link flex-row items-center" v-if="userAddress.isDefault">
        <IconsCheck class="w-16px h-16px" /> <span>Customer default shipping address</span>
      </div>
      <div class="link flex-row items-center" v-if="userAddress.billingAddress">
        <IconsCheck class="w-16px h-16px" /> <span>Customer default shipping address</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
