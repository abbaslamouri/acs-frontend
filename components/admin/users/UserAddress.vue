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
  <div class="flex-col">
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
</template>

<style lang="scss" scoped></style>
