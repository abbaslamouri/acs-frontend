<script setup>
const props = defineProps({
  countries: {
    type: Array,
  },
  states: {
    type: Array,
  },

  billingSameAsShipping: {
    type: Boolean,
  },
  // index: {
  //   type: Number,
  // },
  // orderCustomer: {
  //   type: Object,
  // },
  // orderShippingAddress: {
  //   type: Object,
  // },
  billingAddress: {
    type: Object,
  },
  // orderPhoneNumbers: {
  //   type: Array,
  //   // default: [],
  // },
  // showDefaultToggleField: {
  //   type: Boolean,
  //   default: false,
  // },
})

const emit = defineEmits(['updateBillingAddress', 'toggleBillingSameAsShipping'])

const { cart } = useCart()

// const countries = inject('countries')
// const states = inject('states')
// const localOrderCustomer = ref({})
const localBillingAddress = ref({ ...props.billingAddress })
// const cart.shippingAddress = ref({})
// const cart.customer.phoneNumbers = ref([...props.orderPhoneNumbers])

// const blankPhoneNumber = { phoneType: 'Cell', phoneCountryCode: '62ae373e2347015d44d3fb2d', phoneNumber: '2165026378' }

// cart.shippingAddress.value =
//   props.orderShippingAddress && Object.values(props.orderShippingAddress).length
//     ? { ...props.orderShippingAddress }
//     : { addressType: 'Residential' }

// if (!props.orderPhoneNumbers.length) {
//   cart.customer.phoneNumbers.value = [blankPhoneNumber]
// } else {
//   for (const prop in props.orderPhoneNumbers) {
//     cart.customer.phoneNumbers.value[prop] = props.orderPhoneNumbers[prop]
//   }
// }
// const localEmail = ref(props.customerEmail)

// cart.shippingAddress.value = { ...props.orderShippingAddress }
// localEmail.value = props.email

// const addPhoneNumber = () => {
//   cart.customer.phoneNumbers.value.push({
//     phoneType: '',
//     phoneCountryCode: '',
//     phoneNumber: '',
//   })
// }

// const insertNewPhoneNumber = () => {
//   cart.customer.phoneNumbers.value.push({ phoneType: '', phoneCountryCode: '', phoneNumber: '' })
// }

// watch(
//   () => cart.customer.phoneNumbers.value,
//   (newVal) => {
//     emi, newVal)
//   },
//   { deep: true }
// )

watch(
  () => localBillingAddress.value,
  (newVal) => {
    emit('updateBillingAddress', newVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="flex-col gap-2 min-w-30">
    <div class="flex-col gap-1">
      <h3>Shipping Address</h3>
      <FormsBaseCheckbox
        label="Same as Shipping"
        v-model="billingSameAsShipping"
        @update:modelValue="$emit('toggleBillingSameAsShipping')"
      />
    </div>
    <div class="flex-col gap-1" v-if="!billingSameAsShipping">
      <FormsBaseInput label="Address Line 1" placeholder="Address Line 1" v-model="localBillingAddress.addressLine1" />
      <FormsBaseInput label="Address Line 2" placeholder="Address Line 2" v-model="localBillingAddress.addressLine2" />
      <FormsBaseInput label="City" placeholder="City" v-model="localBillingAddress.city" />
      <FormsBaseSelect
        v-model="localBillingAddress.state"
        label="State"
        nullOption="-"
        :options="
          states.map((s) => {
            return { key: s.id, name: s.name }
          })
        "
      />
      <FormsBaseInput label="Postal Code" placeholder="Postal Code" v-model="localBillingAddress.postalCode" />
      <FormsBaseSelect
        v-model="localBillingAddress.country"
        label="Country"
        nullOption="-"
        :options="
          countries.map((c) => {
            return { key: c.id, name: c.countryName }
          })
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
