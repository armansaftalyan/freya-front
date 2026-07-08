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
  const instagramUrl = computed(() => brand.value === 'tor'
    ? 'https://www.instagram.com/torbarbershop.am/'
    : 'https://www.instagram.com/freya_beauty.am/')
  const twoGisUrl = computed(() => brand.value === 'tor'
    ? 'https://2gis.am/ru/yerevan/inside/70030076748432267/firm/70000001114757930/44.526922%2C40.207028?m=44.526983%2C40.207175%2F19.48'
    : 'https://2gis.am/ru/yerevan/inside/70030076748432267/firm/70000001088976948/44.526922%2C40.207028?m=44.526983%2C40.207175%2F19.48')
  const yandexMapsUrl = computed(() => brand.value === 'tor'
    ? 'https://yandex.ru/maps/?oid=157536408300&ol=biz'
    : 'https://yandex.ru/maps/?oid=161971752484&ol=biz')
  const email = 'support@freyabeauty.am'
  const geoCoordinates = computed(() => brand.value === 'tor'
    ? {
        '@type': 'GeoCoordinates',
        latitude: 40.207028,
        longitude: 44.526922,
      }
    : {
        '@type': 'GeoCoordinates',
        latitude: 40.2069962,
        longitude: 44.5268533,
      })
  const googleMapsUrl = computed(() => {
    if (brand.value === 'tor') {
      return 'https://www.google.com/maps/place/Tor+Barbershop/data=!4m2!3m1!1s0x0:0x23fa938c95d744af'
    }

    return 'https://www.google.com/maps/place/Freya/@40.2069962,44.5268533,845m/data=!3m2!1e3!4b1!4m6!3m5!1s0x406aa2cccc01b45d:0x3d92077da3371274!8m2!3d40.2069962!4d44.5268533!16s%2Fg%2F11d_d46mzb'
  })
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

  const sameAs = computed(() => [
    instagramUrl.value,
    twoGisUrl.value,
    googleMapsUrl.value,
    yandexMapsUrl.value,
  ])
  const contactPoint = computed(() => [
    {
      '@type': 'ContactPoint',
      telephone,
      contactType: 'customer service',
      availableLanguage: ['hy', 'ru', 'en'],
      url: whatsappUrl,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['hy', 'ru', 'en'],
      url: telegramUrl,
    },
  ])

  return {
    salonName,
    torSalonName,
    telephone,
    telephoneHref,
    whatsappUrl,
    telegramUrl,
    instagramUrl,
    twoGisUrl,
    yandexMapsUrl,
    email,
    geoCoordinates,
    googleMapsUrl,
    address,
    openingHoursSpecification,
    sameAs,
    contactPoint,
    siteUrl,
    logoUrl,
    defaultImageUrl,
  }
}
