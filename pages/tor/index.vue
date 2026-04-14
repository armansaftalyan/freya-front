<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Product, ProductCategory } from '~/types/product'
import type { Service } from '~/types/service'
import ServiceCatalogCard from '~/components/catalog/ServiceCatalogCard.vue'
import FaqSection from '~/components/sections/FaqSection.vue'
import SeoIntentSection from '~/components/sections/SeoIntentSection.vue'

definePageMeta({
  layout: 'tor',
})

const api = useApi()
const route = useRoute()
const { locale, t } = useLocale()
const { localePath } = useLocalizedPath()
const { masterAvatarSrc, onMasterAvatarError } = useMasterAvatar()
const { siteUrl } = useSiteMeta()
const { bookingPath, productsPath, mastersPath, servicesPath } = useBrandContext()
const { formatPriceLabel } = useServicePricing()
const cart = useCartStore()
const localizedPath = (target: string) => localePath(target) as string
const { faqCopy } = usePageFaqContent('tor', 'home')

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Tor Barbershop',
      seoTitle: 'Tor Barbershop в Ереване | Мужские стрижки и барбершоп',
      ogDescription: 'Запишитесь онлайн в Tor: мужские стрижки, борода, grooming и быстрый выбор времени в Ереване.',
      twitterDescription: 'Запишитесь онлайн в Tor: мужские стрижки, борода, grooming и быстрый выбор времени в Ереване.',
      subtitle: 'Мужские стрижки, борода и уход без салонной сладости.',
      eyebrow: 'Точная мужская подача',
      primary: 'Записаться',
      allServices: 'Все услуги',
      services: 'Услуги',
      servicesLead: 'Стрижки, окантовка, борода и мужской уход. Чётко, быстро, без лишнего.',
      searchLead: 'Tor усиливает запросы по barbershop, мужским стрижкам, beard trim, мужскому маникюру, педикюру, мужской косметологии, эпиляции и grooming в Ереване.',
      teamLead: 'Барберы Tor, которые держат форму, темп и чистый результат.',
      products: 'Товары',
      productsLead: 'Масла, шампуни и grooming-продукты для волос, бороды и ежедневного ухода.',
      atmosphere: 'Атмосфера',
      atmosphereLead: 'Графит, металл, крепкий кофе и мастера, которые не делают лишнего.',
      statCuts: 'Стрижки',
      statCutsValue: 'Фейд, кроп и текстура.',
      statBeard: 'Борода',
      statBeardValue: 'Форма, линия и баланс.',
      statCare: 'Уход',
      statCareValue: 'Масло, очищение и финиш.',
      bookCard: 'Записаться',
      openCard: 'Открыть',
      blockOne: 'Чистый fade, фактура и баланс бороды.',
      blockTwo: 'Одна запись, понятный результат, без хаоса.',
      blockThree: 'Можно уйти со стрижкой, уходом и набором для дома.',
      cta: 'Открыть запись в Tor',
      seoDescription: 'Tor Barbershop в Ереване: мужские стрижки, борода, мужской маникюр, педикюр, grooming, эпиляция и уходовые продукты.',
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Tor Barbershop',
      seoTitle: 'Tor Barbershop in Yerevan | Men Haircuts and Grooming',
      ogDescription: 'Book Tor online for men haircuts, beard work, grooming, and fast slot selection in Yerevan.',
      twitterDescription: 'Book Tor online for men haircuts, beard work, grooming, and fast slot selection in Yerevan.',
      subtitle: 'Cuts, beard work and grooming with a harder edge.',
      eyebrow: 'Precision Grooming',
      primary: 'Book now',
      allServices: 'All services',
      services: 'Services',
      servicesLead: 'Cuts, line-ups, beard shaping and male grooming with no extra noise.',
      searchLead: 'Tor is built for barbershop, men haircut, beard trim, men manicure, pedicure, men cosmetology, epilation, and broader grooming searches in Yerevan.',
      teamLead: 'Tor barbers focused on shape, pace and clean results.',
      products: 'Products',
      productsLead: 'Oils, shampoos, and grooming products for hair, beard, and daily care.',
      atmosphere: 'Atmosphere',
      atmosphereLead: 'Graphite, steel, coffee and masters focused on precision.',
      statCuts: 'Cuts',
      statCutsValue: 'Fade. Crop. Texture.',
      statBeard: 'Beard',
      statBeardValue: 'Shape. Line. Balance.',
      statCare: 'Care',
      statCareValue: 'Oil. Wash. Finish.',
      bookCard: 'Book',
      openCard: 'Open',
      blockOne: 'Clean fades, texture and beard balance.',
      blockTwo: 'One booking, clear result, zero fluff.',
      blockThree: 'Leave with a cut, a beard reset and a care kit.',
      cta: 'Open Tor booking',
      seoDescription: 'Tor Barbershop in Yerevan: men haircut, beard shaping, men manicure, pedicure, grooming, epilation, and men’s care products.',
    }
  }

  return {
    title: 'Tor Barbershop',
    seoTitle: 'Tor Barbershop Երևանում | Տղամարդկանց սանրվածք և grooming',
    ogDescription: 'Ամրագրեք Tor-ում օնլայն՝ տղամարդկանց սանրվածք, մորուք, grooming և արագ ժամի ընտրություն Երևանում։',
    twitterDescription: 'Ամրագրեք Tor-ում օնլայն՝ տղամարդկանց սանրվածք, մորուք, grooming և արագ ժամի ընտրություն Երևանում։',
    subtitle: 'Տղամարդկանց սանրվածք, մորուք և խնամք ավելի կոշտ ոճով։',
    eyebrow: 'Ճշգրիտ խնամք',
    primary: 'Ամրագրել',
    allServices: 'Բոլոր ծառայությունները',
    services: 'Ծառայություններ',
    servicesLead: 'Սանրվածք, եզրագծում, մորուք և տղամարդկանց խնամք առանց ավելորդության։',
    searchLead: 'Tor-ը նախատեսված է barbershop, տղամարդկանց սանրվածք, beard trim, տղամարդկանց manicure, pedicure, տղամարդկանց cosmetology, epilation և grooming որոնումների համար Երևանում։',
    teamLead: 'Tor-ի բարբերները աշխատում են ձևի, տեմպի և մաքուր արդյունքի վրա։',
    products: 'Ապրանքներ',
    productsLead: 'Յուղեր, շամպուններ և grooming ապրանքներ մազերի, մորուքի և ամենօրյա խնամքի համար։',
    atmosphere: 'Մթնոլորտ',
    atmosphereLead: 'Գրաֆիտ, մետաղ, ուժեղ սուրճ և վարպետներ, որոնք աշխատում են հստակ։',
    statCuts: 'Սանրվածք',
    statCutsValue: 'Ֆեյդ, կրոփ և տեքստուրա։',
    statBeard: 'Մորուք',
    statBeardValue: 'Ձև, գիծ և հավասարակշռություն։',
    statCare: 'Խնամք',
    statCareValue: 'Յուղ, լվացում և ֆինիշ։',
    bookCard: 'Ամրագրել',
    openCard: 'Բացել',
    blockOne: 'Մաքուր fade, texture և հավասարակշռված beard work։',
    blockTwo: 'Մեկ ամրագրում, հստակ արդյունք, առանց քաոսի։',
    blockThree: 'Կարող ես դուրս գալ սանրվածքով, beard reset-ով ու տնային care kit-ով։',
    cta: 'Բացել Tor ամրագրումը',
    seoDescription: 'Tor Barbershop Երևանում՝ տղամարդկանց սանրվածք, մորուք, տղամարդկանց manicure, pedicure, grooming, epilation և խնամքի ապրանքներ։',
  }
})

