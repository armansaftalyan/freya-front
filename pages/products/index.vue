<script setup lang="ts">
import type { Product } from '~/types/product'
import ProductsCatalogPageContent from '~/components/pages/ProductsCatalogPageContent.vue'

const { t, locale } = useLocale()
const { brand, isTor, productsPath } = useBrandContext()
const { categoryById, groupedProducts, structuredData } = await useProductsCatalogPage({
  brand: brand.value,
})

const copy = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        title: 'Tor Care',
        eyebrow: 'Tor Care',
        lead: 'Подборка мужских товаров для бороды, волос, кожи, ежедневного ухода и grooming-процедур.',
        back: 'Назад в Tor',
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Tor Care',
        eyebrow: 'Tor Care',
        lead: 'Selected beard, hair, skin, and grooming products for the Tor side of the brand.',
        back: 'Back to Tor',
      }
    }

    return {
      title: 'Tor Care',
      eyebrow: 'Tor Care',
      lead: 'Tor բրենդային ուղղության համար ընտրված մորուքի, մազերի, մաշկի և grooming խնամքի ապրանքներ։',
      back: 'Վերադառնալ Tor',
    }
  }

  return {
    title: t('nav.products'),
    eyebrow: t('productsPage.catalog'),
    lead: t('productsPage.seoDescription'),
    back: '',
  }
})

usePageSeo({
  title: () => brand.value === 'tor' ? copy.value.title : `Freya - ${t('nav.products')}`,
  description: () => copy.value.lead,
})

const productPath = (product: Product) => `${productsPath.value}/${categoryById.value.get(product.category_id)?.slug || (brand.value === 'tor' ? 'beard-care' : 'catalog')}/${product.slug}`

useStructuredData(() => brand.value === 'tor'
  ? {
      ...structuredData.value,
      '@graph': [
        {
          ...structuredData.value['@graph'][0],
          name: copy.value.title,
          description: copy.value.lead,
        },
        ...structuredData.value['@graph'].slice(1),
      ],
    }
  : structuredData.value)
</script>

<template>
  <ProductsCatalogPageContent
    :theme="isTor ? 'tor' : 'default'"
    :title="copy.title"
    :eyebrow="copy.eyebrow"
    :lead="copy.lead"
    :back-label="isTor ? copy.back : ''"
    :back-to="isTor ? '/tor' : ''"
    :grouped-products="groupedProducts"
    :products-path="productsPath"
    :product-path="productPath"
  />
</template>
