<script setup lang="ts">
const { locale } = useLocale()
const { localePath } = useLocalizedPath()
const route = useRoute()
const {
  siteUrl,
  salonName,
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
  defaultImageUrl,
} = useSiteMeta()
const { canonicalUrl } = useLocalizedSeo(() => route.path)

const copy = computed(() => {
  if (locale.value === 'ru') {
    return {
      eyebrow: 'Локальная страница',
      title: 'Салон красоты в Ереване',
      lead: 'Freya Beauty Salon на Азатутян 21: онлайн-запись, услуги для волос, ногтей, косметология, массаж, подарочные карты и профессиональная команда в Ереване.',
      primary: 'Записаться онлайн',
      secondary: 'Смотреть услуги',
      locationTitle: 'Freya Beauty Salon в Ереване',
      locationText: 'Салон находится на Азатутян 21. Страница создана для клиентов, которые ищут салон красоты в Ереване с понятными услугами, ценами и быстрым бронированием.',
      addressLabel: 'Адрес',
      phoneLabel: 'Телефон',
      servicesTitle: 'Популярные направления',
      faqTitle: 'FAQ: салон красоты в Ереване',
      packagesTitle: 'Что можно выбрать',
      packagesLead: 'Начните с услуги или подарочной карты, а администратор поможет подобрать мастера и удобное время.',
      routeTitle: 'Как добраться',
      routeText: 'Freya находится на Азатутян 21 в Ереване. Откройте маршрут в удобной карте или напишите администратору перед визитом.',
      contactTitle: 'Связь и запись',
      linksTitle: 'Полезные разделы',
      maps: ['Google Maps', 'Яндекс Карты', '2GIS'],
      contacts: ['Позвонить', 'WhatsApp', 'Telegram', 'Instagram'],
      links: [
        ['Все услуги', '/services'],
        ['Онлайн-запись', '/booking'],
        ['Контакты и карта', '/contacts'],
        ['Подарочные карты', '/gift-cards/buy'],
      ],
      packages: [
        ['Волосы', 'Стрижки, уходы, укладки и окрашивание по консультации мастера.'],
        ['Ногти', 'Маникюр, педикюр, покрытие и аккуратный сервис в центре Еревана.'],
        ['Косметология и уход', 'Процедуры ухода, массаж и beauty-сервисы Freya.'],
      ],
      faqs: [
        ['Где находится Freya Beauty Salon?', 'Freya Beauty Salon находится в Ереване, Азатутян 21.'],
        ['Можно ли записаться онлайн?', 'Да, можно выбрать услугу, мастера и удобное время на странице онлайн-записи.'],
        ['Есть ли подарочные карты?', 'Да, на сайте можно купить подарочную карту Freya Beauty Salon.'],
        ['Какие услуги доступны в салоне?', 'В Freya доступны услуги для волос, ногтей, ухода, косметологии, массажа и beauty-процедур.'],
        ['Есть ли карта и маршрут?', 'Да, на странице есть ссылки на Google Maps, Яндекс Карты и 2GIS.'],
        ['Для кого эта страница?', 'Для клиентов, которые ищут салон красоты в Ереване и хотят быстро найти услуги, адрес, контакты и запись.'],
      ],
    }
  }

  if (locale.value === 'en') {
    return {
      eyebrow: 'Local page',
      title: 'Beauty Salon in Yerevan',
      lead: 'Freya Beauty Salon at 21 Azatutyan: online booking, hair, nails, cosmetology, massage, gift cards, and a professional team in Yerevan.',
      primary: 'Book online',
      secondary: 'View services',
      locationTitle: 'Freya Beauty Salon in Yerevan',
      locationText: 'The salon is located at 21 Azatutyan. This page is for clients searching for a beauty salon in Yerevan with clear services, prices, and online booking.',
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      servicesTitle: 'Popular directions',
      faqTitle: 'FAQ: beauty salon in Yerevan',
      packagesTitle: 'What you can book',
      packagesLead: 'Start with a service or a gift card, and the administrator will help choose a master and time.',
      routeTitle: 'How to get there',
      routeText: 'Freya is located at 21 Azatutyan in Yerevan. Open the route in your preferred map or message the administrator before visiting.',
      contactTitle: 'Contact and booking',
      linksTitle: 'Useful sections',
      maps: ['Google Maps', 'Yandex Maps', '2GIS'],
      contacts: ['Call', 'WhatsApp', 'Telegram', 'Instagram'],
      links: [
        ['All services', '/services'],
        ['Online booking', '/booking'],
        ['Contacts and map', '/contacts'],
        ['Gift cards', '/gift-cards/buy'],
      ],
      packages: [
        ['Hair', 'Haircuts, care, styling, and color services after master consultation.'],
        ['Nails', 'Manicure, pedicure, gel polish, and careful service in Yerevan.'],
        ['Beauty care', 'Cosmetology, massage, and Freya beauty services.'],
      ],
      faqs: [
        ['Where is Freya Beauty Salon located?', 'Freya Beauty Salon is located at 21 Azatutyan, Yerevan.'],
        ['Can I book online?', 'Yes, you can choose a service, master, and convenient time on the booking page.'],
        ['Do you offer gift cards?', 'Yes, Freya Beauty Salon gift cards are available on the website.'],
        ['What services are available?', 'Freya offers hair, nails, care, cosmetology, massage, and beauty procedures.'],
        ['Are map routes available?', 'Yes, this page links to Google Maps, Yandex Maps, and 2GIS.'],
        ['Who is this page for?', 'It is for clients searching for a beauty salon in Yerevan who need services, address, contacts, and booking in one place.'],
      ],
    }
  }

  return {
    eyebrow: 'Տեղային էջ',
    title: 'Գեղեցկության սրահ Երևանում',
    lead: 'Freya Beauty Salon՝ Ազատության 21 հասցեում. օնլայն ամրագրում, մազերի, եղունգների, կոսմետոլոգիայի, մերսման ծառայություններ, նվեր քարտեր և պրոֆեսիոնալ թիմ Երևանում։',
    primary: 'Ամրագրել օնլայն',
    secondary: 'Դիտել ծառայությունները',
    locationTitle: 'Freya Beauty Salon Երևանում',
    locationText: 'Սրահը գտնվում է Ազատության 21 հասցեում։ Էջը նախատեսված է այն հաճախորդների համար, ովքեր փնտրում են գեղեցկության սրահ Երևանում՝ հստակ ծառայություններով, գներով և արագ ամրագրմամբ։',
    addressLabel: 'Հասցե',
    phoneLabel: 'Հեռախոս',
    servicesTitle: 'Հիմնական ուղղություններ',
    faqTitle: 'FAQ. գեղեցկության սրահ Երևանում',
    packagesTitle: 'Ինչ կարող եք ընտրել',
    packagesLead: 'Սկսեք ծառայությունից կամ նվեր քարտից, իսկ ադմինիստրատորը կօգնի ընտրել մասնագետին և հարմար ժամը։',
    routeTitle: 'Ինչպես հասնել',
    routeText: 'Freya-ն գտնվում է Երևանում՝ Ազատության 21 հասցեում։ Բացեք երթուղին հարմար քարտեզում կամ գրեք ադմինիստրատորին այցից առաջ։',
    contactTitle: 'Կապ և ամրագրում',
    linksTitle: 'Օգտակար բաժիններ',
    maps: ['Google Maps', 'Yandex Maps', '2GIS'],
    contacts: ['Զանգահարել', 'WhatsApp', 'Telegram', 'Instagram'],
    links: [
      ['Բոլոր ծառայությունները', '/services'],
      ['Օնլայն ամրագրում', '/booking'],
      ['Կոնտակտներ և քարտեզ', '/contacts'],
      ['Նվեր քարտեր', '/gift-cards/buy'],
    ],
    packages: [
      ['Մազեր', 'Սանրվածքներ, խնամք, հարդարում և ներկում՝ մասնագետի խորհրդատվությամբ։'],
      ['Եղունգներ', 'Մատնահարդարում, պեդիկյուր, ծածկույթ և ուշադիր սպասարկում Երևանում։'],
      ['Խնամք', 'Կոսմետոլոգիա, մերսում և Freya-ի beauty ծառայություններ։'],
    ],
    faqs: [
      ['Որտե՞ղ է գտնվում Freya Beauty Salon-ը։', 'Freya Beauty Salon-ը գտնվում է Երևանում՝ Ազատության 21 հասցեում։'],
      ['Կարելի՞ է ամրագրել օնլայն։', 'Այո, կարող եք ընտրել ծառայություն, մասնագետ և հարմար ժամ ամրագրման էջում։'],
      ['Կա՞ն նվեր քարտեր։', 'Այո, կայքում կարելի է գնել Freya Beauty Salon նվեր քարտ։'],
      ['Ի՞նչ ծառայություններ կան սրահում։', 'Freya-ում հասանելի են մազերի, եղունգների, խնամքի, կոսմետոլոգիայի, մերսման և beauty ծառայություններ։'],
      ['Կա՞ քարտեզ և երթուղի։', 'Այո, էջում կան Google Maps-ի, Yandex Maps-ի և 2GIS-ի հղումներ։'],
      ['Ու՞մ համար է այս էջը։', 'Այն հաճախորդների համար է, ովքեր փնտրում են գեղեցկության սրահ Երևանում և ուզում են արագ գտնել ծառայությունները, հասցեն, կապը և ամրագրումը։'],
    ],
  }
})

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
  image: () => defaultImageUrl.value,
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BeautySalon',
      '@id': `${siteUrl.value}#salon`,
      name: salonName,
      url: canonicalUrl.value,
      image: defaultImageUrl.value,
      logo: defaultImageUrl.value,
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
        itemListElement: copy.value.packages.map((item, index) => ({
          '@type': 'Offer',
          position: index + 1,
          itemOffered: {
            '@type': 'Service',
            name: item[0],
            description: item[1],
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
        '@id': `${siteUrl.value}#salon`,
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
              '@id': `${siteUrl.value}#salon`,
            },
          },
          url: `${siteUrl.value}${localePath('/services')}`,
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
  <section class="section-gap">
    <div class="container-shell space-y-12">
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div class="max-w-3xl space-y-5">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-sand-700">{{ copy.eyebrow }}</p>
          <h1 class="text-4xl font-bold leading-tight text-sand-950 sm:text-5xl">{{ copy.title }}</h1>
          <p class="text-lg leading-8 text-sand-800">{{ copy.lead }}</p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink :to="localePath('/booking')" class="inline-flex min-h-12 items-center justify-center rounded-full bg-sand-900 px-6 text-sm font-semibold text-white transition hover:bg-sand-700">
              {{ copy.primary }}
            </NuxtLink>
            <NuxtLink :to="localePath('/services')" class="inline-flex min-h-12 items-center justify-center rounded-full border border-sand-300 px-6 text-sm font-semibold text-sand-900 transition hover:bg-sand-50">
              {{ copy.secondary }}
            </NuxtLink>
          </div>
        </div>
        <div class="rounded-[1.5rem] border border-sand-200 bg-white p-6 shadow-sm">
          <h2 class="text-2xl font-semibold text-sand-950">{{ copy.locationTitle }}</h2>
          <p class="mt-4 leading-7 text-sand-700">{{ copy.locationText }}</p>
          <dl class="mt-6 grid gap-4 text-sm text-sand-800">
            <div>
              <dt class="font-semibold text-sand-950">{{ copy.addressLabel }}</dt>
              <dd>21 Azatutyan, Yerevan</dd>
            </div>
            <div>
              <dt class="font-semibold text-sand-950">{{ copy.phoneLabel }}</dt>
              <dd>{{ telephone }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="space-y-5">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-sand-700">{{ copy.servicesTitle }}</p>
          <h2 class="mt-2 text-3xl font-semibold text-sand-950">{{ copy.packagesTitle }}</h2>
          <p class="mt-3 max-w-2xl leading-7 text-sand-700">{{ copy.packagesLead }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="item in copy.packages" :key="item[0]" class="rounded-[1.25rem] border border-sand-200 bg-white p-5 shadow-sm">
            <h3 class="text-lg font-semibold text-sand-950">{{ item[0] }}</h3>
            <p class="mt-3 leading-7 text-sand-700">{{ item[1] }}</p>
          </article>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <section class="rounded-[1.25rem] border border-sand-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 class="text-2xl font-semibold text-sand-950">{{ copy.routeTitle }}</h2>
          <p class="mt-3 leading-7 text-sand-700">{{ copy.routeText }}</p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a v-for="item in mapLinks" :key="item.label" :href="item.href" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center justify-center rounded-full border border-sand-300 px-5 text-sm font-semibold text-sand-900 transition hover:bg-sand-50">
              {{ item.label }}
            </a>
          </div>
        </section>
        <section class="rounded-[1.25rem] border border-sand-200 bg-white p-5 shadow-sm">
          <h2 class="text-2xl font-semibold text-sand-950">{{ copy.contactTitle }}</h2>
          <div class="mt-5 grid gap-3">
            <a v-for="item in contactLinks" :key="item.label" :href="item.href" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-sand-800 transition hover:text-sand-600">
              {{ item.label }}
            </a>
          </div>
        </section>
      </div>

      <section class="space-y-4">
        <h2 class="text-3xl font-semibold text-sand-950">{{ copy.linksTitle }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink v-for="item in copy.links" :key="item[1]" :to="localePath(item[1])" class="rounded-[1.25rem] border border-sand-200 bg-white px-5 py-4 text-sm font-semibold text-sand-900 shadow-sm transition hover:bg-sand-50">
            {{ item[0] }}
          </NuxtLink>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-3xl font-semibold text-sand-950">{{ copy.faqTitle }}</h2>
        <div class="grid gap-3">
          <details v-for="item in copy.faqs" :key="item[0]" class="rounded-[1.25rem] border border-sand-200 bg-white px-5 py-4">
            <summary class="cursor-pointer font-semibold text-sand-950">{{ item[0] }}</summary>
            <p class="mt-3 leading-7 text-sand-700">{{ item[1] }}</p>
          </details>
        </div>
      </section>
    </div>
  </section>
</template>
