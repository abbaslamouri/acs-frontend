<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updateDetails'])

const details = reactive({
  name: props.category.name ? props.category.name : '',
  // permalink: props.category.permalink,
  sortOrder: props.category.sortOrder ? props.category.sortOrder : 0,
  description: props.category.description ? props.category.description : '',
})

// const updateDetails = () => {
//   emit('updateDetails', details)
// }

watch(
  () => details,
  (currentVal) => {
    // updateDetails()
    emit('updateDetails', details)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="details">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Details</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div class="flex-row gap-2">
        <div class="flex-1">
          <FormsBaseInput label="Name" placeholder="Name" required v-model="details.name" />
        </div>
        <!-- <div class="flex-1">
          <FormsBaseInput label="Permalink" placeholder="Permalink" v-model="details.permalink" />
        </div> -->
        <div class="flex-1">
          <FormsBaseInput label="Order" placeholder="Order" v-model="details.sortOrder" />
        </div>
      </div>
      <FormsBaseTextarea label="Description" placeholder="Description" v-model="details.description" />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