const { data } = await useAsyncData(() => `tor-page-${locale.value}`, async () => {
  const [categoriesResponse, servicesResponse, productCategoriesResponse, productsResponse, mastersResponse] = await Promise.all([
    api.get<ApiListResponse<Category>>('/categories', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Service>>('/services', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<ProductCategory>>('/product-categories', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Product>>('/products', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Master>>('/masters', { brand: 'tor' }, { skipErrorToast: true }),
  ])

  return {
    categories: categoriesResponse.data,
    services: servicesResponse.data,
    productCategories: productCategoriesResponse.data,
    products: productsResponse.data,
    masters: mastersResponse.data,
  }
})

const categories = computed(() => data.value?.categories || [])
const services = computed(() => data.value?.services || [])
const productCategories = computed(() => data.value?.productCategories || [])
const products = computed(() => data.value?.products || [])
const masters = computed(() => data.value?.masters || [])

const serviceCategoryById = computed(() => new Map(categories.value.map(item => [item.id, item])))
const groupedServices = computed(() =>
  categories.value
    .map((category) => ({
      category,
      items: services.value
        .filter((service) => service.category_id === category.id)
        .slice(0, 3),
    }))
    .filter((entry) => entry.items.length),
)
const productCategoryById = computed(() => new Map(productCategories.value.map(item => [item.id, item])))
const torProducts = computed(() => {
  return products.value.slice(0, 4)
})
const torMasters = computed(() => masters.value.slice(0, 3))
const productPath = (product: Product) => localizedPath(`${productsPath.value}/${productCategoryById.value.get(product.category_id)?.slug || 'beard-care'}/${product.slug}`)
const servicePath = (service: Service) => localizedPath(`${servicesPath.value}/${serviceCategoryById.value.get(service.category_id)?.slug || 'men-hair'}/${service.slug}`)
const productQuantity = (productId: number) => cart.getItemQuantity(productId)
const addToCart = (product: Product) => cart.addItem(product, 1)
const decreaseFromCart = (productId: number) => cart.decreaseItem(productId, 1)

const bookingUrl = computed(() => {
  const firstCategory = categories.value[0]

  if (!firstCategory) {
    return localePath(bookingPath.value)
  }

  return localePath({
    path: bookingPath.value,
    query: {
      category_id: String(firstCategory.id),
    },
  })
})

const { canonicalUrl } = useLocalizedSeo(() => route.path)
const torOgImage = computed(() => `${siteUrl.value}/tor-logo.jpg`)

useSeoMeta({
  title: () => copy.value.seoTitle,
  description: () => copy.value.seoDescription,
  ogTitle: () => copy.value.seoTitle,
  ogDescription: () => copy.value.ogDescription,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => torOgImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => copy.value.seoTitle,
  twitterDescription: () => copy.value.twitterDescription,
  twitterImage: () => torOgImage.value,
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Barbershop',
      name: copy.value.title,
      description: copy.value.seoDescription,
      url: `${siteUrl.value}${route.path}`,
      parentOrganization: {
        '@id': `${siteUrl.value}#salon`,
      },
    },
    {
      '@type': 'CollectionPage',
      name: copy.value.title,
      url: `${siteUrl.value}${route.path}`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqCopy.value.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
}))
</script>

<template>
  <div class="pb-16 text-stone-100">
    <section class="border-b border-white/10">
      <div class="container-shell grid gap-10 py-14 lg:grid-cols-[1.15fr,0.85fr] lg:py-20">
        <div class="space-y-6 fade-in">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#c58a3a]">{{ copy.eyebrow }}</p>
          <h1 class="max-w-3xl text-5xl font-black uppercase leading-none tracking-[0.04em] sm:text-7xl">
            {{ copy.title }}
          </h1>
          <p class="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
            {{ copy.subtitle }}
          </p>
          <p class="max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
            {{ copy.searchLead }}
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink :to="bookingUrl">
              <BaseButton size="lg" theme="tor">{{ copy.primary }}</BaseButton>
            </NuxtLink>
            <NuxtLink :to="localePath('/tor/services')">
              <BaseButton size="lg" variant="secondary" theme="tor">{{ copy.services }}</BaseButton>
            </NuxtLink>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 fade-in">
          <div class="tor-stat-card">
            <p class="tor-stat-label">{{ copy.statCuts }}</p>
            <p class="tor-stat-value">{{ copy.statCutsValue }}</p>
          </div>
          <div class="tor-stat-card">
            <p class="tor-stat-label">{{ copy.statBeard }}</p>
            <p class="tor-stat-value">{{ copy.statBeardValue }}</p>
          </div>
          <div class="tor-stat-card">
            <p class="tor-stat-label">{{ copy.statCare }}</p>
            <p class="tor-stat-value">{{ copy.statCareValue }}</p>
          </div>
        </div>
      </div>
    </section>



    <section id="services" class="container-shell py-14">
      <div class="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#c58a3a]">{{ copy.services }}</p>
          <h2 class="mt-3 text-3xl font-black uppercase tracking-[0.06em] sm:text-5xl">{{ copy.services }}</h2>
          <p class="mt-4 text-stone-300">{{ copy.servicesLead }}</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/tor/services')">
            <BaseButton size="sm" variant="secondary" theme="tor">{{ copy.allServices }}</BaseButton>
          </NuxtLink>
        </div>
      </div>

      <div class="space-y-8">
        <div v-for="entry in groupedServices" :key="entry.category.id" class="space-y-4">
          <h3 class="text-[1.9rem] leading-tight text-stone-100 sm:text-[2.1rem]">{{ entry.category.name }}</h3>
          <div class="grid gap-4 md:grid-cols-3">
            <ServiceCatalogCard
              v-for="service in entry.items"
              :key="service.id"
              class="fade-in"
              theme="tor"
              :name="service.name"
              :description="service.description || ''"
              :duration-minutes="service.duration_minutes"
              :duration-label="t('servicesPage.minutes')"
              :price-label="formatPriceLabel(service)"
              :action-label="copy.bookCard"
              :action-to="localePath({ path: bookingPath, query: { category_id: String(service.category_id), service_id: String(service.id) } }) as string"
              :card-to="servicePath(service)"
            />
          </div>
        </div>
      </div>
    </section>

    <section id="masters" class="container-shell py-14">
      <div class="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#c58a3a]">{{ t('homePage.masters.title') }}</p>
          <h2 class="mt-3 text-3xl font-black uppercase tracking-[0.06em] sm:text-5xl">{{ t('homePage.masters.title') }}</h2>
          <p class="mt-4 text-stone-300">{{ copy.teamLead }}</p>
        </div>
        <NuxtLink :to="localePath(mastersPath)">
          <BaseButton size="sm" variant="secondary" theme="tor">{{ t('homePage.masters.all') }}</BaseButton>
        </NuxtLink>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="master in torMasters" :key="master.id" class="tor-panel fade-in flex h-full flex-col">
          <div class="flex flex-1 items-start gap-4">
            <img
              :src="masterAvatarSrc(master.avatar, master.name)"
              :alt="master.name"
              class="h-16 w-16 rounded-2xl object-cover"
              loading="lazy"
              @error="onMasterAvatarError($event, master.name)"
            >
            <div class="flex-1">
              <p class="text-lg font-bold uppercase tracking-[0.03em]">{{ master.name }}</p>
              <p class="mt-2 line-clamp-2 text-sm leading-6 text-stone-400">{{ master.bio || t('homePage.masters.fallbackBio') }}</p>
            </div>
          </div>
          <div class="mt-auto flex flex-wrap gap-3 pt-5">
            <NuxtLink :to="localePath(`${mastersPath}/${master.slug || master.id}`)">
              <BaseButton size="sm" variant="secondary" theme="tor">{{ t('mastersPage.viewProfile') }}</BaseButton>
            </NuxtLink>
            <NuxtLink :to="bookingUrl">
              <BaseButton size="sm" theme="tor">{{ copy.bookCard }}</BaseButton>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section id="products" class="border-y border-white/10 bg-white/[0.02]">
      <div class="container-shell py-14">
        <div class="mb-8 max-w-3xl">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#c58a3a]">{{ copy.products }}</p>
          <h2 class="mt-3 text-3xl font-black uppercase tracking-[0.06em] sm:text-5xl">{{ copy.products }}</h2>
          <p class="mt-4 text-stone-300">{{ copy.productsLead }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ProductCard
            v-for="product in torProducts"
            :key="product.id"
            class="tor-panel fade-in"
            theme="tor"
            :product="product"
            :to="productPath(product)"
            :quantity="productQuantity(product.id)"
            @add="addToCart"
            @decrease="decreaseFromCart"
          />
        </div>
      </div>
    </section>

    <section id="atmosphere" class="container-shell py-14">
      <div class="grid gap-4 lg:grid-cols-3">
        <article class="tor-copy-card fade-in">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#c58a3a]">{{ copy.atmosphere }}</p>
          <p class="mt-4 text-2xl font-bold uppercase leading-tight">{{ copy.blockOne }}</p>
          <p class="mt-4 text-sm leading-6 text-stone-400">{{ copy.atmosphereLead }}</p>
        </article>
        <article class="tor-copy-card fade-in">
          <p class="text-2xl font-bold uppercase leading-tight">{{ copy.blockTwo }}</p>
        </article>
        <article class="tor-copy-card fade-in">
          <p class="text-2xl font-bold uppercase leading-tight">{{ copy.blockThree }}</p>
          <div class="mt-6 flex flex-wrap gap-4">
            <NuxtLink :to="bookingUrl" class="inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#c58a3a]">
              {{ copy.cta }}
            </NuxtLink>
            <NuxtLink :to="localePath('/tor/products')" class="inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-stone-300">
              {{ copy.products }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

      <SeoIntentSection section="home" theme="tor" />
    <FaqSection
      theme="tor"
      :eyebrow="faqCopy.eyebrow"
      :title="faqCopy.title"
      :lead="faqCopy.lead"
      :items="faqCopy.items"
    />
  </div>
</template>

<style scoped>
.tor-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.02));
  border-radius: 1.5rem;
  padding: 1.25rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
}

.tor-stat-card,
.tor-copy-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1.25rem;
}

.tor-stat-label {
  color: #c58a3a;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.tor-stat-value {
  margin-top: 0.75rem;
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.15;
  text-transform: uppercase;
}
</style>
