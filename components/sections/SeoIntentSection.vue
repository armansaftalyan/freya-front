<script setup lang="ts">
type SeoSectionKey = 'home' | 'services' | 'products' | 'booking' | 'gift-cards'

type SeoIntentCopy = {
  title: string
  intro: string[]
  intents: string[]
}

const props = defineProps<{
  section: SeoSectionKey
  theme?: 'default' | 'tor'
  bordered?: boolean
}>()

const { locale } = useLocale()

const copy = computed<SeoIntentCopy>(() => {
  const isTor = props.theme === 'tor'

  if (isTor) {
    if (locale.value === 'ru') {
      const data: Record<SeoSectionKey, SeoIntentCopy> = {
        home: {
          title: 'Tor по мужским запросам',
          intro: [
            'Tor закрывает поиски, связанные с барбершопом, мужскими стрижками, fade, beard trim, оформлением бороды и мужским уходом в Ереване.',
            'Страницы Tor подходят для запросов про барбера, мужской салон, grooming, мужские продукты и онлайн-запись к барберу.',
          ],
          intents: ['барбершоп ереван', 'мужская стрижка', 'fade', 'beard trim', 'оформление бороды', 'мужской уход', 'barbershop yerevan', 'book barber online'],
        },
        services: {
          title: 'Tor услуги и мужской grooming',
          intro: [
            'Каталог Tor усиливает интенты вокруг мужских стрижек, бороды, окантовки, grooming и барбер-услуг.',
            'Это помогает ранжироваться по коммерческим поискам, где человек уже хочет выбрать услугу и записаться онлайн.',
          ],
          intents: ['мужская стрижка ереван', 'barber service', 'beard shaping', 'fade haircut', 'line up', 'men grooming', 'book barber', 'барбер онлайн запись'],
        },
        products: {
          title: 'Tor продукты для мужского ухода',
          intro: [
            'Страница товаров Tor закрывает запросы по продуктам для бороды, волос, стайлинга и ежедневного мужского ухода.',
            'Такие страницы полезны и для поиска, и для AI-ответов, потому что явно связывают бренд с конкретными товарами и задачами.',
          ],
          intents: ['beard oil', 'hair styling men', 'men grooming products', 'борода уход', 'товары для барбершопа', 'шампунь для мужчин', 'beard care yerevan', 'pomade'],
        },
        booking: {
          title: 'Tor онлайн-запись',
          intro: [
            'Онлайн-запись Tor должна находиться по запросам, где пользователь ищет свободное время к барберу, мужскую стрижку или оформление бороды.',
            'Чем яснее страница объясняет сценарий записи, тем лучше она подходит и под поисковые системы, и под AI-помощников.',
          ],
          intents: ['записаться к барберу', 'barber booking', 'online barber appointment', 'мужская стрижка онлайн запись', 'book fade haircut', 'book beard trim'],
        },
        'gift-cards': {
          title: 'Tor подарочные карты',
          intro: [
            'Подарочные карты Tor покрывают запросы для подарка мужчине, подарка в барбершоп и gift card на мужской grooming.',
            'Это отдельный коммерческий интент, который стоит усиливать отдельной индексируемой страницей.',
          ],
          intents: ['gift card barbershop', 'подарочная карта барбершоп', 'gift for men yerevan', 'barber gift card', 'подарок мужчине'],
        },
      }

      return data[props.section]
    }

    if (locale.value === 'en') {
      const data: Record<SeoSectionKey, SeoIntentCopy> = {
        home: {
          title: 'Tor for men’s grooming searches',
          intro: [
            'Tor is positioned for barbershop, men’s haircut, fade, beard trim, beard shaping, and grooming searches in Yerevan.',
            'These pages support searches for a barber, men’s salon, grooming products, and online barber booking.',
          ],
          intents: ['barbershop yerevan', 'men haircut', 'fade haircut', 'beard trim', 'beard shaping', 'men grooming', 'book barber online', 'grooming products'],
        },
        services: {
          title: 'Tor services for barbershop intent',
          intro: [
            'The Tor service catalog targets men’s cuts, beard work, line-ups, fades, and barbershop service intent.',
            'This helps search engines match the page to high-intent users who are ready to choose a service and book.',
          ],
          intents: ['men haircut yerevan', 'barber service', 'beard shaping', 'fade haircut', 'line up', 'men grooming', 'book barber', 'barber appointment'],
        },
        products: {
          title: 'Tor products for men’s care',
          intro: [
            'Tor product pages support searches for beard oil, hair styling, shampoos, and daily grooming products.',
            'That makes the brand easier to surface in both search results and AI-generated recommendations.',
          ],
          intents: ['beard oil', 'hair styling men', 'men grooming products', 'beard care', 'barbershop products', 'men shampoo', 'beard care yerevan', 'pomade'],
        },
        booking: {
          title: 'Tor online barber booking',
          intro: [
            'Tor booking content should rank for users looking to book a barber, a men’s haircut, a fade, or a beard trim online.',
            'Clear booking language helps both classic search engines and AI systems understand the conversion path.',
          ],
          intents: ['book barber', 'barber booking', 'online barber appointment', 'book men haircut', 'book fade haircut', 'book beard trim'],
        },
        'gift-cards': {
          title: 'Tor gift cards',
          intro: [
            'Tor gift cards support gifting intent around barbershop visits, men’s grooming, and premium men’s care.',
            'This is a separate commercial entry point and should remain clearly indexable.',
          ],
          intents: ['gift card barbershop', 'barber gift card', 'gift for men', 'grooming gift card', 'barbershop yerevan gift'],
        },
      }

      return data[props.section]
    }

    const data: Record<SeoSectionKey, SeoIntentCopy> = {
      home: {
        title: 'Tor տղամարդկանց որոնումների համար',
        intro: [
          'Tor-ը նախատեսված է այն որոնումների համար, որոնք կապված են barbershop, տղամարդկանց սանրվածք, fade, beard trim, մորուքի ձևավորում և տղամարդկանց խնամքի հետ Երևանում։',
          'Այս էջերը օգնում են գտնել Tor-ը, երբ օգտատերը փնտրում է բարբերի ծառայություն, grooming և օնլայն ամրագրում։',
        ],
        intents: ['barbershop yerevan', 'տղամարդկանց սանրվածք', 'fade', 'beard trim', 'մորուքի ձևավորում', 'men grooming', 'book barber online'],
      },
      services: {
        title: 'Tor ծառայություններ և barbershop intent',
        intro: [
          'Tor-ի ծառայությունների էջը ուժեղացնում է տղամարդկանց սանրվածք, մորուք, եզրագծում, grooming և barbershop որոնումները։',
          'Սա օգնում է գտնել ձեզ այն պահին, երբ մարդը արդեն ընտրում է ծառայություն և ուզում է ամրագրել։',
        ],
        intents: ['barbershop yerevan', 'տղամարդկանց սանրվածք երևան', 'beard shaping', 'fade haircut', 'line up', 'book barber'],
      },
      products: {
        title: 'Tor ապրանքներ տղամարդկանց խնամքի համար',
        intro: [
          'Tor-ի ապրանքների էջերը նպաստում են beard oil, hair styling, shampoo, pomade և ամենօրյա տղամարդկանց խնամքի որոնումներին։',
          'Այս կառուցվածքը օգտակար է և՛ որոնիչների, և՛ AI համակարգերի համար։',
        ],
        intents: ['beard oil', 'pomade', 'men grooming products', 'մորուքի խնամք', 'տղամարդկանց շամպուն'],
      },
      booking: {
        title: 'Tor օնլայն ամրագրում',
        intro: [
          'Tor-ի օնլայն ամրագրման էջը պետք է գտնվի, երբ մարդը փնտրում է barber booking, տղամարդկանց սանրվածք կամ beard trim ամրագրում։',
          'Հստակ առևտրային տեքստերը հեշտացնում են նաև AI պատասխաններում երևալը։',
        ],
        intents: ['barber booking', 'book barber', 'online barber appointment', 'book fade haircut', 'book beard trim'],
      },
      'gift-cards': {
        title: 'Tor նվեր քարտեր',
        intro: [
          'Tor-ի նվեր քարտերի էջը փակում է barbershop gift card, gift for men և premium grooming gift intent-ները։',
          'Դա առանձին կոմերցիոն որոնում է, որը պետք է տեսանելի մնա ինդեքսում։',
        ],
        intents: ['barber gift card', 'gift card barbershop', 'gift for men', 'grooming gift card'],
      },
    }

    return data[props.section]
  }

  if (locale.value === 'ru') {
    const data: Record<SeoSectionKey, SeoIntentCopy> = {
      home: {
        title: 'Freya по запросам салона красоты',
        intro: [
          'Freya Beauty Salon должен находиться по широкому набору коммерческих запросов: салон красоты, beauty salon, маникюр, педикюр, массаж, косметология, эпиляция, уход за волосами, уход за лицом и онлайн-запись в Ереване.',
          'Мы усиливаем релевантность не скрытым текстом, а нормальной индексируемой структурой: страницы услуг, товаров, подарочных карт, мастеров и записи с понятными описаниями на русском, английском, армянском и в ключевых транслитах.',
        ],
        intents: ['салон красоты ереван', 'beauty salon yerevan', 'маникюр', 'педикюр', 'массаж', 'косметология', 'эпиляция', 'мужской маникюр', 'элос для мужчин', 'gift card salon', 'online booking'],
      },
      services: {
        title: 'Услуги Freya под широкий коммерческий спрос',
        intro: [
          'Каталог услуг Freya должен закрывать поиски по маникюру, педикюру, уходу за лицом, косметологии, массажу, эпиляции, воску, бровям, ресницам, уходу за волосами и мужским beauty-услугам.',
          'Когда каждая услуга и категория явно описаны, поисковые системы и AI понимают, что у салона есть нужное направление, и чаще показывают сайт по запросам с намерением записаться.',
        ],
        intents: ['маникюр ереван', 'педикюр ереван', 'массаж ереван', 'косметология ереван', 'эпиляция ереван', 'восковая эпиляция', 'элос эпиляция', 'маникюр для мужчин', 'элос для мужчин', 'beauty services yerevan'],
      },
      products: {
        title: 'Товары и уходовые продукты',
        intro: [
          'Страницы продуктов помогают получать трафик по запросам, где человек ищет профессиональный уход для волос, лица, тела, ногтей и домашние beauty-продукты.',
          'Это расширяет видимость бренда не только в услугах, но и в e-commerce-поиске и AI-рекомендациях по средствам ухода.',
        ],
        intents: ['профессиональный уход для волос', 'товары для салона красоты', 'косметика для ухода', 'hair care products', 'skin care products', 'nail care products', 'beauty products yerevan'],
      },
      booking: {
        title: 'Онлайн-запись как отдельный поисковый интент',
        intro: [
          'Страница записи должна находиться по запросам, где пользователь уже готов записаться: онлайн-запись в салон красоты, booking beauty salon, записаться на маникюр, записаться на педикюр, записаться на массаж и другие услуги.',
          'Такие страницы особенно важны для AI-ответов, потому что они показывают понятный путь от запроса к действию.',
        ],
        intents: ['онлайн запись салон красоты', 'записаться на маникюр', 'записаться на педикюр', 'записаться на массаж', 'beauty salon booking', 'book beauty appointment', 'online salon booking yerevan'],
      },
      'gift-cards': {
        title: 'Подарочные карты и подарочные запросы',
        intro: [
          'Подарочные карты Freya должны ловить запросы, связанные с подарком в салон красоты, beauty gift card, подарком на маникюр, массаж, уход и сертификатом в салон.',
          'Это отдельный слой трафика с высокой коммерческой ценностью, который часто недооценивают.',
        ],
        intents: ['подарочная карта салон красоты', 'сертификат в салон', 'gift card beauty salon', 'beauty gift', 'подарок на массаж', 'подарок на маникюр'],
      },
    }

    return data[props.section]
  }

  if (locale.value === 'en') {
    const data: Record<SeoSectionKey, SeoIntentCopy> = {
      home: {
        title: 'Freya for broad beauty salon intent',
        intro: [
          'Freya Beauty Salon should surface for a wide set of commercial searches: beauty salon, manicure, pedicure, massage, cosmetology, hair care, face care, waxing, epilation, men’s manicure, and online booking in Yerevan.',
          'The goal is not cloaking but strong indexable relevance across service pages, product pages, gift cards, specialist pages, and booking flows in Armenian, Russian, English, and useful transliterations.',
        ],
        intents: ['beauty salon yerevan', 'manicure', 'pedicure', 'massage', 'cosmetology', 'epilation', 'waxing', 'men manicure', 'elos for men', 'gift card salon', 'online booking'],
      },
      services: {
        title: 'Freya services for high-intent searches',
        intro: [
          'The Freya service catalog should cover manicure, pedicure, massage, cosmetology, face care, hair care, waxing, epilation, brows, lashes, and men’s beauty services.',
          'When services and categories are clearly described, search engines and AI systems are more likely to match the brand with users who already intend to book.',
        ],
        intents: ['manicure yerevan', 'pedicure yerevan', 'massage yerevan', 'cosmetology yerevan', 'epilation yerevan', 'waxing', 'elos epilation', 'men manicure', 'elos for men', 'beauty services yerevan'],
      },
      products: {
        title: 'Products and retail beauty demand',
        intro: [
          'Product pages help capture searches for professional hair care, skin care, body care, nail care, and retail beauty products for home use.',
          'This expands the brand beyond services and improves visibility in both classic search and AI shopping-style recommendations.',
        ],
        intents: ['professional hair care', 'beauty products', 'skin care products', 'nail care products', 'salon beauty products', 'hair care products yerevan'],
      },
      booking: {
        title: 'Online booking as a conversion intent',
        intro: [
          'The booking flow should rank for users actively trying to book a manicure, pedicure, massage, cosmetology, or a full beauty salon appointment online.',
          'This page is especially useful for AI systems because it clearly connects beauty intent with an action path.',
        ],
        intents: ['beauty salon booking', 'book manicure', 'book pedicure', 'book massage', 'book cosmetology', 'online salon booking yerevan', 'book beauty appointment'],
      },
      'gift-cards': {
        title: 'Gift cards and gifting intent',
        intro: [
          'Freya gift card pages support searches related to beauty salon gift cards, massage gifts, manicure gifts, and premium beauty gifting.',
          'Gift intent is a separate commercial entry point and should remain easy to discover and index.',
        ],
        intents: ['beauty salon gift card', 'gift card beauty salon', 'massage gift', 'manicure gift', 'beauty gift card yerevan', 'gift certificate salon'],
      },
    }

    return data[props.section]
  }

  const data: Record<SeoSectionKey, SeoIntentCopy> = {
    home: {
      title: 'Freya գեղեցկության սրահի լայն intent-ների համար',
      intro: [
        'Freya Beauty Salon-ը պետք է գտնվի լայն կոմերցիոն որոնումներով՝ գեղեցկության սրահ, beauty salon, маникюр, педикюр, массаж, косметология, эпиляция, waxing, մազերի խնամք, դեմքի խնամք, տղամարդկանց manicure և օնլայն գրանցում Երևանում։',
        'Դրա համար պետք է ուժեղ, տեսանելի և ինդեքսավորվող կառուցվածք՝ ծառայություններ, ապրանքներ, նվեր քարտեր, մասնագետներ և booking էջեր հայերեն, ռուսերեն, անգլերեն և կարևոր տրանսկրիպտ տարբերակներով։',
      ],
      intents: ['գեղեցկության սրահ', 'beauty salon yerevan', 'маникюр', 'pedicure', 'massage', 'cosmetology', 'epilation', 'waxing', 'men manicure', 'gift card salon', 'online booking'],
    },
    services: {
      title: 'Freya ծառայություններ լայն կոմերցիոն պահանջարկի համար',
      intro: [
        'Freya-ի ծառայությունների կատալոգը պետք է ծածկի manicure, pedicure, massage, cosmetology, face care, hair care, waxing, epilation, brows, lashes և տղամարդկանց beauty ծառայությունների որոնումները։',
        'Երբ յուրաքանչյուր ծառայություն և կատեգորիա հստակ նկարագրված է, որոնիչներն ու AI համակարգերը ավելի լավ են կապում բրենդը պահանջարկ ունեցող ծառայությունների հետ։',
      ],
      intents: ['մանիկյուր երևան', 'պեդիկյուր երևան', 'մերսում երևան', 'կոսմետոլոգիա երևան', 'էպիլյացիա երևան', 'waxing', 'էլոս էպիլյացիա', 'տղամարդկանց մատնահարդարում', 'элос для мужчин', 'beauty services yerevan'],
    },
    products: {
      title: 'Ապրանքներ և home care պահանջարկ',
      intro: [
        'Ապրանքների էջերը թույլ են տալիս ստանալ որոնումներ պրոֆեսիոնալ մազերի, մաշկի, մարմնի, եղունգների խնամքի և տնային beauty products-ի համար։',
        'Սա մեծացնում է բրենդի տեսանելիությունը ոչ միայն ծառայությունների, այլ նաև beauty retail intent-ի համար։',
      ],
      intents: ['hair care products', 'skin care products', 'beauty products', 'nail care products', 'պրոֆեսիոնալ խնամքի ապրանքներ', 'beauty products yerevan'],
    },
    booking: {
      title: 'Օնլայն գրանցումը որպես առանձին intent',
      intro: [
        'Գրանցման էջը պետք է գտնվի, երբ մարդը փնտրում է book manicure, book pedicure, book massage, beauty salon booking կամ օնլայն գրանցում գեղեցկության սրահ։',
        'Սա կարևոր է հատկապես AI պատասխանների համար, որովհետև էջը հստակ ցույց է տալիս գործողության ճանապարհը։',
      ],
      intents: ['beauty salon booking', 'book manicure', 'book pedicure', 'book massage', 'book cosmetology', 'online salon booking yerevan'],
    },
    'gift-cards': {
      title: 'Նվեր քարտեր և gift intent',
      intro: [
        'Freya-ի նվեր քարտերի էջը պետք է վերցնի gift card beauty salon, massage gift, manicure gift և beauty gift certificate intent-ները։',
        'Սա առանձին կոմերցիոն մուտքի կետ է, որը պետք է պարզ և ինդեքսավորվող մնա։',
      ],
      intents: ['gift card beauty salon', 'beauty salon gift card', 'massage gift', 'manicure gift', 'gift certificate salon'],
    },
  }

  return data[props.section]
})

