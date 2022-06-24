<script setup>
const config = useRuntimeConfig()
const route = useRoute()
const { fetchAll } = useHttp()
const { isAuthenticated } = useAuth()
const logo = ref('')
const response = await fetchAll('media', { originalName: 'ACS-Logo-150x45.jpeg' })
if (response) logo.value = response.docs[0]
</script>

<template>
  <div
    class="text-slate-50 flex-row items-center gap-1 uppercase font-bold h-6 cursor-pointer px-1 text-sm tracking-wide"
  >
    <NuxtLink :to="{ name: `index` }">
      <div class="" v-if="route.name.includes('admin')">Aviation Component Solutions</div>
      <div class="h-4 br-3" v-else>
        <img class="w-full h-full contain" :src="`${config.backendUrl}/${logo.path}`" />
      </div>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped></style>
