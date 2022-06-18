<script setup>
// import cloneDeep from 'lodash.clonedeep'

const props = defineProps({
  customerAddress: {
    type: Object,
    required: true,
  },
  email: {
    type: String,
  },
  phoneNumbers: {
    type: Array,
  },
  showDefaultToggleField: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['updateAddress', 'updateEmail'])
const countries = inject('countries')
const states = inject('states')
const localAddress = ref({})
const localEmail = ref('')
const localPhoneNumbers = ref([])

localAddress.value = { ...props.customerAddress }
localEmail.value = props.email
localPhoneNumbers.value = [...props.phoneNumbers]

const addPhoneNumber = () => {
  localPhoneNumbers.value.push({
    phoneType: '',
    phoneCountryCode: '',
    phoneNumber: '',
  })
}

// watch(
//   () => localAddress.value,
//   (newVal) => {
//     emit('updateAddress', newVal)
//   },
//   { deep: true }
// )

// watch(
//   () => localEmail.value,
//   (newVal) => {
//     emit('updateEmail', newVal)
//   }
// )
</script>

<template>
  <div class="flex-col">
    <div class="flex-col gap-2">
      {{ localPhoneNumbers }}----
      <p>All fields with * are mandatory</p>
      <section class="flex-col gap-1">
        <div>
          <FormsBaseRadioGroup
            label="My delivery address is"
            v-model="localAddress.addressType"
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
              v-model="localAddress.title"
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
            <FormsBaseInput class="flex-1" label="Name" placeholder="Name" v-model="localAddress.name" />
          </div>
        </div>
        <div class="flex-1">
          <FormsBaseInput class="flex-1" label="Email" placeholder="Email" v-model="localAddress.email" />
        </div>
      </section>
      <section class="flex-col gap-1">
        <div class="flex-row gap-2 items-center" v-for="(phone, j) in localPhoneNumbers" :key="`phone-number-${j}`">
          <div class="min-w-14">
            <FormsBaseSelect
              label="PhoneType"
              v-model="phone.phoneType"
              :options="[
                { key: 'Cell', name: 'Cell' },
                { key: 'Home', name: 'Home' },
                { key: 'Work', name: 'Work' },
              ]"
            />
          </div>
          <div class="min-w-20">
            <FormsBaseInput label="Phone Number" placeholder="Phone Number" v-model="phone.phoneNumber" />
          </div>
          <div class="flex-1">
            <FormsBaseSelect
              label="Country Code"
              nullOption="-"
              :options="
                countries.map((c) => {
                  return { key: c.id, name: c.countryName }
                })
              "
              @update:modelValue="localPhoneNumbers[j].phoneCountryCode == country.id"
            />
            <label class="base-select">
              <div class="label text-xs px-1">Country Code</div>
              <select
                @change="localPhoneNumbers[j].phoneCountryCode = countries.find((c) => c._id == $event.target.value)"
              >
                <option
                  v-for="country in countries"
                  :key="country._id"
                  :value="country._id"
                  :selected="localPhoneNumbers[j].phoneCountryCode._id == country._id"
                >
                  {{ country.countryName }}
                </option>
              </select>
            </label>
          </div>
          <button
            class="btn btn__secondary"
            @click="localPhoneNumbers.splice(j, 1)"
            v-if="localPhoneNumbers.length > 1"
          >
            <IconsMinus />
          </button>
        </div>
        <button
          class="btn btn__secondary items-self-end px-2 py-05"
          @click="addPhoneNumber"
          :disabled="localPhoneNumbers.length >= 4"
        >
          Add Phone Number
        </button>
      </section>
      <section>
        <FormsBaseInput label="Company" placeholder="Company" v-model="localAddress.company" />
        <div class="flex-row gap-2">
          <div class="flex-1">
            <FormsBaseInput label="Address Line 1" placeholder="Address Line 1" v-model="localAddress.addressLine1" />
          </div>
          <div class="flex-1">
            <FormsBaseInput label="Address Line 2" placeholder="Address Line 2" v-model="localAddress.addressLine2" />
          </div>
        </div>
        <div class="flex-row gap-2 items-center">
          <div class="flex-1">
            <FormsBaseInput label="City" placeholder="City" v-model="localAddress.city" />
          </div>
          <div class="flex-1">
            <FormsBaseSelect
              label="State"
              nullOption="-"
              :options="
                states.map((s) => {
                  return { key: s.id, name: s.name }
                })
              "
              @update:modelValue="localAddress.state = states.find((s) => s.id == $event.target.value)"
            />
            <!-- <label class="base-select">
              <div class="label text-xs px-1">State</div>
              <select @change="localAddress.state = states.find((s) => s.id == $event.target.value)">
                <option value="">Select State</option>
                <option
                  v-for="state in states"
                  :key="state.id"
                  :value="state.id"
                  :selected="localAddress.state && localAddress.state.id == state.id"
                >
                  {{ state.abbreviation }}
                </option>
              </select>
            </label> -->
          </div>
        </div>
        <div class="flex-row items-center gap-2">
          <div class="min-w-20">
            <FormsBaseInput label="Postal Code" placeholder="Postal Code" v-model="localAddress.postalCode" />
          </div>
          <div class="flex-1">
            <FormsBaseSelect
              label="Country"
              nullOption="-"
              :options="
                countries.map((c) => {
                  return { key: c.id, name: c.countryName }
                })
              "
              @update:modelValue="localAddress.country = countries.find((c) => c.id == $event.target.value)"
            />
            <!-- <label class="base-select">
              <div class="label text-xs px-1">Country</div>
              <select @change="localAddress.country = countries.find((c) => c._id == $event.target.value)">
                <option
                  v-for="country in countries"
                  :key="country._id"
                  :value="country._id"
                  :selected="localAddress.country && localAddress.country.id == country.id"
                >
                  {{ country.countryName }}
                </option>
              </select>
            </label> -->
          </div>
        </div>
      </section>
      <section class="delivery-instructions">
        <div class="field-group">
          <FormsBaseTextarea label="Delivery Instructions" rows="5" v-model="localAddress.deliveryInstructions" />
        </div>
      </section>
      <section class="items-self-start" v-if="showDefaultToggleField">
        <FormsBaseToggle label="Set as the default delivery address" v-model="localAddress.isDefault" />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
