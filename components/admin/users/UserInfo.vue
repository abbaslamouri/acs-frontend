<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updateUser'])

const localUser = ref({ ...props.user })

watch(
  () => localUser.value,
  (newVal) => {
    emit('updateUser', newVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">User Information</div>
      <div></div>
    </div>
    <div class="flex-row gap-2"></div>
    <div class="flex-1 flex-row gap-2">
      <div class="flex-1">
        <FormsBaseInput label="Name" placeholder="Name" :required="true" v-model="user.name" />
      </div>
      <div class="flex-1">
        <FormsBaseInput label="Email" placeholder="Email" :required="true" v-model="user.email" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
