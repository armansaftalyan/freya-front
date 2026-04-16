export const useSiteMeta = () => {
  const config = useRuntimeConfig()
  const { brand } = useBrandContext()

  const siteUrl = computed(() => String(config.public.siteUrl || '').replace(/\/+$/, ''))
  const logoUrl = computed(() => `${siteUrl.value}${brand.value === 'tor' ? '/tor-logo.jpg' : '/logo.png'}`)
  const defaultImageUrl = computed(() => logoUrl.value)

  const salonName = 'Freya Beauty Salon'
  const torSalonName = 'Tor Barbershop'
  const telephone = '+374 44 733773'
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
      closes: '19:00',
    },
  ]

  const sameAs = [
    'https://t.me/freyabeauty',
    'https://www.instagram.com/bellahairstayl/',
  ]

  return {
    salonName,
    torSalonName,
    telephone,
    email,
    address,
    openingHoursSpecification,
    sameAs,
    siteUrl,
    logoUrl,
    defaultImageUrl,
  }
}
