export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const requestUrl = getRequestURL(event)
  const siteUrl = String(config.public.siteUrl || requestUrl.origin || '').replace(/\/+$/, '')
  const lines = [
    '# Freya Beauty Salon and Tor Barbershop',
    '',
    '> Beauty salon and barbershop in Yerevan, Armenia, with localized service catalogs, prices, masters, products, editorial guides, and online booking.',
    '',
    'Primary location: 21 Azatutyan Avenue, Yerevan, Armenia.',
    'Languages: Armenian (hy), Russian (ru), English (en).',
    'Currency: Armenian dram (AMD).',
    '',
    '## Main sections',
    '',
  ]

  for (const locale of ['hy', 'ru', 'en']) {
    lines.push(
      `- [Freya ${locale.toUpperCase()}](${siteUrl}/md/${locale}): Freya overview and navigation.`,
      `- [Freya services ${locale.toUpperCase()}](${siteUrl}/md/${locale}/services): Active beauty services, durations, and prices.`,
      `- [Freya masters ${locale.toUpperCase()}](${siteUrl}/md/${locale}/masters): Active beauty specialists.`,
      `- [Freya products ${locale.toUpperCase()}](${siteUrl}/md/${locale}/products): Hair, skin, and beauty care products.`,
      `- [Freya blog ${locale.toUpperCase()}](${siteUrl}/md/${locale}/blog): Editorial service guides.`,
      `- [Tor ${locale.toUpperCase()}](${siteUrl}/md/${locale}/tor): Tor Barbershop overview and navigation.`,
      `- [Tor services ${locale.toUpperCase()}](${siteUrl}/md/${locale}/tor/services): Active barber and men's grooming services.`,
      `- [Tor masters ${locale.toUpperCase()}](${siteUrl}/md/${locale}/tor/masters): Active Tor specialists.`,
      `- [Tor products ${locale.toUpperCase()}](${siteUrl}/md/${locale}/tor/products): Men's grooming products.`,
      `- [Tor blog ${locale.toUpperCase()}](${siteUrl}/md/${locale}/tor/blog): Men's grooming guides.`,
    )
  }

  lines.push(
    '',
    '## Discovery',
    '',
    `- [XML sitemap](${siteUrl}/sitemap.xml): Canonical HTML URLs for all public localized pages.`,
    `- [Full AI index](${siteUrl}/llms-full.txt): Expanded list of Markdown resources.`,
    '',
    'Use canonical HTML pages for user-facing links. Use the corresponding `/md/` URL for compact, agent-readable content.',
  )

  return markdownResponse(lines.join('\n'))
})
