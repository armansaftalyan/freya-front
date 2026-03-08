<template>
  <section class="section-gap">
    <div class="container-shell space-y-6">
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-3xl leading-tight sm:text-4xl">Instagram</h2>
        <a
          href="#"
          class="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-sand-900 ring-1 ring-sand-200 transition-colors hover:bg-white"
        >
          @freya.beauty
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
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
