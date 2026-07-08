<script setup lang="ts">
import type { ApiListResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Master } from '~/types/master'
import type { Service } from '~/types/service'
import type { SupportedLocale } from '~/composables/useLocalizedPath'

definePageMeta({
  layout: 'tor',
})

const api = useApi()
const { locale, t } = useLocale()
const { localePath } = useLocalizedPath()
const route = useRoute()
const {
  siteUrl,
  torSalonName,
  telephone,
  telephoneHref,
  whatsappUrl,
  telegramUrl,
  instagramUrl,
  twoGisUrl,
  yandexMapsUrl,
  email,
  address,
  geoCoordinates,
  googleMapsUrl,
  openingHoursSpecification,
  sameAs,
  contactPoint,
} = useSiteMeta()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const torImageUrl = computed(() => `${siteUrl.value}/tor-logo.jpg`)
const { formatAmd } = useCurrency()
const { masterAvatarSrc, onMasterAvatarError } = useMasterAvatar()
const localizedPath = (target: string) => localePath(target) as string

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      eyebrow: 'Локальная страница',
      title: 'Barbershop в Ереване',
      lead: 'Tor Barbershop на Азатутян 21: мужские стрижки, fade, борода, grooming, мужской маникюр, педикюр и товары для ухода в Ереване.',
      primary: 'Записаться в Tor',
      secondary: 'Услуги Tor',
      locationTitle: 'Tor Barbershop в Ереване',
      locationText: 'Tor работает в Ереване на Азатутян 21 и закрывает мужской уход: стрижка, beard work, grooming, уходовые продукты и понятная онлайн-запись.',
      addressLabel: 'Адрес',
      phoneLabel: 'Телефон',
      servicesTitle: 'Что доступно',
      packagesTitle: 'Мужские услуги в Ереване',
      packagesLead: 'Выберите услугу, мастера и слот онлайн. Страница собирает локальные запросы по barbershop Yerevan и мужскому уходу.',
      realServicesTitle: 'Популярные услуги Tor',
      realServicesLead: 'Реальные услуги из каталога Tor с ценой, длительностью и быстрым переходом к записи.',
      mastersTitle: 'Барберы Tor',
      mastersLead: 'Мастера Tor, к которым можно перейти в профиль или сразу выбрать время визита.',
      bookService: 'Записаться',
      viewProfile: 'Профиль',
      bookMaster: 'Записаться',
      routeTitle: 'Как добраться',
      routeText: 'Tor находится на Азатутян 21 в Ереване. Откройте маршрут в карте или напишите администратору, если нужно уточнить вход и время визита.',
      contactTitle: 'Связь и запись',
      linksTitle: 'Полезные разделы',
      maps: ['Google Maps', 'Яндекс Карты', '2GIS'],
      contacts: ['Позвонить', 'WhatsApp', 'Telegram', 'Instagram'],
      links: [
        ['Услуги Tor', '/tor/services'],
        ['Запись в Tor', '/tor/booking'],
        ['Контакты и карта', '/tor/contacts'],
        ['Подарочные карты', '/tor/gift-cards/buy'],
      ],
      packages: [
        ['Haircut & fade', 'Мужская стрижка, fade, crop, текстура и аккуратная форма.'],
        ['Beard work', 'Моделирование бороды, окантовка, линия и чистый контур.'],
        ['Men grooming', 'Мужской маникюр, педикюр, уход и товары для дома.'],
      ],
      faqTitle: 'FAQ: barbershop в Ереване',
      faqs: [
        ['Где находится Tor Barbershop?', 'Tor Barbershop находится в Ереване, Азатутян 21.'],
        ['Можно ли записаться онлайн?', 'Да, можно выбрать услугу Tor, мастера и удобное время онлайн.'],
        ['Есть ли услуги для бороды?', 'Да, Tor предлагает beard trim, окантовку и grooming-услуги.'],
        ['Какие мужские услуги доступны?', 'В Tor доступны мужские стрижки, fade, борода, grooming, мужской маникюр, педикюр и товары для ухода.'],
        ['Есть ли карта и маршрут?', 'Да, на странице есть ссылки на Google Maps, Яндекс Карты и 2GIS.'],
        ['Для кого эта страница?', 'Для клиентов, которые ищут barbershop в Ереване и хотят быстро найти услуги, адрес, контакты и онлайн-запись.'],
      ],
    }
  }

  if (locale.value === 'en') {
    return {
      eyebrow: 'Local page',
      title: 'Barbershop in Yerevan',
      lead: 'Tor Barbershop at 21 Azatutyan: men haircuts, fade, beard work, grooming, men manicure, pedicure, and care products in Yerevan.',
      primary: 'Book Tor',
      secondary: 'Tor services',
      locationTitle: 'Tor Barbershop in Yerevan',
      locationText: 'Tor is located at 21 Azatutyan in Yerevan and focuses on men haircuts, beard work, grooming, care products, and online booking.',
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      servicesTitle: 'What is available',
      packagesTitle: 'Men services in Yerevan',
      packagesLead: 'Choose a service, master, and slot online. This page targets local barbershop Yerevan and men grooming searches.',
      realServicesTitle: 'Popular Tor services',
      realServicesLead: 'Real Tor catalog services with price, duration, and a quick path to booking.',
      mastersTitle: 'Tor barbers',
      mastersLead: 'Tor masters with profile links and direct booking.',
      bookService: 'Book',
      viewProfile: 'Profile',
      bookMaster: 'Book',
      routeTitle: 'How to get there',
      routeText: 'Tor is located at 21 Azatutyan in Yerevan. Open the route in your preferred map or message the administrator before your visit.',
      contactTitle: 'Contact and booking',
      linksTitle: 'Useful sections',
      maps: ['Google Maps', 'Yandex Maps', '2GIS'],
      contacts: ['Call', 'WhatsApp', 'Telegram', 'Instagram'],
      links: [
        ['Tor services', '/tor/services'],
        ['Tor booking', '/tor/booking'],
        ['Contacts and map', '/tor/contacts'],
        ['Gift cards', '/tor/gift-cards/buy'],
      ],
      packages: [
        ['Haircut & fade', 'Men haircut, fade, crop, texture, and clean shape.'],
        ['Beard work', 'Beard trim, line-up, contour, and balanced grooming.'],
        ['Men grooming', 'Men manicure, pedicure, care services, and home products.'],
      ],
      faqTitle: 'FAQ: barbershop in Yerevan',
      faqs: [
        ['Where is Tor Barbershop located?', 'Tor Barbershop is located at 21 Azatutyan, Yerevan.'],
        ['Can I book online?', 'Yes, you can choose a Tor service, master, and convenient time online.'],
        ['Do you offer beard services?', 'Yes, Tor offers beard trim, line-up, and grooming services.'],
        ['What men services are available?', 'Tor offers men haircuts, fade, beard work, grooming, men manicure, pedicure, and care products.'],
        ['Are map routes available?', 'Yes, this page links to Google Maps, Yandex Maps, and 2GIS.'],
        ['Who is this page for?', 'It is for clients searching for a barbershop in Yerevan who need services, address, contacts, and online booking in one place.'],
      ],
    }
  }

  return {
    eyebrow: 'Տեղային էջ',
    title: 'Barbershop Երևանում',
    lead: 'Tor Barbershop՝ Ազատության 21 հասցեում. տղամարդկանց սանրվածք, fade, մորուք, grooming, տղամարդկանց մատնահարդարում, պեդիկյուր և խնամքի ապրանքներ Երևանում։',
    primary: 'Ամրագրել Tor-ում',
    secondary: 'Tor ծառայություններ',
    locationTitle: 'Tor Barbershop Երևանում',
    locationText: 'Tor-ը գտնվում է Երևանում՝ Ազատության 21 հասցեում և կենտրոնացած է տղամարդկանց սանրվածքի, մորուքի, grooming-ի, խնամքի ապրանքների և օնլայն ամրագրման վրա։',
    addressLabel: 'Հասցե',
    phoneLabel: 'Հեռախոս',
    servicesTitle: 'Ինչ է հասանելի',
    packagesTitle: 'Տղամարդկանց ծառայություններ Երևանում',
    packagesLead: 'Ընտրեք ծառայություն, մասնագետ և ժամ օնլայն։ Էջը նախատեսված է barbershop Yerevan և տղամարդկանց խնամքի տեղային որոնումների համար։',
    realServicesTitle: 'Tor-ի պահանջված ծառայություններ',
    realServicesLead: 'Իրական Tor ծառայություններ կատալոգից՝ գներով, տևողությամբ և արագ ամրագրման հղումով։',
    mastersTitle: 'Tor-ի բարբերներ',
    mastersLead: 'Tor-ի մասնագետներ՝ պրոֆիլի հղումով և արագ ամրագրմամբ։',
    bookService: 'Ամրագրել',
    viewProfile: 'Պրոֆիլ',
    bookMaster: 'Ամրագրել',
    routeTitle: 'Ինչպես հասնել',
    routeText: 'Tor-ը գտնվում է Երևանում՝ Ազատության 21 հասցեում։ Բացեք երթուղին հարմար քարտեզում կամ գրեք ադմինիստրատորին այցից առաջ։',
    contactTitle: 'Կապ և ամրագրում',
    linksTitle: 'Օգտակար բաժիններ',
    maps: ['Google Maps', 'Yandex Maps', '2GIS'],
    contacts: ['Զանգահարել', 'WhatsApp', 'Telegram', 'Instagram'],
    links: [
      ['Tor ծառայություններ', '/tor/services'],
      ['Ամրագրում Tor-ում', '/tor/booking'],
      ['Կոնտակտներ և քարտեզ', '/tor/contacts'],
      ['Նվեր քարտեր', '/tor/gift-cards/buy'],
    ],
    packages: [
      ['Haircut & fade', 'Տղամարդկանց սանրվածք, fade, crop, տեքստուրա և մաքուր ձև։'],
      ['Մորուք', 'Մորուքի ձևավորում, եզրագծում, կոնտուր և հավասարակշռված grooming։'],
      ['Men grooming', 'Տղամարդկանց մատնահարդարում, պեդիկյուր, խնամք և տնային ապրանքներ։'],
    ],
    faqTitle: 'FAQ. barbershop Երևանում',
    faqs: [
      ['Որտե՞ղ է գտնվում Tor Barbershop-ը։', 'Tor Barbershop-ը գտնվում է Երևանում՝ Ազատության 21 հասցեում։'],
      ['Կարելի՞ է ամրագրել օնլայն։', 'Այո, կարող եք ընտրել Tor ծառայություն, մասնագետ և հարմար ժամ օնլայն։'],
      ['Կա՞ն մորուքի ծառայություններ։', 'Այո, Tor-ում հասանելի են beard trim, եզրագծում և grooming ծառայություններ։'],
      ['Ի՞նչ տղամարդկանց ծառայություններ կան։', 'Tor-ում հասանելի են տղամարդկանց սանրվածք, fade, մորուք, grooming, տղամարդկանց մատնահարդարում, պեդիկյուր և խնամքի ապրանքներ։'],
      ['Կա՞ քարտեզ և երթուղի։', 'Այո, էջում կան Google Maps-ի, Yandex Maps-ի և 2GIS-ի հղումներ։'],
      ['Ու՞մ համար է այս էջը։', 'Այն հաճախորդների համար է, ովքեր փնտրում են barbershop Երևանում և ուզում են արագ գտնել ծառայությունները, հասցեն, կապը և օնլայն ամրագրումը։'],
    ],
  }
})

