<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  robots: 'noindex, nofollow',
})

const { localePath } = useLocalizedPath()
const auth = useAuthStore()
const { authAppointmentsPath, authMasterProfilePath } = useBrandContext()
const localizedPath = (target: string) => localePath(target) as string

await auth.fetchMe()

await navigateTo(localizedPath(auth.user?.roles?.includes('master') ? authMasterProfilePath.value : authAppointmentsPath.value))
</script>

<template>
  <div />
</template>
