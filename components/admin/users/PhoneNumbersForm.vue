<script setup>
const props = defineProps({
  // countries: {
  //   type: Array,
  // },
  // states: {
  //   type: Array,
  // },
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
  // phoneNumbers: {
  //   type: Array,
  //   // default: [],
  // },

  // phoneNumber: {
  //   type: Object,
  //   // default: [],
  // },

  addressIndex: {
    type: Number,
  },
  // phoneIndex: {
  //   type: Number,
  // },
  // showDefaultToggleField: {
  //   type: Boolean,
  //   default: false,
  // },
})

const emit = defineEmits(['insertNewPhoneNumber', 'removePhoneNumber', 'setDefaultPhoneNumber', 'updatePhoneNumber'])

const user = useState('user')
// console.log(user.value)

// const { cart } = useCart()

const countries = inject('countries')
// const states = inject('states')

// const user.userAddresses[addressIndex].phoneNumbers[phoneIndex] = ref({ ...props.phoneNumber })
const phoneTypeOptions = [
  { key: 'Cell', name: 'Cell' },
  { key: 'Home', name: 'Home' },
  { key: 'Work', name: 'Work' },
]
// const localCartPhoneNumber = ref({ ...props.cartPhoneNumber })

// for (const prop in props.phoneNumbers) {
//   user.userAddresses[addressIndex].phoneNumbers[phoneIndex]s.value[prop] = props.phoneNumbers[prop]
// }
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

// const updatePhoneCountryCode = (event, j) => {
//   console.log(event, j)

//   const country = props.countries.find((c) => c.id == event)
//   if (country) user.userAddresses[addressIndex].phoneNumbers[phoneIndex].value.phoneCountryCode = country

//   // user.userAddresses[addressIndex].phoneNumbers[phoneIndex]s[j].phoneCountryCode = $event.target.value
// }

const setDefaultPhoneNumber = (event, j) => {
  console.log(event, j)
  if (event) {
    for (const prop in user.value.userAddresses[props.addressIndex].phoneNumbers) {
      user.value.userAddresses[props.addressIndex].phoneNumbers[prop].isDefault = false
    }
    user.value.userAddresses[props.addressIndex].phoneNumbers[j].isDefault = true
  }
}

const removePhoneNumber = (j) => {
  console.log('HHHHHH', j)
  user.value.userAddresses[props.addressIndex].phoneNumbers.splice(j, 1)
  if (user.value.userAddresses[props.addressIndex].phoneNumbers.length === 1) {
    user.value.userAddresses[props.addressIndex].phoneNumbers[0].isDefault = true
  } else {
    if (!user.value.userAddresses[props.addressIndex].phoneNumbers.find((p) => p.isDefault))
      user.value.userAddresses[props.addressIndex].phoneNumbers[0].isDefault = true
  }
}

// watch(
//   () => user.userAddresses[addressIndex].phoneNumbers[phoneIndex].value,
//   (newVal) => {
//     emit('updatePhoneNumber', { phoneNumber: newVal, phoneIndex: props.index })
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
  <div class="flex-col gap-1">
    <!-- {{ phoneIndex }} -->
    <!-- {{ user.userAddresses[addressIndex].phoneNumbers[phoneIndex] }} -->

    <div class="flex-col items-center gap-2">
      <div
        class="flex-row gap-2 items-center"
        v-for="(phoneNbr, j) in user.userAddresses[addressIndex].phoneNumbers"
        :key="`phone-number-${j}`"
      >
        <!-- {{ user.userAddresses[addressIndex].phoneNumbers[j] }} -->
        <div class="min-w-14">
          <!-- <label class="base-select">
            <div class="label text-xs px-1">PhoneType</div>
            <select @change="phoneNbr.phoneType = $event.target.value" class="text-xs">
              <option value=""></option>
              <option
                v-for="option in phoneTypeOptions"
                :key="option.key"
                :value="option.key"
                :selected="phoneNbr.phoneType == option.key"
              >
                {{ option.name }}
              </option>
            </select>
          </label> -->
          <FormsBaseSelect
            label="PhoneType"
            v-model="user.userAddresses[addressIndex].phoneNumbers[j].phoneType"
            :options="[
              { key: 'Cell', name: 'Cell' },
              { key: 'Home', name: 'Home' },
              { key: 'Work', name: 'Work' },
            ]"
          />
        </div>
        <div class="min-w-20">
          <FormsBaseInput
            label="Phone Number"
            placeholder="Phone Number"
            v-model="user.userAddresses[addressIndex].phoneNumbers[j].phoneNumber"
          />
        </div>
        <div class="flex-1">
          <!-- <FormsBaseSelect
          :value="user.userAddresses[addressIndex].phoneNumbers[phoneIndex].phoneCountryCode.id"
          @update:modelValue="user.userAddresses[addressIndex].phoneNumbers[phoneIndex].phoneCountryCode = countries.find((c) => c.id == $event)"
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
            <select
              @change="
                user.userAddresses[addressIndex].phoneNumbers[j].phoneCountryCode = countries.find(
                  (c) => c.id == $event.target.value
                )
              "
              class="text-xs"
            >
              <option value=""></option>
              <option
                v-for="option in countries.map((c) => {
                  return { key: c.id, name: c.countryName }
                })"
                :key="option.key"
                :value="option.key"
                :selected="
                  user.userAddresses[addressIndex].phoneNumbers[j] &&
                  user.userAddresses[addressIndex].phoneNumbers[j].phoneCountryCode.id == option.key
                "
              >
                {{ option.name }}
              </option>
            </select>
          </label>
        </div>
        <div class="">
          <FormsBaseCheckbox
            v-model="user.userAddresses[addressIndex].phoneNumbers[j].isDefault"
            label="Set as Default"
            @update:modelValue="setDefaultPhoneNumber($event, j)"
          />
        </div>
        <button
          class="btn btn__secondary"
          @click="removePhoneNumber(j)"
          v-if="user.userAddresses[addressIndex].phoneNumbers.length > 1"
        >
          <IconsMinus />
        </button>
      </div>
    </div>
    <!-- <button
      class="btn btn__secondary items-self-end px-2 py-05"
      @click="$emit('insertNewPhoneNumber')"
      :disabled="user.userAddresses[addressIndex].phoneNumbers[phoneIndex]s.length >= 4"
    >
      Add Phone Number
    </button> -->
  </div>
</template>

<style lang="scss" scoped></style>
