<script setup>
const props = defineProps({
  gallery: {
    type: Array,
    required: true,
  },
  galleryIntro: String,
  mediaReference: String,
})
const emit = defineEmits(['setGalleryImage', 'removeGalleryImage', 'selectFromProductGallery'])

const { errorMsg, message, showMediaSelector, mediaReference, galleryMedia } = useAppState()

// const showDropZone = ref(false)
const setMediaReference = () => {
  mediaReference.value = props.mediaReference
  showMediaSelector.value = true
}

// const emitMediaSelected = (event) => {
//   showDropZone.value = false
//   emit('mediaSelected', event)
// }
</script>

<template>
  <div>
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Image Gallery</div>
      <div></div>
    </div>
    <div class="flex-col flex-col gap-2 items-center">
      <div
        class="intro flex-row items-center gap-1 bg-slate-200 py-05 px-2 br-3 text-sm border-red"
        v-if="galleryIntro"
      >
        <IconsInfo class="w-2 h-2 fill-sky-600" />
        <p>{{ galleryIntro }}</p>
      </div>
      <AdminImageGalleryDisplay
        :gallery="gallery"
        :galleryIntro="galleryIntro"
        galleryType="product"
        @removeGalleryImage="$emit('removeGalleryImage', $event)"
        @setGalleryImage="$emit('setGalleryImage', $event)"
      />
      <div class="w-full flex-col items-center gap-2">
        <div class="flex-row gap-2">
          <button class="btn btn__image-select text-xs" @click.prevent="setMediaReference">
            <IconsImage />
            <span> Select New Images </span>
          </button>
        </div>
        <!-- <EcommerceDropZone
          v-if="showDropZone"
          class="w-full"
          @hideDropZone="showDropZone = false"
          @mediaSelected="emitMediaSelected"
        /> -->
      </div>
      <p class="text-xs">PNG, JPG, and GIF Accepted</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

main {
  display: grid;
  grid-template-columns: 1fr 30rem;
  gap: 2rem;
  align-items: flex-start;

  .center-col {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .right-col {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}
</style>
