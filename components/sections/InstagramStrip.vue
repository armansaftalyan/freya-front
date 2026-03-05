<template>
  <section class="section-gap">
    <div class="container-shell space-y-6">
      <div class="flex items-end justify-between">
        <h2 class="text-3xl sm:text-4xl">Instagram</h2>
        <a href="#" class="text-sm text-sand-700 underline-offset-4 hover:underline">@aurum.beauty</a>
      </div>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div
          v-for="idx in 4"
          :key="idx"
          class="aspect-square rounded-3xl border border-dashed border-sand-300 bg-white/70"
        />
      </div>
    </div>
  </section>
</template>
