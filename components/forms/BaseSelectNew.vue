<script setup>
defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	// value: {
	// 	type: [String, Number],
	// },
	options: {
		type: Array,
		required: true,
	},
	label: {
		type: String,
		default: '',
	},
	nullOption: {
		type: String,
		defualt: 'Select Option',
	},
})
const emit = defineEmits(['update:modelValue'])

const errorMsg = ref('')
const uuid = useUniqueId().getId()
const active = ref(false)
const eligibilities = ref([])

const setSelected = (event) => {
	console.log(event)
	emit('update:modelValue', event)
	active.value = !active.value
}
</script>

<script>
export default {
	inheritAttrs: false,
}
</script>

<template>
	<div class="wrapper">
		<h2>{{ label }}</h2>
		<div class="select-box flex-col gap-1">
			<div
				class="selected flex-row justify-between items-center br-3 cursor-pointer uppercase"
				@click="active = !active"
			>
				<div v-if="!modelValue">{{ nullOption }}</div>
				<div v-else>{{ modelValue }}</div>
				<IconsChevronDown v-if="!active" />
				<IconsChevronUp v-else />
			</div>
			<div class="options-container border border-slate-400 br-3" :class="{ active }">
				<div class="option flex-col" v-for="option in options">
					<label class="px-2 py-1 cursor-pointer">
						<input
							class=""
							type="checkbox"
							:checked="option.key === modelValue"
							v-bind="$attrs"
							@change="setSelected(option.name)"
						/>

						{{ option.name }}
					</label>
				</div>
			</div>
		</div>
		<!-- <label :class="`base-select base-select-${uuid}`" v-if="label" :for="`base-select-${uuid}`">
			<div class="label text-xs px-1">{{ label }}</div>
			<select
				ref="selectRef"
				:value="modelValue"
				:class="`base-select-${uuid}`"
				:aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
				:aria-invalid="errorMsg ? true : null"
				:aria-readonly="typeof $attrs.readonly != undefined ? true : null"
				:aria-required="typeof $attrs.required != undefined ? true : null"
				@change="emit('update:modelValue', $event.target.value)"
			>
				<option value="">{{ nullOption }}</option>
				<option
					v-for="option in options"
					:key="option.key"
					:value="option.key"
					:selected="modelValue === option.key"
					:disabled="option.disabled || option.disabledIf"
				>
					{{ option.name }}
				</option>
			</select>
		</label> -->
	</div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.select-box {
	.selected {
		padding: 1rem 2rem;
		background-color: $slate-400;

		&:hover {
			// background-color: $slate-50;
		}
	}
	.options-container {
		max-height: 0;
		opacity: 0;
		transition: all 0.4s;
		overflow: auto;

		&.active {
			max-height: 24rem;
			opacity: 1;
		}

		/* width */
		&::-webkit-scrollbar {
			width: 10px;
			border-raduis: 3px;
		}

		/* Track */
		&::-webkit-scrollbar-track {
			background: #f1f1f1;
		}

		/* Handle */
		&::-webkit-scrollbar-thumb {
			background: #888;
		}

		/* Handle on hover */
		&::-webkit-scrollbar-thumb:hover {
			background: #555;
		}

		.option {
			// padding: 1rem 2rem;
			background-color: $slate-400;
			cursor: pointer;

			&:hover {
				background-color: $slate-50;
			}

			input {
				display: none;
				// opacity: 0;
				// visibility: none;
			}
		}
	}
}
</style>
