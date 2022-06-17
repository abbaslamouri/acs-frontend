<script setup>
defineProps({
  listStyle: {
    type: String,
    default: 'list',
  },
  totalCount: {
    type: Number,
  },
  isFilterActive: {
    type: Boolean,
  },
  searchObject: {
    type: Object,
  },
})
const emit = defineEmits(['toggleProductFiltersSlideout', 'setListStyle', 'clearFilter', 'clearAllFilters'])
</script>

<template>
  <section class="">
    <div class="flex-row items-center justify-between">
      <button
        class="bg-white border border-slate-300 br-3 flex-row items-center gap-3 px-3 py-1 cursor-pointer"
        @click="$emit('toggleProductFiltersSlideout')"
      >
        <span>Filter</span>
        <IconsFilter />
      </button>
      <div class="flex-col items-center gap-1">
        <span class="text-sm">View</span>
        <div class="icons flex-row gap-1">
          <IconsListTiled
            @click="$emit('setListStyle', 'tile')"
            class="icon fill-slate-400 cursor-pointer"
            :class="{ selected: listStyle === 'tile' }"
          />
          <IconsListBulleted
            @click="$emit('setListStyle', 'list')"
            class="icon fill-slate-400 cursor-pointer"
            :class="{ selected: listStyle === 'list' }"
          />
        </div>
      </div>
    </div>
    <div class="flex-row items-center gap-2 p-1" v-if="isFilterActive">
      <div>{{ totalCount }} products found</div>
      <div class="flex-row gap-1 wrap text-xs">
        <div class="" v-for="(value, key, index) in searchObject">
          <div class="flex-row items-center" v-if="value.name">
            <div class="search-object-key flex-row items-center bg-slate-400 px-1 h-3 text-slate-50">
              {{ value.title }}
            </div>
            <div class="search-object-value flex-row items-center gap-1 bg-slate-200 px-1 h-3 cursor-pointer">
              {{ value.name }}<IconsClose class="" @click="$emit('clearFilter', key)" />
            </div>
          </div>
        </div>
      </div>
      <button class="btn link px-2 py-1 items-self-end" @click="$emit('clearAllFilters')">Clear All Filtes</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.icon {
  &.selected {
    fill: $slate-800;
  }
}
</style>
