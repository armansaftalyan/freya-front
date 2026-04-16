<script setup lang="ts">
const { locale } = useLocale()
const route = useRoute()
const { siteUrl, defaultImageUrl } = useSiteMeta()
const { brand, isTor } = useBrandContext()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const brandOgImage = computed(() => brand.value === 'tor' ? `${siteUrl.value}/tor-logo.jpg` : defaultImageUrl.value)

usePageSeo({
  title: () => `${brand.value === 'tor' ? 'Terms and Policies Tor Barbershop' : 'Terms and Policies Freya Beauty Salon'}`,
  description: () => `Privacy, personal data processing, cancellation/refund, delivery terms and payment details for ${brand.value === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon'}.`,
  image: () => brandOgImage.value,
})

const content = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Условия и политики',
      updatedAt: 'Дата обновления: 11 марта 2026',
      sections: [
        {
          title: '1. Политика конфиденциальности',
          body: [
            'Мы используем данные клиента только для бронирования, оплаты, обратной связи и улучшения сервиса.',
            'Данные не передаются третьим лицам, кроме случаев, необходимых для обработки платежей, требований закона и технического обслуживания платформы.',
          ],
        },
        {
          title: '2. Политика обработки персональных данных',
          body: [
            'Обрабатываются: имя, телефон, email, история записей и платежей.',
            'Основание обработки: регистрация, оформление заказа, исполнение договора оказания услуг.',
            'Клиент вправе запросить исправление/удаление данных по email: support@freyabeauty.am.',
          ],
        },
        {
          title: '3. Отмена и возврат',
          body: [
            'Запись можно отменить до начала оказания услуги.',
            'После фактического оказания услуги возврат не выполняется.',
            'Для подарочных карт после активации и/или частичного использования возврат не производится.',
            'Если услуга/товар не подлежит возврату, это фиксируется в карточке услуги/товара и в счете.',
          ],
        },
        {
          title: '4. Условия продажи и оказания услуг (Terms and Conditions)',
          body: [
            'Оформляя запись или заказ, клиент подтверждает корректность введенных данных и согласие с данными условиями.',
            'Услуга оказывается по предварительной записи в выбранный клиентом слот.',
            'Электронные подарочные карты отправляются получателю после подтверждения оплаты.',
          ],
        },
        {
          title: '5. Цены',
          body: [
            'Актуальные цены указаны на странице услуг.',
            'Каталог с ценами: /services',
          ],
        },
        {
          title: '6. Контакты',
          body: [
            'Телефон: +374 44 733773',
            'Email: support@freyabeauty.am',
            'Telegram: https://t.me/freyabeauty',
          ],
        },
      ],
    }
  }

  if (locale.value === 'en') {
    return {
      title: 'Terms and Policies',
      updatedAt: 'Updated on: March 11, 2026',
      sections: [
        {
          title: '1. Privacy Policy',
          body: [
            'We use customer data only for booking, payment, communication, and service improvement.',
            'Data is not shared with third parties except for payment processing, legal obligations, and technical platform support.',
          ],
        },
        {
          title: '2. Personal Data Processing Policy',
          body: [
            'Processed data: name, phone, email, booking history, and payment history.',
            'Legal basis: registration, order placement, and service contract fulfillment.',
            'The customer may request correction/deletion by email: support@freyabeauty.am.',
          ],
        },
        {
          title: '3. Cancellation and Refund Policy',
          body: [
            'A booking can be cancelled before service delivery starts.',
            'After a service is delivered, refunds are not provided.',
            'Gift cards are non-refundable after activation and/or partial use.',
            'If a service/product is non-refundable, it is explicitly stated in the product/service details and invoice.',
          ],
        },
        {
          title: '4. Terms and Conditions',
          body: [
            'By placing a booking or order, the customer confirms data accuracy and accepts these terms.',
            'Services are provided by advance booking in the selected time slot.',
            'Digital gift cards are sent to the recipient after payment confirmation.',
          ],
        },
        {
          title: '5. Pricing',
          body: [
            'Current prices are published on the services page.',
            'Pricing catalog: /services',
          ],
        },
        {
          title: '6. Contacts',
          body: [
            'Phone: +374 44 733773',
            'Email: support@freyabeauty.am',
            'Telegram: https://t.me/freyabeauty',
          ],
        },
      ],
    }
  }

  return {
    title: 'Պայմաններ և քաղաքականություններ',
    updatedAt: 'Թարմացվել է` 2026 թ. մարտի 11',
    sections: [
      {
        title: '1. Գաղտնիության քաղաքականություն',
        body: [
          'Հաճախորդի տվյալները օգտագործվում են միայն ամրագրման, վճարման, հետադարձ կապի և ծառայության բարելավման նպատակով։',
          'Տվյալները երրորդ անձանց չեն փոխանցվում, բացի վճարումների մշակման, օրենքով նախատեսված և տեխնիկական սպասարկման դեպքերից։',
        ],
      },
      {
        title: '2. Անձնական տվյալների մշակման քաղաքականություն',
        body: [
          'Մշակվում են՝ անուն, հեռախոսահամար, email, ամրագրումների և վճարումների պատմություն։',
          'Մշակման հիմք՝ գրանցում, պատվերի ձևակերպում, ծառայության մատուցման պայմանագրի կատարում։',
          'Հաճախորդը կարող է պահանջել տվյալների ուղղում/ջնջում՝ support@freyabeauty.am հասցեով։',
        ],
      },
      {
        title: '3. Չեղարկման և վերադարձի քաղաքականություն',
        body: [
          'Ամրագրումը կարող է չեղարկվել մինչև ծառայության մատուցման մեկնարկը։',
          'Ծառայության փաստացի մատուցումից հետո վերադարձ չի իրականացվում։',
          'Նվեր քարտերի համար ակտիվացումից և/կամ մասնակի օգտագործումից հետո վերադարձ չի կատարվում։',
          'Եթե ծառայությունը/ապրանքը վերադարձի ենթակա չէ, այդ մասին առանձին նշվում է ծառայության/ապրանքի նկարագրության և հաշվի մեջ։',
        ],
      },
      {
        title: '4. Վաճառքի և ծառայության մատուցման պայմաններ (Terms and Conditions)',
        body: [
          'Ամրագրում կամ պատվեր ձևակերպելիս հաճախորդը հաստատում է մուտքագրված տվյալների ճշտությունը և սույն պայմանների ընդունումը։',
          'Ծառայությունները մատուցվում են նախնական ամրագրմամբ՝ հաճախորդի ընտրած ժամային պատուհանում։',
          'Էլեկտրոնային նվեր քարտը ուղարկվում է ստացողին վճարման հաստատումից հետո։',
        ],
      },
      {
        title: '5. Գներ',
        body: [
          'Գործող գները հրապարակված են ծառայությունների էջում։',
          'Գնացուցակ՝ /services',
        ],
      },
      {
        title: '6. Կոնտակտային տվյալներ',
        body: [
          'Հեռախոս՝ +374 44 733773',
          'Email՝ support@freyabeauty.am',
          'Telegram՝ https://t.me/freyabeauty',
        ],
      },
    ],
  }
})

