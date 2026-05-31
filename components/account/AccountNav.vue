<script setup lang="ts">
const props = withDefaults(defineProps<{
  showMasterProfile?: boolean
}>(), {
  showMasterProfile: false,
})

const route = useRoute()
const { t } = useLocale()
const { localePath } = useLocalizedPath()
const { isTor, authProfilePath, authAppointmentsPath, authGiftCardsPath, authMasterProfilePath, authProductOrdersPath } = useBrandContext()
const auth = useAuthStore()

const items = computed(() => {
  const links = []

  if (props.showMasterProfile) {
    links.push({ to: authMasterProfilePath.value, label: t('account.masterProfile') })
  } else {
    links.push({ to: authProfilePath.value, label: t('nav.myProfile') })
  }

  links.push(
    { to: authAppointmentsPath.value, label: t('nav.myAppointments') },
    { to: authGiftCardsPath.value, label: t('account.giftCards') },
    { to: authProductOrdersPath.value, label: t('account.productOrders') },
  )

  return links
})

const isActive = (target: string) => {
  const localized = localePath(target) as string
  return route.path === localized
}
</script>

<template>
  <div class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="localePath(item.to)"
    >
      <BaseButton
        class="whitespace-nowrap"
        :variant="isActive(item.to) ? 'primary' : 'secondary'"
        :theme="isTor ? 'tor' : 'default'"
      >
        {{ item.label }}
      </BaseButton>
    </NuxtLink>
    <BaseButton
      class="whitespace-nowrap"
      variant="secondary"
      :theme="isTor ? 'tor' : 'default'"
      @click="auth.logout"
    >
      {{ t('nav.logout') }}
    </BaseButton>
  </div>
</template>
