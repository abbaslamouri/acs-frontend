<script setup>
const gallery = useState('gallery')

const emit = defineEmits(['updateDetails'])

// const details = reactive({
//   name: props.slider.name ? props.slider.name : '',
//   // permalink: props.slider.permalink,
//   sortOrder: props.slider.sortOrder ? props.slider.sortOrder : 0,
//   description: props.slider.description ? props.slider.description : '',
// })

// const updateDetails = () => {
//   emit('updateDetails', details)
// }

// watch(
//   () => details,
//   (currentVal) => {
//     // updateDetails()
//     emit('updateDetails', details)
//   },
//   { deep: true }
// )
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
          <FormsBaseInput label="Name" placeholder="Name" required v-model="gallery.name" />
        </div>
        <!-- <div class="flex-1">
          <FormsBaseInput label="Permalink" placeholder="Permalink" v-model="gallery.permalink" />
        </div> -->
        <div class="flex-1">
          <FormsBaseInput label="Order" placeholder="Order" v-model="gallery.sortOrder" />
        </div>
      </div>
      <FormsBaseTextarea label="Description" placeholder="Description" v-model="gallery.description" />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