const { data: catalogData } = await useAsyncData(() => `tor-yerevan-barbershop-catalog-${locale.value}`, async () => {
  const [categoriesResponse, servicesResponse, mastersResponse] = await Promise.all([
    api.get<ApiListResponse<Category>>('/categories', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Service>>('/services', { brand: 'tor' }, { skipErrorToast: true }),
    api.get<ApiListResponse<Master>>('/masters', { brand: 'tor' }, { skipErrorToast: true }),
  ])

  return {
    categories: categoriesResponse.data,
    services: servicesResponse.data,
    masters: mastersResponse.data,
  }
})

const categories = computed(() => catalogData.value?.categories || [])
const services = computed(() => catalogData.value?.services || [])
const masters = computed(() => catalogData.value?.masters || [])
const categoryById = computed(() => new Map(categories.value.map(category => [category.id, category])))
const featuredServices = computed(() => services.value.filter(service => service.is_active !== false).slice(0, 6))
const featuredMasters = computed(() => masters.value.filter(master => master.is_active !== false).slice(0, 3))
const servicePath = (service: Service) => localizedPath(`/tor/services/${localizedSlugFor(categoryById.value.get(service.category_id), locale.value as SupportedLocale) || 'men-hair'}/${localizedSlugFor(service, locale.value as SupportedLocale)}`)
const serviceBookingPath = (service: Service) => localePath({ path: '/tor/booking', query: { category_id: String(service.category_id), service_id: String(service.id) } })
const masterProfilePath = (master: Master) => localizedPath(`/tor/masters/${master.slug || master.id}`)
const masterBookingPath = (master: Master) => localePath({ path: '/tor/booking', query: { master_id: String(master.id) } })
const priceLabel = (service: Service) => {
  const priceFrom = Number(service.price_from || 0)
  const priceTo = Number(service.price_to || 0)

  if (priceTo > priceFrom) {
    return `${formatAmd(priceFrom)} - ${formatAmd(priceTo)}`
  }

  return `${t('servicesPage.priceFrom')} ${formatAmd(priceFrom)}`
}

const mapLinks = computed(() => [
  { label: copy.value.maps[0], href: googleMapsUrl.value },
  { label: copy.value.maps[1], href: yandexMapsUrl.value },
  { label: copy.value.maps[2], href: twoGisUrl.value },
])

const contactLinks = computed(() => [
  { label: copy.value.contacts[0], href: telephoneHref },
  { label: copy.value.contacts[1], href: whatsappUrl },
  { label: copy.value.contacts[2], href: telegramUrl },
  { label: copy.value.contacts[3], href: instagramUrl.value },
])

usePageSeo({
  title: () => copy.value.title,
  description: () => copy.value.lead,
  ogTitle: () => copy.value.title,
  ogDescription: () => copy.value.lead,
  image: () => torImageUrl.value,
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Barbershop',
      '@id': `${siteUrl.value}/tor#barbershop`,
      name: torSalonName,
      url: canonicalUrl.value,
      image: torImageUrl.value,
      logo: torImageUrl.value,
      telephone,
      email,
      priceRange: '$$',
      address,
      geo: geoCoordinates.value,
      hasMap: googleMapsUrl.value,
      openingHoursSpecification,
      sameAs: sameAs.value,
      contactPoint: contactPoint.value,
      areaServed: [
        {
          '@type': 'City',
          name: 'Yerevan',
        },
        {
          '@type': 'Country',
          name: 'Armenia',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: copy.value.packagesTitle,
        itemListElement: (featuredServices.value.length ? featuredServices.value : copy.value.packages).map((item: Service | string[], index) => ({
          '@type': 'Offer',
          position: index + 1,
          itemOffered: {
            '@type': 'Service',
            name: Array.isArray(item) ? item[0] : item.name,
            description: Array.isArray(item) ? item[1] : item.description,
          },
        })),
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl.value}#webpage`,
      url: canonicalUrl.value,
      name: copy.value.title,
      description: copy.value.lead,
      about: {
        '@id': `${siteUrl.value}/tor#barbershop`,
      },
    },
    {
      '@type': 'OfferCatalog',
      name: copy.value.packagesTitle,
      itemListElement: copy.value.packages.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: item[0],
            description: item[1],
            areaServed: {
              '@type': 'City',
              name: 'Yerevan',
            },
            provider: {
              '@id': `${siteUrl.value}/tor#barbershop`,
            },
          },
          url: `${siteUrl.value}${localePath('/tor/services')}`,
        },
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: copy.value.faqs.map(item => ({
        '@type': 'Question',
        name: item[0],
        acceptedAnswer: {
          '@type': 'Answer',
          text: item[1],
        },
      })),
    },
  ],
}))
</script>

