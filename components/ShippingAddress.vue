<script setup>
defineProps({
  customerAddress: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex-col text-xs">
    <div class="flex-row gap-05">
      <div v-if="customerAddress && customerAddress.title">{{ customerAddress.title }}.</div>
      <div>{{ customerAddress.name }}</div>
    </div>
    <div>{{ customerAddress.company }}</div>
    <div>{{ customerAddress.addressLine1 }}</div>
    <div>{{ customerAddress.addressLine2 }}</div>
    <div class="flex-row gap-03">
      <div>{{ customerAddress.city }},</div>
      <div v-if="customerAddress.state">
        {{ customerAddress.state.name }}
      </div>
      <div>{{ customerAddress.postalCode }}</div>
    </div>
    <div v-if="customerAddress.country">{{ customerAddress.country.countryName }}</div>
  </div>
</template>

<style lang="scss" scoped></style>
