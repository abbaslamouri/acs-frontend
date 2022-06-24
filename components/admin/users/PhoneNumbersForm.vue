<script setup>
const props = defineProps({
  countries: {
    type: Array,
  },
  states: {
    type: Array,
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
  // orderBillingAddress: {
  //   type: Object,
  // },
  // cartPhoneNumber: {
  //   type: Object,
  //   // default: [],
  // },

  phoneNumbers: {
    type: Array,
    // default: [],
  },
  // showDefaultToggleField: {
  //   type: Boolean,
  //   default: false,
  // },
})

const emit = defineEmits(['insertNewPhoneNumber', 'removePhoneNumber', 'setDefaultPhoneNumber', 'updatePhoneNumbers'])

const { cart } = useCart()

// const countries = inject('countries')
// const states = inject('states')
const localPhoneNumbers = ref([])
// const localCartPhoneNumber = ref({ ...props.cartPhoneNumber })

for (const prop in props.phoneNumbers) {
  localPhoneNumbers.value[prop] = props.phoneNumbers[prop]
}
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

watch(
  () => localPhoneNumbers.value,
  (newVal) => {
    emit('updatePhoneNumbers', newVal)
  },
  { deep: true }
)

// watch(
//   () => cart.shippingAddress.value,
//   (newVal) => {
//     emit('updateOrderShippingAddress', newVal)
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="flex-col gap-1 bg-slate-50 border border-slate-400 p-2 br-3">
    <div class="flex-col gap-1">
      <div class="flex-row gap-2 items-center" v-for="(phoneNbr, j) in phoneNumbers" :key="`phone-number-${j}`">
        <div class="min-w-14">
          <FormsBaseSelect
            label="PhoneType"
            v-model="phoneNbr.phoneType"
            :options="[
              { key: 'Cell', name: 'Cell' },
              { key: 'Home', name: 'Home' },
              { key: 'Work', name: 'Work' },
            ]"
          />
        </div>
        <div class="min-w-20">
          <FormsBaseInput label="Phone Number" placeholder="Phone Number" v-model="phoneNbr.phoneNumber" />
        </div>
        <div class="flex-1">
          <!-- <FormsBaseSelect
            v-model="phoneNbr.phoneCountryCode"
            label="Country Code"
            nullOption="-"
            :options="
              countries.map((c) => {
                return { key: c.id, name: c.countryName }
              })
            "
          /> -->
          <label class="base-select">
            <div class="label text-xs px-1">Country</div>
            <select @change="setPhoneCountry" class="text-xs">
              <option value=""></option>
              <option
                v-for="option in countries.map((c) => {
                  return { key: c.id, name: c.countryName }
                })"
                :key="option.key"
                :value="option.key"
                :selected="phoneNbr.phoneCountryCode.id == option.key"
              >
                {{ option.name }}
              </option>
            </select>
          </label>
        </div>
        <div class="">
          <FormsBaseRadio
            v-model="phoneNbr.isDefault"
            :value="true"
            label="Set as Default"
            @update:modelValue="$emit('setDefaultPhoneNumber', j)"
          />
        </div>
        <button class="btn btn__secondary" @click="$emit('removePhoneNumber', j)" v-if="phoneNumbers.length > 1">
          <IconsMinus />
        </button>
      </div>
    </div>
    <button
      class="btn btn__secondary items-self-end px-2 py-05"
      @click="$emit('insertNewPhoneNumber')"
      :disabled="phoneNumbers.length >= 4"
    >
      Add Phone Number
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