<template>
  <section class="container-shell py-14 text-stone-100">
    <div class="space-y-12">
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div class="max-w-3xl space-y-5">
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#c58a3a]">{{ copy.eyebrow }}</p>
          <h1 class="text-4xl font-black uppercase leading-tight tracking-[0.04em] text-white sm:text-5xl">{{ copy.title }}</h1>
          <p class="text-lg leading-8 text-stone-300">{{ copy.lead }}</p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink :to="localePath('/tor/booking')" class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d79a49] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-[#c58a3a]">
              {{ copy.primary }}
            </NuxtLink>
            <NuxtLink :to="localePath('/tor/services')" class="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-[#c58a3a] hover:text-[#d79a49]">
              {{ copy.secondary }}
            </NuxtLink>
          </div>
        </div>
        <div class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.25)]">
          <h2 class="text-2xl font-bold uppercase tracking-[0.04em] text-white">{{ copy.locationTitle }}</h2>
          <p class="mt-4 leading-7 text-stone-300">{{ copy.locationText }}</p>
          <dl class="mt-6 grid gap-4 text-sm text-stone-300">
            <div>
              <dt class="font-semibold text-white">{{ copy.addressLabel }}</dt>
              <dd>21 Azatutyan, Yerevan</dd>
            </div>
            <div>
              <dt class="font-semibold text-white">{{ copy.phoneLabel }}</dt>
              <dd>{{ telephone }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="space-y-5">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#c58a3a]">{{ copy.servicesTitle }}</p>
          <h2 class="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-white">{{ copy.packagesTitle }}</h2>
          <p class="mt-3 max-w-2xl leading-7 text-stone-300">{{ copy.packagesLead }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="item in copy.packages" :key="item[0]" class="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
            <h3 class="text-lg font-bold uppercase tracking-[0.04em] text-white">{{ item[0] }}</h3>
            <p class="mt-3 leading-7 text-stone-300">{{ item[1] }}</p>
          </article>
        </div>
      </div>

      <section v-if="featuredServices.length" class="space-y-5">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#c58a3a]">{{ copy.servicesTitle }}</p>
          <h2 class="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-white">{{ copy.realServicesTitle }}</h2>
          <p class="mt-3 max-w-2xl leading-7 text-stone-300">{{ copy.realServicesLead }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="service in featuredServices" :key="service.id" class="flex h-full flex-col rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
            <NuxtLink :to="servicePath(service)" class="text-lg font-bold uppercase tracking-[0.04em] text-white transition hover:text-[#d79a49]">{{ service.name }}</NuxtLink>
            <p class="mt-3 line-clamp-2 min-h-[3.5rem] leading-7 text-stone-300">{{ service.description || t('servicesPage.defaultDescription') }}</p>
            <div class="mt-auto flex items-end justify-between gap-3 pt-5">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[#c58a3a]">{{ service.duration_minutes }} {{ t('servicesPage.minutes') }}</p>
                <p class="mt-1 font-semibold text-stone-100">{{ priceLabel(service) }}</p>
              </div>
              <NuxtLink :to="serviceBookingPath(service)" class="inline-flex min-h-10 items-center justify-center rounded-full bg-[#d79a49] px-4 text-sm font-semibold uppercase tracking-[0.1em] text-black transition hover:bg-[#c58a3a]">
                {{ copy.bookService }}
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>

      <section v-if="featuredMasters.length" class="space-y-5">
        <div>
          <h2 class="text-3xl font-black uppercase tracking-[0.04em] text-white">{{ copy.mastersTitle }}</h2>
          <p class="mt-3 max-w-2xl leading-7 text-stone-300">{{ copy.mastersLead }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="master in featuredMasters" :key="master.id" class="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
            <div class="flex items-center gap-4">
              <img :src="masterAvatarSrc(master.avatar, master.name)" :alt="master.name" class="h-16 w-16 rounded-2xl object-cover" width="64" height="64" loading="lazy" decoding="async" @error="onMasterAvatarError($event, master.name)">
              <div>
                <h3 class="text-lg font-bold uppercase tracking-[0.04em] text-white">{{ master.name }}</h3>
                <p class="line-clamp-2 text-sm leading-6 text-stone-300">{{ master.bio || t('homePage.masters.fallbackBio') }}</p>
              </div>
            </div>
            <div class="mt-5 flex flex-wrap gap-3">
              <NuxtLink :to="masterProfilePath(master)" class="inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-semibold uppercase tracking-[0.1em] text-stone-100 transition hover:border-[#c58a3a] hover:text-[#d79a49]">{{ copy.viewProfile }}</NuxtLink>
              <NuxtLink :to="masterBookingPath(master)" class="inline-flex min-h-10 items-center justify-center rounded-full bg-[#d79a49] px-4 text-sm font-semibold uppercase tracking-[0.1em] text-black transition hover:bg-[#c58a3a]">{{ copy.bookMaster }}</NuxtLink>
            </div>
          </article>
        </div>
      </section>

      <div class="grid gap-4 lg:grid-cols-3">
        <section class="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)] lg:col-span-2">
          <h2 class="text-2xl font-bold uppercase tracking-[0.04em] text-white">{{ copy.routeTitle }}</h2>
          <p class="mt-3 leading-7 text-stone-300">{{ copy.routeText }}</p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a v-for="item in mapLinks" :key="item.label" :href="item.href" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold uppercase tracking-[0.1em] text-stone-100 transition hover:border-[#c58a3a] hover:text-[#d79a49]">
              {{ item.label }}
            </a>
          </div>
        </section>
        <section class="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
          <h2 class="text-2xl font-bold uppercase tracking-[0.04em] text-white">{{ copy.contactTitle }}</h2>
          <div class="mt-5 grid gap-3">
            <a v-for="item in contactLinks" :key="item.label" :href="item.href" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold uppercase tracking-[0.1em] text-stone-200 transition hover:text-[#d79a49]">
              {{ item.label }}
            </a>
          </div>
        </section>
      </div>

      <section class="space-y-4">
        <h2 class="text-3xl font-black uppercase tracking-[0.04em] text-white">{{ copy.linksTitle }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink v-for="item in copy.links" :key="item[1]" :to="localePath(item[1])" class="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-stone-100 shadow-[0_18px_48px_rgba(0,0,0,0.2)] transition hover:border-[#c58a3a] hover:text-[#d79a49]">
            {{ item[0] }}
          </NuxtLink>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-3xl font-black uppercase tracking-[0.04em] text-white">{{ copy.faqTitle }}</h2>
        <div class="grid gap-3">
          <details v-for="item in copy.faqs" :key="item[0]" class="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-5 py-4">
            <summary class="cursor-pointer font-semibold text-white">{{ item[0] }}</summary>
            <p class="mt-3 leading-7 text-stone-300">{{ item[1] }}</p>
          </details>
        </div>
      </section>
    </div>
  </section>
</template>
