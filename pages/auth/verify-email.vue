<script setup>
const router = useRouter()
const route = useRoute()
// const config = useRuntimeConfig()
const { user, token, isAuthenticated, confirmEmail } = useAuth()
const { errorMsg, message } = useAppState()
const userEmail = ref('abbaslamouri@yrlus.com')

onMounted(() => {
  console.log('TOKEN', route.query.token)
})

const confirmRegistration = async () => {
  errorMsg.value = null
  message.value = null
  const resonse = await confirmEmail({ userEmail: userEmail.value, token: route.query.token })
  console.log(resonse)
  if (!resonse) return
  // const auth = useCookie('auth', {
  //   expires: new Date(Date.now() + config.COOKIE_EXPIRES_IN * 24 * 3600 * 1000),
  //   path: '/',
  // })
  // auth.value = resonse.auth
  // user.value = resonse.user
  // token.value = resonse.token
  // isAuthenticated.value = true
  router.push({ name: 'ecommerce-products' })
  message.value = 'Registration successfull.  You are now logged in.'
}

const getNewToken = async () => {
  router.push({ name: 'auth-forgotpassword' })
  showAuthForm.value = false
}
</script>

<template>
  <main class="flex-1 bg-slate-900 flex-row justify-center items-start pt-10">
    <form class="bg-slate-50 p-4 br-3 flex-col gap-2 min-w-40" @submit.prevent="confirmRegistration">
      <h2>Activate your account</h2>
      <div class="bg-red-100 p-2 br-3 text-xs flex-col gap-2" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
        <button
          class="btn btn__primary py-05 px-2 text-xs"
          @click.prevent="getNewToken"
          v-if="errorMsg.includes('token')"
        >
          <p>Click Here to get a new token</p>
        </button>
      </div>
      <FormsBaseInput type="email" label="Email" placeholder="Email" v-model="userEmail" :required="true" />
      <button class="btn btn__primary py-05 px-1 items-self-end">Verity Email<IconsChevronRight /></button>
    </form>
  </main>
</template>

<style lang="scss" scoped></style>
