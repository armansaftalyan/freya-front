<script setup lang="ts">
import type { Product } from '~/types/product'
import ProductsCatalogPageContent from '~/components/pages/ProductsCatalogPageContent.vue'

const { t, locale } = useLocale()
const { brand, isTor, productsPath } = useBrandContext()
const { localePath } = useLocalizedPath()
const { categoryById, groupedProducts, structuredData } = await useProductsCatalogPage({
  brand: brand.value,
})

const copy = computed(() => {
  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        title: 'Товары Tor Barbershop в Ереване',
        eyebrow: 'Товары',
        lead: 'Подборка мужских товаров для бороды, волос, кожи, ежедневного ухода и grooming-процедур.',
        back: 'Назад в Tor',
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Tor Grooming Products in Yerevan',
        eyebrow: 'Products',
        lead: 'Selected beard, hair, skin, and grooming products for the Tor side of the brand.',
        back: 'Back to Tor',
      }
    }

    return {
      title: 'Tor Barbershop ապրանքներ Երևանում',
      eyebrow: 'Ապրանքներ',
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

const catalogSeo = computed(() => {
  const categoryNames = groupedProducts.value.map(category => category.name).filter(Boolean)
  const categorySlice = categoryNames.slice(0, 4)

  if (brand.value === 'tor') {
    if (locale.value === 'ru') {
      return {
        title: 'Каталог товаров Tor Barbershop',
        intro: [
          'Каталог Tor должен усиливать поиски по мужскому уходу, где пользователь уже выбирает конкретную категорию, бренд и товар.',
          `Сейчас каталог собран вокруг категорий ${categorySlice.join(', ')} и должен отвечать на точечные коммерческие запросы по покупке и доставке в Ереване.`,
        ],
        intents: ['товары Tor', 'мужской уход купить', 'barber products yerevan', 'уход за бородой купить', 'мужской стайлинг купить', 'шампунь для мужчин Ереван'],
      }
    }

    if (locale.value === 'en') {
      return {
        title: 'Tor Grooming Product Catalog',
        intro: [
          'The Tor catalog should support men’s grooming searches where the user is already choosing a product category, brand, and purchase path.',
          `The current catalog is focused on ${categorySlice.join(', ')} and should answer commercial searches around buying and delivery in Yerevan.`,
        ],
        intents: ['Tor products', 'men grooming products', 'barber products Yerevan', 'beard care buy', 'hair styling products', 'men shampoo Yerevan'],
      }
    }

    return {
      title: 'Tor ապրանքների կատալոգ',
      intro: [
        'Tor-ի կատալոգը պետք է ուժեղացնի տղամարդկանց խնամքի այն որոնումները, որտեղ օգտատերը արդեն ընտրում է կոնկրետ կատեգորիա, բրենդ և գնման ուղի։',
        `Ներկայիս կատալոգը կենտրոնացած է ${categorySlice.join(', ')} կատեգորիաների վրա և պետք է պատասխանի Երևանում գնման և առաքման թիրախային հարցումներին։`,
      ],
      intents: ['Tor ապրանքներ', 'տղամարդկանց խնամք գնել', 'barber products yerevan', 'մորուքի խնամք գնել', 'ստայլինգի ապրանքներ', 'տղամարդկանց շամպուն Երևան'],
    }
  }

  if (locale.value === 'ru') {
    return {
      title: 'Каталог товаров Freya Beauty Salon',
      intro: [
        'Каталог Freya должен усиливать поиски по домашнему уходу, где пользователь уже ищет конкретный товар, категорию и покупку в Ереване.',
        `Сейчас каталог сфокусирован на категориях ${categorySlice.join(', ')} и должен ранжироваться по точечным retail-запросам без лишнего SEO-шума.`,
      ],
      intents: ['товары Freya', 'профессиональный уход купить', 'hair care products yerevan', 'шампунь купить Ереван', 'уход за волосами купить', 'home care products'],
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Freya Product Catalog',
      intro: [
        'The Freya catalog should support home care searches where the user is already looking for a specific product, category, and buying path in Yerevan.',
        `The current catalog is centered on ${categorySlice.join(', ')} and should rank for focused retail intent rather than broad beauty terms.`,
      ],
      intents: ['Freya products', 'professional home care', 'hair care products Yerevan', 'buy shampoo Yerevan', 'home care products', 'beauty retail Yerevan'],
    }
  }

  return {
    title: 'Freya ապրանքների կատալոգ',
    intro: [
      'Freya-ի կատալոգը պետք է ուժեղացնի տնային խնամքի այն որոնումները, որտեղ օգտատերը արդեն փնտրում է կոնկրետ ապրանք, կատեգորիա և գնման ուղի Երևանում։',
      `Ներկայիս կատալոգը կենտրոնացած է ${categorySlice.join(', ')} կատեգորիաների վրա և պետք է աշխատի թիրախային retail intent-ների համար՝ առանց ավելորդ լայն beauty keyword-ների։`,
    ],
    intents: ['Freya ապրանքներ', 'պրոֆեսիոնալ խնամք գնել', 'hair care products yerevan', 'շամպուն գնել Երևան', 'տնային խնամքի ապրանքներ', 'beauty retail yerevan'],
  }
})

usePageSeo({
  title: () => brand.value === 'tor' ? copy.value.title : `Freya - ${t('nav.products')}`,
  description: () => copy.value.lead,
})

const productPath = (product: Product) => localePath(`${productsPath.value}/${categoryById.value.get(product.category_id)?.slug || (brand.value === 'tor' ? 'beard-care' : 'catalog')}/${product.slug}`) as string

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
    :seo-title="catalogSeo.title"
    :seo-intro="catalogSeo.intro"
    :seo-intents="catalogSeo.intents"
    :grouped-products="groupedProducts"
    :products-path="productsPath"
    :product-path="productPath"
  />
</template>
