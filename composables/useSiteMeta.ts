export const useSiteMeta = () => {
  const config = useRuntimeConfig()
  const { brand } = useBrandContext()

  const siteUrl = computed(() => String(config.public.siteUrl || '').replace(/\/+$/, ''))
  const logoUrl = computed(() => `${siteUrl.value}${brand.value === 'tor' ? '/tor-logo.jpg' : '/logo.png'}`)
  const defaultImageUrl = computed(() => logoUrl.value)

  const salonName = 'Freya Beauty Salon'
  const torSalonName = 'Tor Barbershop'
  const telephone = '+374 44 733773'
  const telephoneHref = 'tel:+37444733773'
  const whatsappUrl = 'https://wa.me/37444733773'
  const telegramUrl = 'https://t.me/freyabeautyam'
  const email = 'support@freyabeauty.am'
  const address = {
    '@type': 'PostalAddress',
    streetAddress: '21 Azatutyan',
    addressLocality: 'Yerevan',
    addressCountry: 'AM',
  }
  const openingHoursSpecification = [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'https://schema.org/Monday',
        'https://schema.org/Tuesday',
        'https://schema.org/Wednesday',
        'https://schema.org/Thursday',
        'https://schema.org/Friday',
        'https://schema.org/Saturday',
        'https://schema.org/Sunday',
      ],
      opens: '10:00',
      closes: '20:00',
    },
  ]

  const sameAs = [
    telegramUrl,
    whatsappUrl,
    'https://www.instagram.com/bellahairstayl/',
  ]

  return {
    salonName,
    torSalonName,
    telephone,
    telephoneHref,
    whatsappUrl,
    telegramUrl,
    email,
    address,
    openingHoursSpecification,
    sameAs,
    siteUrl,
    logoUrl,
    defaultImageUrl,
  }
}
