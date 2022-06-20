<script setup>
// import cloneDeep from 'lodash.clonedeep'

// const { cart, updateLocalStorage } = useCart()

const props = defineProps({
	customerShippingAddress: {
		type: Object,
		// required: true,
	},
	customerPhoneNumbers: {
		type: Array,
		default: [],
	},
	showDefaultToggleField: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['updateCustomerShippingAddress', 'updatePhoneNumbers'])
const countries = inject('countries')
const states = inject('states')
const localShippingAddress = ref({})
const localPhoneNumbers = ref([])

const blankPhoneNumber = { phoneType: 'Cell', phoneCountryCode: '62ae373e2347015d44d3fb2d', phoneNumber: '2165026378' }

localShippingAddress.value =
	props.customerShippingAddress && Object.values(props.customerShippingAddress).length
		? { ...props.customerShippingAddress }
		: { addressType: 'Residential' }

if (!props.customerPhoneNumbers.length) {
	localPhoneNumbers.value = [blankPhoneNumber]
} else {
	for (const prop in props.customerPhoneNumbers) {
		localPhoneNumbers.value[prop] = props.customerPhoneNumbers[prop]
	}
}
// const localEmail = ref(props.customerEmail)

// localShippingAddress.value = { ...props.customerShippingAddress }
// localEmail.value = props.email

// const addPhoneNumber = () => {
//   localPhoneNumbers.value.push({
//     phoneType: '',
//     phoneCountryCode: '',
//     phoneNumber: '',
//   })
// }

const insertNewPhoneNumber = () => {
	localPhoneNumbers.value.push({ phoneType: '', phoneCountryCode: '', phoneNumber: '' })
}

watch(
	() => localPhoneNumbers.value,
	(newVal) => {
		emit('updatePhoneNumbers', newVal)
	},
	{ deep: true }
)

watch(
	() => localShippingAddress.value,
	(newVal) => {
		emit('updateCustomerShippingAddress', newVal)
	},
	{ deep: true }
)
</script>

<template>
	<div class="flex-col gap-2">
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
						v-model="localShippingAddress.title"
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
						v-model="localShippingAddress.name"
						:required="true"
					/>
				</div>
			</div>
			<div class="flex-1">
				<FormsBaseInput class="flex-1" label="Email" placeholder="Email" v-model="localShippingAddress.email" />
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
						v-model="localPhoneNumbers[j].phoneCountryCode"
						label="Country Code"
						nullOption="-"
						:options="
							countries.map((c) => {
								return { key: c.id, name: c.countryName }
							})
						"
					/>
					<!-- <label class="base-select">
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
            </label> -->
				</div>
				<button class="btn btn__secondary" @click="localPhoneNumbers.splice(j, 1)" v-if="localPhoneNumbers.length > 1">
					<IconsMinus />
				</button>
			</div>
			<button
				class="btn btn__secondary items-self-end px-2 py-05"
				@click="insertNewPhoneNumber"
				:disabled="localPhoneNumbers.length >= 4"
			>
				Add Phone Number
			</button>
		</section>
		<section>
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
					<!-- <label class="base-select">
              <div class="label text-xs px-1">State</div>
              <select @change="localShippingAddress.state = states.find((s) => s.id == $event.target.value)">
                <option value="">Select State</option>
                <option
                  v-for="state in states"
                  :key="state.id"
                  :value="state.id"
                  :selected="localShippingAddress.state && localShippingAddress.state.id == state.id"
                >
                  {{ state.abbreviation }}
                </option>
              </select>
            </label> -->
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
					<!-- <label class="base-select">
              <div class="label text-xs px-1">Country</div>
              <select @change="localShippingAddress.country = countries.find((c) => c._id == $event.target.value)">
                <option
                  v-for="country in countries"
                  :key="country._id"
                  :value="country._id"
                  :selected="localShippingAddress.country && localShippingAddress.country.id == country.id"
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
				<FormsBaseTextarea label="Delivery Instructions" rows="5" v-model="localShippingAddress.deliveryInstructions" />
			</div>
		</section>
		<section class="items-self-start" v-if="showDefaultToggleField">
			<FormsBaseToggle label="Set as the default delivery address" v-model="localShippingAddress.isDefault" />
		</section>
	</div>
</template>

<style lang="scss" scoped></style>
