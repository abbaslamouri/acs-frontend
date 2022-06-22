<script setup>
const props = defineProps({
  // index: {
  //   type: Number,
  // },
  countries: {
    type: Array,
  },
  states: {
    type: Array,
  },
  customer: {
    type: Object,
  },
  shippingAddress: {
    type: Object,
  },
  // orderBillingAddress: {
  //   type: Object,
  // },
  cartPhoneNumber: {
    type: Object,
    // default: [],
  },
  // showDefaultToggleField: {
  //   type: Boolean,
  //   default: false,
  // },
})

const emit = defineEmits([
  'updateCustomer',
  'updateShippingAddress',
  'insertNewPhoneNumber',
  'removePhoneNumber',
  'setDefaultPhoneNumber',
  'updatePhoneNumbers',
])

// const { cart } = useCart()

// const countries = inject('countries')
// const states = inject('states')
// const localOrderCustomer = ref({})
// const cart.billingAddress = ref({})
const localShippingAddress = ref({ ...props.shippingAddress })
const localCustomer = ref({ ...props.customer })
// const cart.customer.phoneNumbers = ref([...props.orderPhoneNumbers])

// const blankPhoneNumber = { phoneType: 'Cell', phoneCountryCode: '62ae373e2347015d44d3fb2d', phoneNumber: '2165026378' }

// localShippingAddress.value =
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

// localShippingAddress.value = { ...props.orderShippingAddress }
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

watch(
  () => localCustomer.value,
  (newVal) => {
    emit('updateCustomer', newVal)
  },
  { deep: true }
)

watch(
  () => localShippingAddress.value,
  (newVal) => {
    emit('updateShippingAddress', newVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="flex-1 flex-col gap-2">
    <h3>Shipping Address</h3>
    <p>All fields with * are mandatory</p>
    <section class="flex-col gap-1">
      <div>
        <FormsBaseRadioGroup
          label="My delivery address is"
          v-model="localShippingAddress.addressType"
          :options="[
            { key: 'Residential', name: 'Residential' },
            { key: 'Commercial', name: 'Commercial' },
          ]"
        />
      </div>
      <div class="flex-row items-center gap-2">
        <div class="min-w-20">
          <FormsBaseSelect
            label="Title"
            v-model="localCustomer.title"
            :options="[
              { key: 'Mr/Ms', name: 'Mr/Ms' },
              { key: 'Ms', name: 'Ms' },
              { key: 'Mr', name: 'Mr' },
              { key: 'Dr', name: 'Dr' },
              { key: 'Mrs', name: 'Mrs' },
              { key: '', name: '-' },
            ]"
          />
        </div>
        <div class="flex-1">
          <FormsBaseInput
            class="flex-1"
            label="Name"
            placeholder="Name"
            v-model="localCustomer.name"
            :required="true"
          />
        </div>
      </div>
      <div class="flex-1">
        <FormsBaseInput class="flex-1" label="Email" placeholder="Email" v-model="localCustomer.email" />
      </div>
    </section>
    <section>
      <EcommerceCheckoutPhoneNumbersForm
        :countries="countries"
        :states="states"
        :cartPhoneNumber="cartPhoneNumber"
        :phoneNumbers="customer.phoneNumbers"
        @insertNewPhoneNumber="$emit('insertNewPhoneNumber')"
        @removePhoneNumber="$emit('removePhoneNumber', $event)"
        @setDefaultPhoneNumber="$emit('setDefaultPhoneNumber', $event)"
        @updatePhoneNumbers="$emit('updatePhoneNumbers')"
      />
    </section>
    <section class="flex-col gap-2">
      <FormsBaseInput label="Company" placeholder="Company" v-model="localShippingAddress.company" />
      <div class="flex-row gap-2">
        <div class="flex-1">
          <FormsBaseInput
            label="Address Line 1"
            placeholder="Address Line 1"
            v-model="localShippingAddress.addressLine1"
          />
        </div>
        <div class="flex-1">
          <FormsBaseInput
            label="Address Line 2"
            placeholder="Address Line 2"
            v-model="localShippingAddress.addressLine2"
          />
        </div>
      </div>
      <div class="flex-row gap-2 items-center">
        <div class="flex-1">
          <FormsBaseInput label="City" placeholder="City" v-model="localShippingAddress.city" />
        </div>
        <div class="flex-1">
          <FormsBaseSelect
            v-model="localShippingAddress.state"
            label="State"
            nullOption="-"
            :options="
              states.map((s) => {
                return { key: s.id, name: s.name }
              })
            "
          />
        </div>
      </div>
      <div class="flex-row items-center gap-2">
        <div class="min-w-20">
          <FormsBaseInput label="Postal Code" placeholder="Postal Code" v-model="localShippingAddress.postalCode" />
        </div>
        <div class="flex-1">
          <FormsBaseSelect
            v-model="localShippingAddress.country"
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
    </section>
    <section class="delivery-instructions">
      <div class="field-group">
        <FormsBaseTextarea label="Delivery Instructions" rows="5" v-model="localShippingAddress.deliveryInstructions" />
      </div>
    </section>
    <section class="items-self-start">
      <FormsBaseToggle label="Set as the default delivery address" v-model="localShippingAddress.isDefault" />
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