useStructuredData(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      url: canonicalUrl.value,
      name: content.value.title,
      description: 'Privacy, personal data processing, cancellation/refund, delivery terms and payment details.',
      isPartOf: {
        '@id': `${siteUrl.value}#website`,
      },
      about: {
        '@id': `${siteUrl.value}#salon`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale.value === 'ru' ? 'Главная' : locale.value === 'en' ? 'Home' : 'Գլխավոր',
          item: siteUrl.value,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.value.title,
          item: canonicalUrl.value,
        },
      ],
    },
  ],
}))
</script>

<template>
  <section :class="isTor ? 'section-gap text-stone-100' : 'section-gap'">
    <div class="container-shell mx-auto max-w-4xl space-y-6">
      <div class="space-y-2">
        <p v-if="isTor" class="text-xs uppercase tracking-[0.22em] text-[#c58a3a]">Tor Barbershop</p>
        <h1 class="text-3xl leading-tight sm:text-5xl" :class="isTor ? 'text-stone-100' : ''">{{ content.title }}</h1>
        <p class="text-sm" :class="isTor ? 'text-stone-400' : 'text-[var(--muted)]'">{{ content.updatedAt }}</p>
      </div>

      <div
        class="rounded-3xl p-5 sm:p-6"
        :class="isTor
          ? 'border border-white/10 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.28)]'
          : 'border border-sand-200 bg-white shadow-soft'"
      >
        <p class="text-sm" :class="isTor ? 'text-stone-300' : 'text-sand-700'">
          Visa, Mastercard, ArCa և Idram վճարային համակարգերի սպասարկում։
          <span :class="isTor ? 'text-stone-500' : 'text-[var(--muted)]'">(Լոգոները ներկայացված են ֆութերում)</span>
        </p>
      </div>

      <article
        v-for="section in content.sections"
        :key="section.title"
        class="rounded-3xl p-5 sm:p-6"
        :class="isTor
          ? 'border border-white/10 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.28)]'
          : 'border border-sand-200 bg-white shadow-soft'"
      >
        <h2 class="text-xl font-semibold" :class="isTor ? 'text-stone-100' : 'text-sand-900'">{{ section.title }}</h2>
        <div class="mt-3 space-y-2">
          <p v-for="line in section.body" :key="line" class="text-sm leading-6" :class="isTor ? 'text-stone-300' : 'text-sand-700'">
            {{ line }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
