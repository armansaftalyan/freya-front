<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="text-4xl">Как записаться</h2>
        <NuxtLink to="/booking"><BaseButton>Book now</BaseButton></NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <Card v-for="(step, idx) in steps" :key="step.title" class="fade-in">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sand-600">Step {{ idx + 1 }}</p>
          <h3 class="mt-3 text-2xl">{{ step.title }}</h3>
          <p class="mt-3 text-sm text-[var(--muted)]">{{ step.text }}</p>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  { title: 'Выберите филиал', text: 'Найдите удобный адрес и график рядом с вами.' },
  { title: 'Услуга и мастер', text: 'Подберите услугу и специалиста по вашему запросу.' },
  { title: 'Подтвердите время', text: 'Выберите свободный слот и получите номер записи.' },
]
</script>
