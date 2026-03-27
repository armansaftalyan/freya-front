<script setup lang="ts">
import FaqSection from "~/components/sections/FaqSection.vue";

const { locale } = useLocale()
const route = useRoute()
const { siteUrl } = useSiteMeta()
const { canonicalUrl } = useLocalizedSeo(() => route.path)
const { faqCopy } = usePageFaqContent('freya', 'privacy-policy')

useSeoMeta({
  title: 'Freya - Privacy Policy',
  description: 'Privacy policy, personal data processing, cancellation and payment terms for Freya Beauty Salon.',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogTitle: 'Freya - Privacy Policy',
  ogDescription: 'Privacy policy, personal data processing, cancellation and payment terms for Freya Beauty Salon.',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Freya - Privacy Policy',
  twitterDescription: 'Privacy policy, personal data processing, cancellation and payment terms for Freya Beauty Salon.',
})

const content = computed(() => {
  if (locale.value === 'ru') {
    return {
      title: 'Политика конфиденциальности',
      updatedAt: 'Дата обновления: 11 марта 2026',
      sections: [
        {
          title: '1. Какие данные мы собираем',
          body: [
            'Мы обрабатываем имя, телефон, email, историю записей, заказов и оплат.',
            'Данные используются для бронирования, связи с клиентом, выполнения заказов и улучшения сервиса.',
          ],
        },
        {
          title: '2. Как используются данные',
          body: [
            'Данные используются только для оказания услуг, обработки платежей, отправки уведомлений и клиентской поддержки.',
            'Мы не продаем и не передаем персональные данные третьим лицам, кроме технических и платежных провайдеров, необходимых для работы сервиса.',
          ],
        },
        {
          title: '3. Отмена, возврат и условия оказания услуг',
          body: [
            'Запись можно отменить до начала оказания услуги.',
            'После фактического оказания услуги возврат не осуществляется.',
            'Для электронных подарочных карт возврат невозможен после активации или частичного использования.',
          ],
        },
        {
          title: '4. Контакты',
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
      title: 'Privacy Policy',
      updatedAt: 'Updated on: March 11, 2026',
      sections: [
        {
          title: '1. Data We Collect',
          body: [
            'We process name, phone, email, booking history, order history, and payment records.',
            'This data is used for bookings, customer communication, order fulfilment, and service improvement.',
          ],
        },
        {
          title: '2. How We Use Data',
          body: [
            'Data is used only for service delivery, payment processing, customer support, and transactional notifications.',
            'We do not sell personal data or share it with third parties except technical and payment providers required to operate the service.',
          ],
        },
        {
          title: '3. Cancellation, Refunds, and Service Terms',
          body: [
            'A booking may be cancelled before the service begins.',
            'After a service has been delivered, refunds are not provided.',
            'Digital gift cards are non-refundable after activation or partial use.',
          ],
        },
        {
          title: '4. Contact Information',
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
    title: 'Գաղտնիության քաղաքականություն',
    updatedAt: 'Թարմացվել է` 2026 թ. մարտի 11',
    sections: [
      {
        title: '1. Ինչ տվյալներ ենք հավաքում',
        body: [
          'Մենք մշակում ենք անուն, հեռախոսահամար, email, ամրագրումների, պատվերների և վճարումների պատմություն։',
          'Այս տվյալները օգտագործվում են ամրագրման, հաճախորդի հետ կապի, պատվերների կատարման և ծառայության բարելավման համար։',
        ],
      },
      {
        title: '2. Ինչպես ենք օգտագործում տվյալները',
        body: [
          'Տվյալները օգտագործվում են միայն ծառայությունների մատուցման, վճարումների մշակման, հաճախորդների աջակցության և սպասարկման ծանուցումների համար։',
          'Մենք չենք վաճառում անձնական տվյալները և չենք փոխանցում երրորդ կողմերին, բացի այն տեխնիկական և վճարային գործընկերներից, որոնք անհրաժեշտ են ծառայության աշխատանքի համար։',
        ],
      },
      {
        title: '3. Չեղարկում, վերադարձ և ծառայության պայմաններ',
        body: [
          'Ամրագրումը կարելի է չեղարկել մինչև ծառայության մեկնարկը։',
          'Ծառայությունը մատուցվելուց հետո վերադարձ չի իրականացվում։',
          'Էլեկտրոնային նվեր քարտերը վերադարձի ենթակա չեն ակտիվացումից կամ մասնակի օգտագործումից հետո։',
        ],
      },
      {
        title: '4. Կոնտակտային տվյալներ',
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
      description: 'Privacy policy, personal data processing, cancellation and payment terms for Freya Beauty Salon.',
      isPartOf: {
        '@id': `${siteUrl.value}#website`,
      },
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
  <section class="section-gap">
    <div class="container-shell mx-auto max-w-4xl space-y-6">
      <div class="space-y-2">
        <h1 class="text-3xl leading-tight sm:text-5xl">{{ content.title }}</h1>
        <p class="text-sm text-[var(--muted)]">{{ content.updatedAt }}</p>
      </div>

      <article
        v-for="section in content.sections"
        :key="section.title"
        class="rounded-3xl border border-sand-200 bg-white p-5 shadow-soft sm:p-6"
      >
        <h2 class="text-xl font-semibold text-sand-900">{{ section.title }}</h2>
        <div class="mt-3 space-y-2">
          <p v-for="line in section.body" :key="line" class="text-sm leading-6 text-sand-700">
            {{ line }}
          </p>
        </div>
      </article>

      <FaqSection
        :eyebrow="faqCopy.eyebrow"
        :title="faqCopy.title"
        :lead="faqCopy.lead"
        :items="faqCopy.items"
      />
    </div>
  </section>
</template>
