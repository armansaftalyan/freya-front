export const useSiteMeta = () => {
  const config = useRuntimeConfig()

  const siteUrl = computed(() => String(config.public.siteUrl || '').replace(/\/+$/, ''))
  const logoUrl = computed(() => `${siteUrl.value}/logo.png`)
  const defaultImageUrl = computed(() => `${siteUrl.value}/logo.png`)

  const salonName = 'Freya Beauty Salon'
  const telephone = '+374 44 733773'
  const email = 'support@freyabeauty.am'
  const address = {
    '@type': 'PostalAddress',
    streetAddress: '21 Azatutyan',
    addressLocality: 'Yerevan',
    addressCountry: 'AM',
  }

  const sameAs = [
    'https://t.me/freyabeauty',
  ]

  return {
    salonName,
    telephone,
    email,
    address,
    sameAs,
    siteUrl,
    logoUrl,
    defaultImageUrl,
  }
}
