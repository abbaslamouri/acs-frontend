<script setup>
const props = defineProps({
  // index: {
  //   type: Number,
  // },
  // orderCustomer: {
  //   type: Object,
  // },
  // orderShippingAddress: {
  //   type: Object,
  // },
  // orderBillingAddress: {
  //   type: Object,
  // },
  // orderPhoneNumbers: {
  //   type: Array,
  //   // default: [],
  // },
  // showDefaultToggleField: {
  //   type: Boolean,
  //   default: false,
  // },
})

const emit = defineEmits(['updateOrderShippingAddress', 'insertNewPhoneNumber', 'updatePhoneNumbers'])

const { cart } = useCart()

const countries = inject('countries')
const states = inject('states')
// const localOrderCustomer = ref({})
// const cart.billingAddress = ref({})
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
//     emit('updatePhoneNumbers', newVal)
//   },
//   { deep: true }
// )

// watch(
//   () => cart.shippingAddress.value,
//   (newVal) => {
//     emit('updateOrderShippingAddress', newVal)
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="flex-row gap-2 bg-slate-900">
    <div class="flex-1 bg-slate-50 p-2">
      <h3>Shipping Address</h3>
      <p>All fields with * are mandatory</p>
      <section class="flex-col gap-1">
        <div>
          <FormsBaseRadioGroup
            label="My delivery address is"
            v-model="cart.shippingAddress.addressType"
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
              v-model="cart.title"
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
            <FormsBaseInput class="flex-1" label="Name" placeholder="Name" v-model="cart.name" :required="true" />
          </div>
        </div>
        <div class="flex-1">
          <FormsBaseInput class="flex-1" label="Email" placeholder="Email" v-model="cart.email" />
        </div>
      </section>
      <section class="flex-col gap-1">
        <div class="flex-row gap-2 items-center">
          <div class="min-w-14">
            <FormsBaseSelect
              label="PhoneType"
              v-model="cart.phoneNumber.phoneType"
              :options="[
                { key: 'Cell', name: 'Cell' },
                { key: 'Home', name: 'Home' },
                { key: 'Work', name: 'Work' },
              ]"
            />
          </div>
          <div class="min-w-20">
            <FormsBaseInput label="Phone Number" placeholder="Phone Number" v-model="cart.phoneNumber.phoneNumber" />
          </div>
          <div class="flex-1">
            <FormsBaseSelect
              v-model="cart.phoneNumber.phoneCountryCode"
              label="Country Code"
              nullOption="-"
              :options="
                countries.map((c) => {
                  return { key: c.id, name: c.countryName }
                })
              "
            />
          </div>
          <!-- <button
            class="btn btn__secondary"
            @click="cart.customer.phoneNumbers.splice(j, 1)"
            v-if="cart.customer.phoneNumbers.length > 1"
          >
            <IconsMinus />
          </button> -->
        </div>
        <!-- <button
          class="btn btn__secondary items-self-end px-2 py-05"
          @click="$emit('insertNewPhoneNumber')"
          :disabled="cart.customer.phoneNumbers.length >= 4"
        >
          Add Phone Number
        </button> -->
      </section>
      <section>
        <FormsBaseInput label="Company" placeholder="Company" v-model="cart.shippingAddress.company" />
        <div class="flex-row gap-2">
          <div class="flex-1">
            <FormsBaseInput
              label="Address Line 1"
              placeholder="Address Line 1"
              v-model="cart.shippingAddress.addressLine1"
            />
          </div>
          <div class="flex-1">
            <FormsBaseInput
              label="Address Line 2"
              placeholder="Address Line 2"
              v-model="cart.shippingAddress.addressLine2"
            />
          </div>
        </div>
        <div class="flex-row gap-2 items-center">
          <div class="flex-1">
            <FormsBaseInput label="City" placeholder="City" v-model="cart.shippingAddress.city" />
          </div>
          <div class="flex-1">
            <FormsBaseSelect
              v-model="cart.shippingAddress.state"
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
            <FormsBaseInput label="Postal Code" placeholder="Postal Code" v-model="cart.shippingAddress.postalCode" />
          </div>
          <div class="flex-1">
            <FormsBaseSelect
              v-model="cart.shippingAddress.country"
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
          <FormsBaseTextarea
            label="Delivery Instructions"
            rows="5"
            v-model="cart.shippingAddress.deliveryInstructions"
          />
        </div>
      </section>
      <section class="items-self-start" v-if="showDefaultToggleField">
        <FormsBaseToggle label="Set as the default delivery address" v-model="cart.shippingAddress.isDefault" />
      </section>
    </div>
    <div class="bg-slate-50 p-2 min-w-30">
      <div class="flex-col gap-1">
        <h3>Shipping Address</h3>
        <FormsBaseCheckbox label="Same as Shipping" v-model="cart.billingAddress.sameAsShipping" />
      </div>
      <div v-if="!cart.billingAddress.sameAsShipping">
        <FormsBaseInput
          label="Address Line 1"
          placeholder="Address Line 1"
          v-model="cart.billingAddress.addressLine1"
        />
        <FormsBaseInput
          label="Address Line 2"
          placeholder="Address Line 2"
          v-model="cart.billingAddress.addressLine2"
        />
        <FormsBaseInput label="City" placeholder="City" v-model="cart.billingAddress.city" />
        <FormsBaseSelect
          v-model="cart.billingAddress.state"
          label="State"
          nullOption="-"
          :options="
            states.map((s) => {
              return { key: s.id, name: s.name }
            })
          "
        />
        <FormsBaseInput label="Postal Code" placeholder="Postal Code" v-model="cart.billingAddress.postalCode" />
        <FormsBaseSelect
          v-model="cart.billingAddress.country"
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
  </div>
</template>

<style lang="scss" scoped></style>
