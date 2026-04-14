<script setup lang="ts">
type SeoSectionKey =
  | 'home'
  | 'services'
  | 'products'
  | 'service-category'
  | 'service-detail'
  | 'product-category'
  | 'product-detail'
  | 'booking'
  | 'gift-cards'

type SeoIntentCopy = {
  title: string
  intro: string[]
  intents: string[]
}

const props = defineProps<{
  section: SeoSectionKey
  theme?: 'default' | 'tor'
  bordered?: boolean
  title?: string
  intro?: string[]
  intents?: string[]
}>()

const { locale } = useLocale()

const defaultCopy = computed<SeoIntentCopy>(() => {
  const isTor = props.theme === 'tor'

  if (isTor) {
    if (locale.value === 'ru') {
      const data: Record<SeoSectionKey, SeoIntentCopy> = {
        home: {
          title: 'Tor по мужским запросам',
          intro: [
            'Tor закрывает поиски, связанные с барбершопом, мужскими стрижками, fade, beard trim, оформлением бороды, face care, waxing и мужским уходом в Ереване.',
            'Страницы Tor подходят для запросов про барбера, мужской салон, grooming, combo haircut + beard, мужские продукты и онлайн-запись к барберу.',
          ],
          intents: ['барбершоп ереван', 'мужская стрижка', 'beard trim', 'barbershop yerevan', 'fade haircut yerevan', 'beard shaping', 'muzhskaya strizhka', 'barber erevan', 'barber booking yerevan', 'moruq'],
        },
        services: {
          title: 'Tor услуги и мужской grooming',
          intro: [
            'Каталог Tor усиливает интенты вокруг мужских стрижек, бороды, окантовки, grooming и барбер-услуг.',
            'Дополнительно страница должна закрывать транслитные и смешанные запросы: barbershop yerevan, fade haircut, beard trim, manikyur dlya muzhchin, pedikyur muzhskoy, epilyaciya muzhskaya, elos dlya muzhchin.',
            'Это помогает ранжироваться по коммерческим поискам, где человек уже хочет выбрать услугу и записаться онлайн.',
          ],
          intents: ['мужская стрижка ереван', 'barber service', 'beard shaping', 'fade haircut', 'line up', 'men grooming', 'book barber', 'барбер онлайн запись', 'barbershop yerevan', 'beard trim yerevan', 'manikyur dlya muzhchin', 'pedikyur muzhskoy', 'epilyaciya muzhskaya', 'elos dlya muzhchin'],
        },
        products: {
          title: 'Tor продукты для мужского ухода',
          intro: [
            'Страница товаров Tor закрывает запросы по продуктам для бороды, волос, стайлинга и ежедневного мужского ухода.',
            'Здесь важно покрывать и обычные, и транслитные формулировки: beard oil, pomade, shampoo for men, beard wash, styling paste, oil dlya borody, pomada dlya volos.',
            'Такие страницы полезны и для поиска, и для AI-ответов, потому что явно связывают бренд с конкретными товарами и задачами.',
          ],
          intents: ['beard oil', 'hair styling men', 'men grooming products', 'борода уход', 'товары для барбершопа', 'шампунь для мужчин', 'beard care yerevan', 'pomade', 'beard wash', 'styling paste', 'oil dlya borody', 'pomada dlya volos', 'men shampoo yerevan'],
        },
        'service-category': {
          title: 'Tor категория услуг под точечный спрос',
          intro: [
            'Категорийная страница Tor должна отвечать не только на общий запрос barbershop, но и на более узкие формулировки по типу fade, beard trim, shaving, line up, men manicure, pedicure, epilation и elos.',
            'Хорошо работают и транслиты: muzhskaya strizhka, boroda, beard trim, epilyaciya muzhskaya, manikyur dlya muzhchin, pedikyur muzhskoy.',
          ],
          intents: ['fade haircut yerevan', 'beard trim', 'shaving service', 'line up barber', 'muzhskaya strizhka', 'boroda', 'manikyur dlya muzhchin', 'pedikyur muzhskoy', 'epilyaciya muzhskaya', 'men grooming category'],
        },
        'service-detail': {
          title: 'Tor страница услуги под long-tail intent',
          intro: [
            'Детальная страница услуги лучше всего подходит под long-tail запросы, когда человек уже ищет конкретную процедуру, цену, длительность и возможность записи.',
            'Здесь особенно полезны смешанные ключи и транслиты: fade haircut yerevan, beard trim price, muzhskaya strizhka cena, men manicure online booking, elos dlya muzhchin.',
          ],
          intents: ['fade haircut yerevan', 'beard trim price', 'muzhskaya strizhka cena', 'book beard trim', 'men manicure online booking', 'pedikyur muzhskoy', 'elos dlya muzhchin', 'barber service price'],
        },
        'product-category': {
          title: 'Tor категория товаров для поискового спроса',
          intro: [
            'Категория товаров Tor должна усиливать спрос вокруг beard care, shaving, styling, pomade, shampoo, beard wash и других мужских grooming-продуктов.',
            'По таким страницам хорошо работают и русские, и транслитные связки: oil dlya borody, pomada dlya volos, shampoo dlya muzhchin, beard products yerevan.',
          ],
          intents: ['beard care products', 'shaving products', 'pomade', 'beard wash', 'oil dlya borody', 'pomada dlya volos', 'shampoo dlya muzhchin', 'beard products yerevan'],
        },
        'product-detail': {
          title: 'Tor карточка товара под коммерческий long-tail',
          intro: [
            'Карточка товара должна отвечать на поиски, где пользователь уже ищет конкретный продукт, бренд, формат, задачу и цену.',
            'Лучше всего здесь работают точные комбинации: beard oil price, pomade for men, shampoo for beard, oil dlya borody, styling paste men, grooming product yerevan.',
          ],
          intents: ['beard oil price', 'pomade for men', 'shampoo for beard', 'oil dlya borody', 'styling paste men', 'grooming product yerevan', 'beard care buy', 'men styling product'],
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
            'Tor is positioned for barbershop, men’s haircut, fade, beard trim, beard shaping, face care, waxing, and grooming searches in Yerevan.',
            'These pages support searches for a barber, combo haircut and beard services, grooming products, and online barber booking.',
          ],
          intents: ['barbershop yerevan', 'men haircut', 'fade haircut', 'beard trim', 'beard shaping', 'book barber online', 'barber booking yerevan', 'mens haircut yerevan', 'barber shop yerevan', 'moruq'],
        },
        services: {
          title: 'Tor services for barbershop intent',
          intro: [
            'The Tor service catalog targets men’s cuts, beard work, line-ups, fades, and barbershop service intent.',
            'It should also cover mixed and transliterated demand such as barbershop yerevan, fade haircut, beard trim, manikyur for men, pedikyur for men, men epilation, and men elos.',
            'This helps search engines match the page to high-intent users who are ready to choose a service and book.',
          ],
          intents: ['men haircut yerevan', 'barber service', 'beard shaping', 'fade haircut', 'line up', 'men grooming', 'book barber', 'barber appointment', 'barbershop yerevan', 'beard trim yerevan', 'manikyur for men', 'pedikyur for men', 'men epilation', 'men elos'],
        },
        products: {
          title: 'Tor products for men’s care',
          intro: [
            'Tor product pages support searches for beard oil, hair styling, shampoos, and daily grooming products.',
            'They should also match broader and transliterated demand like beard wash, styling paste, oil dlya borody, pomada dlya volos, and men shampoo.',
            'That makes the brand easier to surface in both search results and AI-generated recommendations.',
          ],
          intents: ['beard oil', 'hair styling men', 'men grooming products', 'beard care', 'barbershop products', 'men shampoo', 'beard care yerevan', 'pomade', 'beard wash', 'styling paste', 'oil dlya borody', 'pomada dlya volos'],
        },
        'service-category': {
          title: 'Tor service category intent',
          intro: [
            'A Tor service category page should rank not only for generic barbershop demand but also for narrower searches around fades, beard trim, shaving, line-ups, men manicure, pedicure, epilation, and men elos.',
            'This is where transliterated phrases also help: muzhskaya strizhka, boroda, manikyur for men, pedikyur for men.',
          ],
          intents: ['fade haircut yerevan', 'beard trim', 'shaving service', 'line up barber', 'muzhskaya strizhka', 'boroda', 'manikyur for men', 'pedikyur for men', 'men epilation', 'men grooming category'],
        },
        'service-detail': {
          title: 'Tor service page for long-tail demand',
          intro: [
            'A service detail page works best for long-tail searches when the user already wants a specific procedure, price range, duration, and booking path.',
            'Useful patterns include fade haircut yerevan, beard trim price, men manicure booking, muzhskaya strizhka price, and men elos.',
          ],
          intents: ['fade haircut yerevan', 'beard trim price', 'men manicure booking', 'muzhskaya strizhka price', 'pedikyur for men', 'men elos', 'barber service price', 'book beard trim'],
        },
        'product-category': {
          title: 'Tor product category intent',
          intro: [
            'Tor product category pages should support beard care, shaving, styling, pomade, shampoo, beard wash, and other men’s grooming product demand.',
            'This includes mixed-language phrasing such as oil dlya borody, pomada dlya volos, and beard products yerevan.',
          ],
          intents: ['beard care products', 'shaving products', 'pomade', 'beard wash', 'oil dlya borody', 'pomada dlya volos', 'men shampoo', 'beard products yerevan'],
        },
        'product-detail': {
          title: 'Tor product page for commercial long-tail',
          intro: [
            'A product detail page should match searches where the user is already looking for a specific item, format, use case, and buying path.',
            'Strong phrases here include beard oil price, pomade for men, beard wash, oil dlya borody, styling paste men, and grooming product yerevan.',
          ],
          intents: ['beard oil price', 'pomade for men', 'beard wash', 'oil dlya borody', 'styling paste men', 'grooming product yerevan', 'buy beard care', 'men styling product'],
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
          'Tor-ը նախատեսված է այն որոնումների համար, որոնք կապված են barbershop, տղամարդկանց սանրվածք, fade, beard trim, մորուքի ձևավորում, face care, waxing և տղամարդկանց խնամքի հետ Երևանում։',
          'Այս էջերը օգնում են գտնել Tor-ը, երբ օգտատերը փնտրում է բարբերի ծառայություն, combo haircut + beard, grooming և օնլայն ամրագրում։',
        ],
        intents: ['barbershop yerevan', 'տղամարդկանց սանրվածք', 'beard trim', 'fade haircut yerevan', 'beard shaping', 'book barber online', 'muzhskaya strizhka', 'barber erevan', 'barber booking yerevan', 'moruq'],
      },
      services: {
        title: 'Tor ծառայություններ և barbershop intent',
        intro: [
          'Tor-ի ծառայությունների էջը ուժեղացնում է տղամարդկանց սանրվածք, մորուք, եզրագծում, grooming և barbershop որոնումները։',
          'Արժե փակել նաև խառը ու տրանսլիտ ձևակերպումները՝ fade haircut, beard trim, manikyur for men, pedikyur for men, men epilation, men elos, muzhskaya strizhka։',
          'Սա օգնում է գտնել ձեզ այն պահին, երբ մարդը արդեն ընտրում է ծառայություն և ուզում է ամրագրել։',
        ],
        intents: ['barbershop yerevan', 'տղամարդկանց սանրվածք երևան', 'beard shaping', 'fade haircut', 'line up', 'book barber', 'beard trim', 'manikyur for men', 'pedikyur for men', 'men epilation', 'men elos', 'muzhskaya strizhka'],
      },
      products: {
        title: 'Tor ապրանքներ տղամարդկանց խնամքի համար',
        intro: [
          'Tor-ի ապրանքների էջերը նպաստում են beard oil, hair styling, shampoo, pomade և ամենօրյա տղամարդկանց խնամքի որոնումներին։',
          'Արժե ավելացնել նաև oil dlya borody, pomada dlya volos, beard wash, styling paste և men shampoo ձևակերպումները։',
          'Այս կառուցվածքը օգտակար է և՛ որոնիչների, և՛ AI համակարգերի համար։',
        ],
        intents: ['beard oil', 'pomade', 'men grooming products', 'մորուքի խնամք', 'տղամարդկանց շամպուն', 'oil dlya borody', 'pomada dlya volos', 'beard wash', 'styling paste', 'men shampoo'],
      },
      'service-category': {
        title: 'Tor ծառայության կատեգորիա նեղ intent-ների համար',
        intro: [
          'Tor-ի ծառայության կատեգորիայի էջը պետք է աշխատի ոչ միայն ընդհանուր barbershop intent-ի, այլ նաև ավելի նեղ fade, beard trim, shaving, line up, men manicure, pedicure, epilation և men elos որոնումների համար։',
          'Այստեղ օգտակար են նաև տրանսլիտ հարցումները՝ muzhskaya strizhka, boroda, manikyur for men, pedikyur for men։',
        ],
        intents: ['fade haircut yerevan', 'beard trim', 'shaving service', 'line up barber', 'muzhskaya strizhka', 'boroda', 'manikyur for men', 'pedikyur for men', 'men epilation', 'men grooming category'],
      },
      'service-detail': {
        title: 'Tor ծառայության էջ long-tail intent-ի համար',
        intro: [
          'Ծառայության դետալային էջը լավագույնն է այն long-tail որոնումների համար, որտեղ մարդը արդեն փնտրում է կոնկրետ պրոցեդուրա, գին, տևողություն և ամրագրման ուղի։',
          'Այստեղ օգտակար են fade haircut yerevan, beard trim price, men manicure booking, muzhskaya strizhka price և men elos նման ձևակերպումները։',
        ],
        intents: ['fade haircut yerevan', 'beard trim price', 'men manicure booking', 'muzhskaya strizhka price', 'pedikyur for men', 'men elos', 'barber service price', 'book beard trim'],
      },
      'product-category': {
        title: 'Tor ապրանքների կատեգորիա որոնողական պահանջարկի համար',
        intro: [
          'Tor ապրանքների կատեգորիայի էջը պետք է ուժեղացնի beard care, shaving, styling, pomade, shampoo, beard wash և այլ men grooming product intent-ները։',
          'Լավ են աշխատում նաև խառը լեզվով կապակցությունները՝ oil dlya borody, pomada dlya volos, beard products yerevan։',
        ],
        intents: ['beard care products', 'shaving products', 'pomade', 'beard wash', 'oil dlya borody', 'pomada dlya volos', 'men shampoo', 'beard products yerevan'],
      },
      'product-detail': {
        title: 'Tor ապրանքի էջ կոմերցիոն long-tail-ի համար',
        intro: [
          'Ապրանքի քարտը պետք է պատասխանի այն որոնումներին, որտեղ օգտատերը արդեն փնտրում է կոնկրետ ապրանք, օգտագործման դեպք, գին և գնման ուղի։',
          'Այստեղ ուժեղ են beard oil price, pomade for men, beard wash, oil dlya borody, styling paste men և grooming product yerevan որոնումները։',
        ],
        intents: ['beard oil price', 'pomade for men', 'beard wash', 'oil dlya borody', 'styling paste men', 'grooming product yerevan', 'buy beard care', 'men styling product'],
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
          'Freya Beauty Salon должен находиться по широкому набору коммерческих запросов: салон красоты, beauty salon, маникюр, педикюр, массаж, косметология, эпиляция, уход за волосами, уход за лицом, brows, lashes, hair coloring и онлайн-запись в Ереване.',
          'Мы усиливаем релевантность не скрытым текстом, а нормальной индексируемой структурой: страницы услуг, товаров, подарочных карт, мастеров и записи с понятными описаниями на русском, английском, армянском и в ключевых транслитах вроде manikyur, pedikyur, kosmetolog, massazh и salon krasoty yerevan.',
        ],
        intents: ['салон красоты ереван', 'beauty salon yerevan', 'маникюр', 'педикюр', 'массаж', 'косметология', 'online booking', 'manikyur', 'pedikyur', 'massazh', 'salon krasoty yerevan', 'beauty salon in yerevan', 'nail salon yerevan', 'facial treatment yerevan', 'gexeckutyan srah yerevan', 'matnahardarum', 'mersum'],
      },
      services: {
        title: 'Услуги Freya под широкий коммерческий спрос',
        intro: [
          'Каталог услуг Freya должен закрывать поиски по маникюру, педикюру, уходу за лицом, косметологии, массажу, эпиляции, воску, бровям, ресницам, уходу за волосами и мужским beauty-услугам.',
          'Сюда же стоит добавлять транслиты и смешанные формулировки: manikyur, pedikyur, kosmetolog, massazh, epilyaciya, vosk, brows, lashes, keratin, botoks volos, salon krasoty yerevan.',
          'Когда каждая услуга и категория явно описаны, поисковые системы и AI понимают, что у салона есть нужное направление, и чаще показывают сайт по запросам с намерением записаться.',
        ],
        intents: ['маникюр ереван', 'педикюр ереван', 'массаж ереван', 'косметология ереван', 'эпиляция ереван', 'восковая эпиляция', 'элос эпиляция', 'маникюр для мужчин', 'элос для мужчин', 'beauty services yerevan', 'manikyur', 'pedikyur', 'kosmetolog', 'massazh', 'epilyaciya', 'keratin', 'botoks volos', 'salon krasoty yerevan'],
      },
      products: {
        title: 'Товары и уходовые продукты',
        intro: [
          'Страницы продуктов помогают получать трафик по запросам, где человек ищет профессиональный уход для волос, лица, тела, ногтей и домашние beauty-продукты.',
          'Тут полезны и русские, и транслитные формулировки: hair care, skin care, face cream, serum, maska dlya volos, krem dlya lica, scrub dlya tela, beauty products yerevan.',
          'Это расширяет видимость бренда не только в услугах, но и в e-commerce-поиске и AI-рекомендациях по средствам ухода.',
        ],
        intents: ['профессиональный уход для волос', 'товары для салона красоты', 'косметика для ухода', 'hair care products', 'skin care products', 'nail care products', 'beauty products yerevan', 'maska dlya volos', 'krem dlya lica', 'scrub dlya tela', 'serum for face', 'face cream yerevan'],
      },
      'service-category': {
        title: 'Категория услуг Freya под точечные запросы',
        intro: [
          'Категорийная страница услуги хорошо работает под более конкретные поиски, когда пользователь уже выбрал направление: маникюр, педикюр, косметология, массаж, brows, lashes, hair care, elos, waxing.',
          'Именно здесь стоит усиливать транслиты вроде manikyur, pedikyur, kosmetolog, massazh, epilyaciya, keratin, botoks volos.',
        ],
        intents: ['маникюр ереван', 'pedikyur', 'kosmetolog', 'massazh', 'epilyaciya', 'waxing', 'brows', 'lashes', 'keratin', 'botoks volos'],
      },
      'service-detail': {
        title: 'Страница услуги Freya под long-tail поиск',
        intro: [
          'Детальная страница услуги нужна для long-tail поисков, где человек ищет конкретную процедуру, цену, длительность и запись онлайн.',
          'Здесь хорошо работают и обычные, и транслитные ключи: manikyur cena, pedikyur yerevan, massazh cena, keratin hair treatment, botoks volos, epilyaciya online booking.',
        ],
        intents: ['manikyur cena', 'pedikyur yerevan', 'massazh cena', 'keratin hair treatment', 'botoks volos', 'epilyaciya online booking', 'brows appointment', 'lashes booking'],
      },
      'product-category': {
        title: 'Категория товаров Freya под retail intent',
        intro: [
          'Категория товаров Freya должна закрывать спрос по уходу за волосами, лицом, телом, ногтями и салонным продуктам для домашнего использования.',
          'Тут полезны hair care, skin care, face cream, body scrub, serum, maska dlya volos, krem dlya lica и похожие коммерческие запросы.',
        ],
        intents: ['hair care', 'skin care', 'face cream', 'body scrub', 'serum', 'maska dlya volos', 'krem dlya lica', 'beauty products yerevan'],
      },
      'product-detail': {
        title: 'Карточка товара Freya под коммерческий спрос',
        intro: [
          'Карточка товара должна отвечать на поиски, где пользователь уже ищет конкретный продукт, эффект, объем, цену и возможность заказать.',
          'Для таких страниц полезны serum for face, face cream price, hair mask buy, maska dlya volos, krem dlya lica, body scrub yerevan.',
        ],
        intents: ['serum for face', 'face cream price', 'hair mask buy', 'maska dlya volos', 'krem dlya lica', 'body scrub yerevan', 'skin care buy', 'beauty product order'],
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
          'Freya Beauty Salon should surface for a wide set of commercial searches: beauty salon, manicure, pedicure, massage, cosmetology, hair care, face care, waxing, epilation, brows, lashes, hair coloring, men’s manicure, and online booking in Yerevan.',
          'The goal is not cloaking but strong indexable relevance across service pages, product pages, gift cards, specialist pages, and booking flows in Armenian, Russian, English, and useful transliterations such as manikyur, pedikyur, kosmetolog, massazh, and salon krasoty yerevan.',
        ],
        intents: ['beauty salon yerevan', 'manicure', 'pedicure', 'massage', 'cosmetology', 'online booking', 'manikyur', 'pedikyur', 'massazh', 'salon krasoty yerevan', 'beauty salon in yerevan', 'nail salon yerevan', 'facial treatment yerevan', 'gexeckutyan srah yerevan', 'matnahardarum', 'mersum'],
      },
      services: {
        title: 'Freya services for high-intent searches',
        intro: [
          'The Freya service catalog should cover manicure, pedicure, massage, cosmetology, face care, hair care, waxing, epilation, brows, lashes, and men’s beauty services.',
          'It should also include useful transliterations and mixed phrasing such as manikyur, pedikyur, kosmetolog, massazh, epilyaciya, keratin, botoks volos, and salon krasoty yerevan.',
          'When services and categories are clearly described, search engines and AI systems are more likely to match the brand with users who already intend to book.',
        ],
        intents: ['manicure yerevan', 'pedicure yerevan', 'massage yerevan', 'cosmetology yerevan', 'epilation yerevan', 'waxing', 'elos epilation', 'men manicure', 'elos for men', 'beauty services yerevan', 'manikyur', 'pedikyur', 'kosmetolog', 'massazh', 'epilyaciya', 'keratin', 'botoks volos', 'salon krasoty yerevan'],
      },
      products: {
        title: 'Products and retail beauty demand',
        intro: [
          'Product pages help capture searches for professional hair care, skin care, body care, nail care, and retail beauty products for home use.',
          'They should also match mixed and transliterated demand like maska dlya volos, krem dlya lica, serum for face, and body scrub.',
          'This expands the brand beyond services and improves visibility in both classic search and AI shopping-style recommendations.',
        ],
        intents: ['professional hair care', 'beauty products', 'skin care products', 'nail care products', 'salon beauty products', 'hair care products yerevan', 'maska dlya volos', 'krem dlya lica', 'serum for face', 'body scrub', 'face cream yerevan'],
      },
      'service-category': {
        title: 'Freya service category intent',
        intro: [
          'A service category page works for more focused searches when the user has already picked a direction such as manicure, pedicure, cosmetology, massage, brows, lashes, waxing, elos, or hair care.',
          'This is also the right place for transliterated demand like manikyur, pedikyur, kosmetolog, massazh, epilyaciya, keratin, and botoks volos.',
        ],
        intents: ['manicure yerevan', 'pedikyur', 'kosmetolog', 'massazh', 'epilyaciya', 'waxing', 'brows', 'lashes', 'keratin', 'botoks volos'],
      },
      'service-detail': {
        title: 'Freya service page for long-tail searches',
        intro: [
          'A service detail page is best for long-tail searches where the user wants a specific treatment, price, duration, and booking path.',
          'Strong query patterns include manikyur price, pedicure yerevan, massage price, keratin hair treatment, botoks volos, and epilation booking.',
        ],
        intents: ['manikyur price', 'pedicure yerevan', 'massage price', 'keratin hair treatment', 'botoks volos', 'epilation booking', 'brows appointment', 'lashes booking'],
      },
      'product-category': {
        title: 'Freya product category for retail demand',
        intro: [
          'A Freya product category page should support hair care, skin care, face cream, body scrub, serum, nail care, and salon retail demand for home use.',
          'Useful phrasing includes maska dlya volos, krem dlya lica, serum for face, and beauty products yerevan.',
        ],
        intents: ['hair care', 'skin care', 'face cream', 'body scrub', 'serum', 'maska dlya volos', 'krem dlya lica', 'beauty products yerevan'],
      },
      'product-detail': {
        title: 'Freya product page for commercial demand',
        intro: [
          'A product detail page should answer searches where the user already wants a specific item, effect, size, price, and order path.',
          'Useful patterns here include serum for face, face cream price, hair mask buy, maska dlya volos, krem dlya lica, and body scrub yerevan.',
        ],
        intents: ['serum for face', 'face cream price', 'hair mask buy', 'maska dlya volos', 'krem dlya lica', 'body scrub yerevan', 'skin care buy', 'beauty product order'],
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
        'Freya Beauty Salon-ը պետք է գտնվի լայն կոմերցիոն որոնումներով՝ գեղեցկության սրահ, beauty salon, маникюр, педикюр, массаж, косметология, эпиляция, waxing, brows, lashes, hair coloring, մազերի խնամք, դեմքի խնամք, տղամարդկանց manicure և օնլայն գրանցում Երևանում։',
        'Դրա համար պետք է ուժեղ, տեսանելի և ինդեքսավորվող կառուցվածք՝ ծառայություններ, ապրանքներ, նվեր քարտեր, մասնագետներ և booking էջեր հայերեն, ռուսերեն, անգլերեն և կարևոր տրանսլիտ տարբերակներով՝ manikyur, pedikyur, kosmetolog, massazh, salon krasoty yerevan։',
      ],
      intents: ['գեղեցկության սրահ', 'beauty salon yerevan', 'pedicure', 'massage', 'cosmetology', 'online booking', 'manikyur', 'pedikyur', 'massazh', 'salon krasoty yerevan', 'beauty salon in yerevan', 'nail salon yerevan', 'facial treatment yerevan', 'gexeckutyan srah yerevan', 'matnahardarum', 'mersum'],
    },
    services: {
      title: 'Freya ծառայություններ լայն կոմերցիոն պահանջարկի համար',
      intro: [
        'Freya-ի ծառայությունների կատալոգը պետք է ծածկի manicure, pedicure, massage, cosmetology, face care, hair care, waxing, epilation, brows, lashes և տղամարդկանց beauty ծառայությունների որոնումները։',
        'Արժե ավելացնել նաև տրանսլիտ և խառը ձևակերպումներ՝ manikyur, pedikyur, kosmetolog, massazh, epilyaciya, keratin, botoks volos, salon krasoty yerevan։',
        'Երբ յուրաքանչյուր ծառայություն և կատեգորիա հստակ նկարագրված է, որոնիչներն ու AI համակարգերը ավելի լավ են կապում բրենդը պահանջարկ ունեցող ծառայությունների հետ։',
      ],
      intents: ['մանիկյուր երևան', 'պեդիկյուր երևան', 'մերսում երևան', 'կոսմետոլոգիա երևան', 'էպիլյացիա երևան', 'waxing', 'էլոս էպիլյացիա', 'տղամարդկանց մատնահարդարում', 'элос для мужчин', 'beauty services yerevan', 'manikyur', 'pedikyur', 'kosmetolog', 'massazh', 'epilyaciya', 'keratin', 'botoks volos', 'salon krasoty yerevan'],
    },
    products: {
      title: 'Ապրանքներ և home care պահանջարկ',
      intro: [
        'Ապրանքների էջերը թույլ են տալիս ստանալ որոնումներ պրոֆեսիոնալ մազերի, մաշկի, մարմնի, եղունգների խնամքի և տնային beauty products-ի համար։',
        'Արժե փակել նաև maska dlya volos, krem dlya lica, serum for face, body scrub և նման խառը որոնումները։',
        'Սա մեծացնում է բրենդի տեսանելիությունը ոչ միայն ծառայությունների, այլ նաև beauty retail intent-ի համար։',
      ],
      intents: ['hair care products', 'skin care products', 'beauty products', 'nail care products', 'պրոֆեսիոնալ խնամքի ապրանքներ', 'beauty products yerevan', 'maska dlya volos', 'krem dlya lica', 'serum for face', 'body scrub', 'face cream yerevan'],
    },
    'service-category': {
      title: 'Freya ծառայության կատեգորիա կոնկրետ intent-ների համար',
      intro: [
        'Ծառայության կատեգորիայի էջը լավ աշխատում է այն դեպքերում, երբ օգտատերը արդեն ընտրել է ուղղությունը՝ manicure, pedicure, cosmetology, massage, brows, lashes, waxing, elos կամ hair care։',
        'Սա նաև ճիշտ տեղն է manikyur, pedikyur, kosmetolog, massazh, epilyaciya, keratin և botoks volos տրանսլիտների համար։',
      ],
      intents: ['manicure yerevan', 'pedikyur', 'kosmetolog', 'massazh', 'epilyaciya', 'waxing', 'brows', 'lashes', 'keratin', 'botoks volos'],
    },
    'service-detail': {
      title: 'Freya ծառայության էջ long-tail որոնումների համար',
      intro: [
        'Ծառայության դետալային էջը ամենահարմարն է long-tail որոնումների համար, երբ մարդը փնտրում է կոնկրետ պրոցեդուրա, գին, տևողություն և օնլայն ամրագրում։',
        'Այստեղ լավ են աշխատում manikyur price, pedicure yerevan, massage price, keratin hair treatment, botoks volos և epilation booking հարցումները։',
      ],
      intents: ['manikyur price', 'pedicure yerevan', 'massage price', 'keratin hair treatment', 'botoks volos', 'epilation booking', 'brows appointment', 'lashes booking'],
    },
    'product-category': {
      title: 'Freya ապրանքների կատեգորիա retail պահանջարկի համար',
      intro: [
        'Freya ապրանքների կատեգորիայի էջը պետք է ուժեղացնի hair care, skin care, face cream, body scrub, serum, nail care և home-use beauty product intent-ները։',
        'Օգտակար են նաև maska dlya volos, krem dlya lica, serum for face և beauty products yerevan ձևակերպումները։',
      ],
      intents: ['hair care', 'skin care', 'face cream', 'body scrub', 'serum', 'maska dlya volos', 'krem dlya lica', 'beauty products yerevan'],
    },
    'product-detail': {
      title: 'Freya ապրանքի էջ կոմերցիոն պահանջարկի համար',
      intro: [
        'Ապրանքի քարտը պետք է պատասխանի այն որոնումներին, որտեղ օգտատերը արդեն փնտրում է կոնկրետ ապրանք, արդյունք, ծավալ, գին և պատվերի ուղի։',
        'Այստեղ ուժեղ են serum for face, face cream price, hair mask buy, maska dlya volos, krem dlya lica և body scrub yerevan որոնումները։',
      ],
      intents: ['serum for face', 'face cream price', 'hair mask buy', 'maska dlya volos', 'krem dlya lica', 'body scrub yerevan', 'skin care buy', 'beauty product order'],
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

const copy = computed<SeoIntentCopy>(() => ({
  title: props.title || defaultCopy.value.title,
  intro: props.intro?.length ? props.intro : defaultCopy.value.intro,
  intents: props.intents?.length ? props.intents : defaultCopy.value.intents,
}))

const isTorTheme = computed(() => props.theme === 'tor')
const summaryLabel = computed(() => {
  if (locale.value === 'ru') return 'О странице и поисковом контексте'
  if (locale.value === 'hy') return 'Էջի և որոնողական համատեքստի մասին'
  return 'About This Page and Search Context'
})
</script>

<template>
  <section class="section-gap" :class="isTorTheme && props.bordered !== false ? 'border-t border-white/10' : ''">
    <div class="container-shell" :class="isTorTheme ? 'text-stone-100' : ''">
      <details
        class="rounded-[28px] border p-5 sm:p-6"
        :class="isTorTheme ? 'border-white/10 bg-white/[0.02]' : 'border-sand-200/80 bg-white/70'"
      >
        <summary
          class="cursor-pointer list-none text-sm font-semibold tracking-[0.04em] flex items-center justify-between gap-4"
          :class="isTorTheme ? 'text-[#e4b372]' : 'text-sand-700'"
        >
          <span>{{ summaryLabel }}</span>
          <span :class="isTorTheme ? 'text-stone-500' : 'text-sand-500'">+</span>
        </summary>

        <div class="mt-5 space-y-4">
          <h2 class="text-2xl leading-tight sm:text-3xl" :class="isTorTheme ? 'font-black uppercase tracking-[0.05em]' : ''">
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

          <div class="flex flex-wrap gap-2">
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
      </details>
    </div>
  </section>
</template>
