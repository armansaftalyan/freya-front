import type { Master, MasterService } from '~/types/master'
import type { Service } from '~/types/service'

type ServiceLike = Pick<Service, 'id' | 'price_from' | 'price_to'>

export const useServicePricing = () => {
  const { formatAmd } = useCurrency()
  const { t } = useLocale()

  const masterServiceFor = (serviceId: number, master?: Master | null): MasterService | undefined => {
    return master?.services?.find(item => item.id === serviceId)
  }

  const resolvePriceRange = (service: ServiceLike, master?: Master | null) => {
    const masterService = masterServiceFor(service.id, master)
    const priceFrom = Number(masterService?.price_from ?? service.price_from ?? 0)
    const fallbackPriceTo = masterService ? masterService.price_from : service.price_from
    const priceTo = Number(masterService?.price_to ?? service.price_to ?? fallbackPriceTo ?? priceFrom)

    return {
      priceFrom,
      priceTo,
      hasRange: priceTo > 0 && priceTo !== priceFrom,
      isMasterPrice: Boolean(masterService),
    }
  }

  const formatPriceLabel = (service: ServiceLike, master?: Master | null) => {
    const pricing = resolvePriceRange(service, master)

    if (!pricing.hasRange) {
      return formatAmd(pricing.priceFrom)
    }

    return `${t('servicesPage.priceFrom')} ${formatAmd(pricing.priceFrom)} ${t('servicesPage.priceTo')} ${formatAmd(pricing.priceTo)}`
  }

  return {
    masterServiceFor,
    resolvePriceRange,
    formatPriceLabel,
  }
}
