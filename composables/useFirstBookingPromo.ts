import type { Master } from '~/types/master'
import type { Service } from '~/types/service'

type PromoAudience = 'all' | 'ad-traffic'
type ServiceLike = Pick<Service, 'id' | 'price_from' | 'price_to'>

const FIRST_BOOKING_PROMO = {
  enabled: true,
  percentOff: 50,
  audience: 'all' as PromoAudience,
}

export const useFirstBookingPromo = () => {
  const route = useRoute()
  const { locale } = useLocale()
  const { formatAmd } = useCurrency()
  const { resolvePriceRange } = useServicePricing()
  const searchReferrer = useState('promo-search-referrer', () => false)

  const isAdTraffic = computed(() => {
    const query = route.query
    return Boolean(
      query.fbclid
      || query.gclid
      || query.utm_source
      || query.utm_medium
      || query.utm_campaign
      || query.promo,
    )
  })

  const isVisible = computed(() => {
    if (!FIRST_BOOKING_PROMO.enabled) return false
    if (FIRST_BOOKING_PROMO.audience === 'all') return true
    return isAdTraffic.value
  })

  const isSearchTraffic = computed(() => {
    if (searchReferrer.value) return true

    const source = typeof route.query.utm_source === 'string' ? route.query.utm_source.toLowerCase() : ''
    return ['google', 'yandex', 'bing', 'duckduckgo', 'search'].includes(source)
  })

  const promoCopy = computed(() => {
    if (locale.value === 'ru') {
      return {
        shortBadge: `-${FIRST_BOOKING_PROMO.percentOff}%`,
        badge: `-${FIRST_BOOKING_PROMO.percentOff}% на первую запись`,
        title: `Скидка ${FIRST_BOOKING_PROMO.percentOff}% на первую запись`,
        description: 'Показываем акционную цену только на фронте. Финальную стоимость подтверждает администратор салона.',
        summary: 'Промо-цена для первой записи',
        disclaimer: 'Скидка действует для первой записи. Финальная стоимость подтверждается салоном.',
        modalTitle: 'Новые гости Freya Beauty Salon',
        modalLead: `Скидка ${FIRST_BOOKING_PROMO.percentOff}% на первую запись`,
        modalDescription: 'Если вы пришли из поиска, зарегистрируйтесь или перейдите к записи и получите акционное предложение для первого визита.',
        modalPrimary: 'Перейти к записи',
        modalSecondary: 'Зарегистрироваться',
      }
    }

    if (locale.value === 'en') {
      return {
        shortBadge: `${FIRST_BOOKING_PROMO.percentOff}% off`,
        badge: `${FIRST_BOOKING_PROMO.percentOff}% off first booking`,
        title: `${FIRST_BOOKING_PROMO.percentOff}% off your first booking`,
        description: 'Promo pricing is shown on the frontend only. Final confirmation is handled by the salon administrator.',
        summary: 'First-booking promo price',
        disclaimer: 'The discount applies to the first booking. Final pricing is confirmed by the salon.',
        modalTitle: 'New to Freya Beauty Salon',
        modalLead: `${FIRST_BOOKING_PROMO.percentOff}% off your first booking`,
        modalDescription: 'If you arrived from search, register or continue to booking to claim the first-visit promo offer.',
        modalPrimary: 'Go to booking',
        modalSecondary: 'Create account',
      }
    }

    return {
      shortBadge: `-${FIRST_BOOKING_PROMO.percentOff}%`,
      badge: `-${FIRST_BOOKING_PROMO.percentOff}% առաջին ամրագրման համար`,
      title: `-${FIRST_BOOKING_PROMO.percentOff}% առաջին ամրագրման համար`,
      description: 'Ակցիոն գինը ցուցադրվում է միայն ֆրոնտում։ Վերջնական արժեքը հաստատում է սրահի ադմինիստրատորը։',
      summary: 'Ակցիոն գին առաջին ամրագրման համար',
      disclaimer: 'Զեղչը գործում է առաջին ամրագրման համար։ Վերջնական արժեքը հաստատում է սրահը։',
      modalTitle: 'Freya Beauty Salon-ի նոր հյուրերի համար',
      modalLead: `-${FIRST_BOOKING_PROMO.percentOff}% առաջին ամրագրման համար`,
      modalDescription: 'Եթե եկել եք որոնումից, գրանցվեք կամ անցեք ամրագրման էջ և ստացեք առաջին այցի ակցիոն առաջարկը։',
      modalPrimary: 'Անցնել ամրագրմանը',
      modalSecondary: 'Գրանցվել',
    }
  })

  const hydrateTrafficSignals = () => {
    if (!import.meta.client) return

    try {
      const referrer = document.referrer.toLowerCase()
      searchReferrer.value = /(google|yandex|bing|duckduckgo)\./.test(referrer)
    }
    catch {
      searchReferrer.value = false
    }
  }

  const applyDiscount = (amount: number) => Math.max(0, Math.round(amount * (100 - FIRST_BOOKING_PROMO.percentOff) / 100))

  const promoPricingFor = (service: ServiceLike, master?: Master | null) => {
    const pricing = resolvePriceRange(service, master)
    const promoFrom = applyDiscount(pricing.priceFrom)
    const promoTo = applyDiscount(pricing.priceTo)

    return {
      ...pricing,
      promoFrom,
      promoTo,
      promoHasRange: pricing.hasRange && promoTo !== promoFrom,
      originalLabel: pricing.hasRange
        ? `${formatAmd(pricing.priceFrom)} - ${formatAmd(pricing.priceTo)}`
        : formatAmd(pricing.priceFrom),
      promoLabel: pricing.hasRange && promoTo !== promoFrom
        ? `${formatAmd(promoFrom)} - ${formatAmd(promoTo)}`
        : formatAmd(promoFrom),
    }
  }

  return {
    promoConfig: FIRST_BOOKING_PROMO,
    isAdTraffic,
    isSearchTraffic,
    isVisible,
    promoCopy,
    promoPricingFor,
    applyDiscount,
    hydrateTrafficSignals,
  }
}
