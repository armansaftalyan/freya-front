<script setup lang="ts">
import { format } from 'date-fns'
import { storeToRefs } from 'pinia'

definePageMeta({ middleware: 'auth' })

const { t } = useLocale()

useSeoMeta({
  title: () => t('nav.myAppointments'),
  description: () => t('account.appointmentsSeoDescription'),
})

const auth = useAuthStore()
const appointmentsStore = useAppointmentsStore()
const { appointments, loading } = storeToRefs(appointmentsStore)

await useAsyncData('my-appointments', async () => {
  await appointmentsStore.fetchMine()
})
</script>

<template>
  <section class="section-gap">
    <div class="container-shell space-y-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-5xl">{{ t('nav.myAppointments') }}</h1>
          <p class="mt-2 text-sm text-[var(--muted)]">{{ auth.user?.name }} · {{ auth.user?.email }}</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/booking"><BaseButton>{{ t('nav.bookNow') }}</BaseButton></NuxtLink>
          <BaseButton variant="secondary" @click="auth.logout">{{ t('nav.logout') }}</BaseButton>
        </div>
      </div>

      <div v-if="loading" class="grid gap-4">
        <SkeletonBlock v-for="idx in 3" :key="idx" class="h-32" />
      </div>

      <div v-else-if="!appointments.length" class="rounded-3xl border border-dashed border-sand-300 bg-white p-6 text-sm text-sand-700">
        {{ t('nav.myAppointments') }}: 0
      </div>

      <div v-else class="grid gap-4">
        <Card v-for="item in appointments" :key="item.id" class="fade-in">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="space-y-2 text-sm">
              <p class="text-lg font-semibold">#{{ item.id }} · {{ item.service?.name }}</p>
              <p class="text-[var(--muted)]">{{ item.master?.name }} · {{ item.branch?.name }}</p>
              <p class="text-[var(--muted)]">{{ format(new Date(item.start_at), 'yyyy-MM-dd HH:mm') }}</p>
            </div>
            <div class="flex items-center gap-2">
              <BadgeStatus :status="item.status" />
              <BaseButton
                v-if="item.status !== 'cancelled'"
                size="sm"
                variant="secondary"
                @click="appointmentsStore.cancel(item.id)"
              >
                {{ t('account.cancel') }}
              </BaseButton>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
