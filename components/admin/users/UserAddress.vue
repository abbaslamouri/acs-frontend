<script setup>
defineProps({
  addressIndex: {
    type: Number,
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
          <div v-if="user.userAddresses[addressIndex].title">{{ user.userAddresses[addressIndex].title }}.</div>
          <div>{{ user.userAddresses[addressIndex].name }}</div>
        </div>
        <div>{{ user.userAddresses[addressIndex].company }}</div>
        <div>{{ user.userAddresses[addressIndex].addressLine1 }}</div>
        <div>{{ user.userAddresses[addressIndex].addressLine2 }}</div>
        <div
          class="flex-row gap-03"
          v-if="user.userAddresses[addressIndex].city && user.userAddresses[addressIndex].state"
        >
          <div>{{ user.userAddresses[addressIndex].city }},</div>
          <div v-if="user.userAddresses[addressIndex].state">
            {{ user.userAddresses[addressIndex].state.name }}
          </div>
          <div>{{ user.userAddresses[addressIndex].postalCode }}</div>
        </div>
        <div v-if="user.userAddresses[addressIndex].country">
          {{ user.userAddresses[addressIndex].country.countryName }}
        </div>
      </div>

      <div class="flex-col gap-05">
        <div class="link flex-row items-center" v-if="user.userAddresses[addressIndex].defaultShippingAddress">
          <IconsCheck class="w-16px h-16px" /> <span>Customer default shipping address</span>
        </div>
        <div class="link flex-row items-center" v-if="user.userAddresses[addressIndex].defaultBillingAddress">
          <IconsCheck class="w-16px h-16px" /> <span>Customer default billing address</span>
        </div>
      </div>
    </div>
    <div class="flex-col">
      <h3>Phone Numbers</h3>
      <div class="flex-row" v-for="phoneNbr in user.userAddresses[addressIndex].phoneNumbers">
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