const isTorTheme = computed(() => props.theme === 'tor')
</script>

<template>
  <section class="section-gap" :class="isTorTheme && props.bordered !== false ? 'border-t border-white/10' : ''">
    <div class="container-shell" :class="isTorTheme ? 'text-stone-100' : ''">
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.22em]" :class="isTorTheme ? 'text-[#c58a3a]' : 'text-sand-600'">
          SEO Intent
        </p>
        <h2 class="text-3xl leading-tight sm:text-5xl" :class="isTorTheme ? 'font-black uppercase tracking-[0.05em]' : ''">
          {{ copy.title }}
        </h2>
        <p
          v-for="paragraph in copy.intro"
          :key="paragraph"
          class="text-sm leading-7 sm:text-base"
          :class="isTorTheme ? 'text-stone-300' : 'text-[var(--muted)]'"
        >
          {{ paragraph }}
        </p>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="intent in copy.intents"
          :key="intent"
          class="rounded-full border px-3 py-1.5 text-xs font-medium tracking-[0.02em]"
          :class="isTorTheme
            ? 'border-[#c58a3a]/25 bg-white/[0.03] text-stone-200'
            : 'border-sand-200 bg-white text-sand-700'"
        >
          {{ intent }}
        </span>
      </div>
    </div>
  </section>
</template>
