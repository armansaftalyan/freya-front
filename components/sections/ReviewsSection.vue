<template>
  <section class="section-gap">
    <div class="container-shell">
      <div class="mb-8 flex items-end justify-between gap-3">
        <h2 class="text-4xl">Отзывы</h2>
        <NuxtLink to="/booking"><BaseButton variant="ghost">Записаться</BaseButton></NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <Card v-for="review in reviews" :key="review.name" class="fade-in">
          <p class="text-sm text-[var(--muted)]">“{{ review.text }}”</p>
          <p class="mt-4 text-sm font-semibold text-sand-800">{{ review.name }}</p>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const reviews = [
  { name: 'Sofia M.', text: 'Очень чисто, стильно и идеально по времени. Вернусь снова.' },
  { name: 'Anna R.', text: 'Мастер услышал запрос и сделал даже лучше, чем на референсе.' },
  { name: 'Kate W.', text: 'Удобная онлайн-запись и тёплый сервис с первого шага.' },
]
</script>
