<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from "~/components/base/Card.vue";
import SkeletonBlock from "~/components/shared/SkeletonBlock.vue";
import BadgeStatus from "~/components/base/BadgeStatus.vue";
import AccountNav from '~/components/account/AccountNav.vue'

definePageMeta({ middleware: 'auth' })

const { t } = useLocale()
const { formatYerevanDateTime } = useDateTime()
const { localePath } = useLocalizedPath()
const { isTor } = useBrandContext()
const route = useRoute()
useLocalizedSeo(() => route.path)

useSeoMeta({
  title: () => t('nav.myAppointments'),
  description: () => t('account.appointmentsSeoDescription'),
  robots: 'noindex, nofollow',
})

const auth = useAuthStore()
const appointmentsStore = useAppointmentsStore()
const { appointments, loading } = storeToRefs(appointmentsStore)

await useAsyncData('my-appointments', async () => {
  await appointmentsStore.fetchMine()

  return true
})
</script>

<template>
  <section class="section-gap" :class="isTor ? 'text-stone-100' : ''">
    <div class="container-shell space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-5xl">{{ t('nav.myAppointments') }}</h1>
          <p class="mt-2 text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ auth.user?.name }} · {{ auth.user?.email }}</p>
        </div>
        <AccountNav :show-master-profile="Boolean(auth.user?.roles?.includes('master'))" />
      </div>

      <div v-if="loading" class="grid gap-4">
        <SkeletonBlock v-for="idx in 3" :key="idx" :theme="isTor ? 'dark' : 'light'" class="h-32" />
      </div>

      <div v-else-if="!appointments.length" class="rounded-3xl p-6 text-sm" :class="isTor ? 'border border-dashed border-white/10 bg-white/[0.03] text-stone-300' : 'border border-dashed border-sand-300 bg-white text-sand-700'">
        {{ t('nav.myAppointments') }}: 0
      </div>

      <div v-else class="grid gap-4">
        <Card v-for="item in appointments" :key="item.id" class="fade-in" :class="isTor ? '!border-white/10 !bg-white/[0.03] !text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.18)]' : ''">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="space-y-2 text-sm">
              <p class="text-lg font-semibold">#{{ item.id }} · {{ item.service?.name }}</p>
              <p :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ item.master?.name }}</p>
              <p :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ formatYerevanDateTime(item.start_at) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <BadgeStatus :status="item.status" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
