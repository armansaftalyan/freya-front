<script setup lang="ts">
const route = useRoute()
useLocalizedSeo(() => route.path)

useSeoMeta({
  robots: 'noindex, nofollow',
})

const { localePath } = useLocalizedPath()

await navigateTo(localePath({ path: '/booking', query: { source: 'yandex_maps', embed: '1' } }), { replace: true })
</script>
