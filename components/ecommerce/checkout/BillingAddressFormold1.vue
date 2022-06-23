<script setup>
// import cloneDeep from 'lodash.clonedeep'

// const { cart, updateLocalStorage } = useCart()

const props = defineProps({
  customerBillingAddress: {
    type: Object,
    // required: true,
  },
  // customerPhoneNumbers: {
  //   type: Array,
  // },
  // showDefaultToggleField: {
  //   type: Boolean,
  //   default: false,
  // },
})

const emit = defineEmits(['updateCustomerBillingAddress', 'updatePhoneNumbers'])
const countries = inject('countries')
const states = inject('states')
const localBillingAddress = ref({})
// const sameAsShipping = ref(true)
// const localPhoneNumbers = ref([])

localBillingAddress.value =
  props.customerBillingAddress && Object.values(props.customerBillingAddress).length
    ? { ...props.customerBillingAddress }
    : { sameAsShipping: true }

// if (!props.customerPhoneNumbers.length) {
//   localPhoneNumbers.value = [blankPhoneNumber]
// } else {
//   for (const prop in props.customerPhoneNumbers) {
//     localPhoneNumbers.value[prop] = props.customerPhoneNumbers[prop]
//   }
// }
// const localEmail = ref(props.customerEmail)

// localBillingAddress.value = { ...props.customerBillingAddress }
// localEmail.value = props.email

// const addPhoneNumber = () => {
//   localPhoneNumbers.value.push({
//     phoneType: '',
//     phoneCountryCode: '',
//     phoneNumber: '',
//   })
// }

// const insertNewPhoneNumber = () => {
//   localPhoneNumbers.value.push({ phoneType: '', phoneCountryCode: '', phoneNumber: '' })
// }

// watch(
//   () => localPhoneNumbers.value,
//   (newVal) => {
//     emit('updatePhoneNumbers', newVal)
//   },
//   { deep: true }
// )

watch(
  () => localBillingAddress.value,
  (newVal) => {
    emit('updateCustomerBillingAddress', newVal)
  },
  { deep: true }
)

// watch(
//   () => localBillingAddress.sameAsShipping,
//   (newVal) => {
//     if (newVal) localBillingAddress = { sameAsShipping: true }
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="flex-col gap-1">
    <div class="flex-col gap-1">
      <h3>Shipping Address</h3>
      <FormsBaseCheckbox label="Same as Shipping" v-model="localBillingAddress.sameAsShipping" />
    </div>
    <div v-if="!localBillingAddress.sameAsShipping">
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
