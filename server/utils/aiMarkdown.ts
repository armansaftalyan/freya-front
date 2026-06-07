type Locale = 'hy' | 'ru' | 'en'
type Brand = 'freya' | 'tor'

type ApiListResponse<T> = { data: T[] }
type ApiItemResponse<T> = { data: T }

type Category = {
  id: number
  name: string
  slug: string
  description?: string | null
  is_active?: boolean
}

type Service = {
  id: number
  category_id: number
  name: string
  slug: string
  description?: string | null
  duration_minutes?: number | null
  price_from?: number | string | null
  price_to?: number | string | null
  is_active?: boolean
}

type Product = {
  id: number
  category_id: number
  name: string
  slug: string
  description?: string | null
  line_brand?: string | null
  volume_label?: string | null
  ingredients?: string | null
  usage?: string | null
  price?: number | string | null
  is_active?: boolean
}

type BlogArticle = {
  title: string
  slug: string
  excerpt?: string | null
  body_html?: string | null
  published_at?: string | null
  category?: { name: string } | null
  faq_items?: Array<{ question: string, answer: string }>
  related_services?: Array<{
    name: string
    slug: string
    category_slug: string
    price_from?: number | string | null
    price_to?: number | string | null
    duration_minutes?: number | null
  }>
}

type Master = {
  name: string
  slug?: string | null
  bio?: string | null
  experience_duration_years?: number | null
  specialties?: string[]
  languages?: string[]
  services?: Array<{
    name: string
    category_name?: string | null
    duration_minutes?: number | null
    price_from?: number | string | null
    price_to?: number | string | null
  }>
  is_active?: boolean
}

const copy = {
  hy: {
    location: 'Երևան, Ազատության պողոտա 21',
    booking: 'Առցանց ամրագրում',
    services: 'Ծառայություններ',
    products: 'Ապրանքներ',
    masters: 'Մասնագետներ',
    blog: 'Բլոգ',
    duration: 'Տևողություն',
    price: 'Գին',
    minutes: 'րոպե',
    years: 'տարի փորձ',
    book: 'Ամրագրել',
    contact: 'Կապ',
  },
  ru: {
    location: 'Ереван, проспект Азатутян, 21',
    booking: 'Онлайн-запись',
    services: 'Услуги',
    products: 'Товары',
    masters: 'Мастера',
    blog: 'Блог',
    duration: 'Длительность',
    price: 'Цена',
    minutes: 'мин',
    years: 'лет опыта',
    book: 'Записаться',
    contact: 'Контакты',
  },
  en: {
    location: '21 Azatutyan Avenue, Yerevan',
    booking: 'Online booking',
    services: 'Services',
    products: 'Products',
    masters: 'Masters',
    blog: 'Blog',
    duration: 'Duration',
    price: 'Price',
    minutes: 'min',
    years: 'years of experience',
    book: 'Book online',
    contact: 'Contact',
  },
} as const

const markdownEscape = (value: unknown) => String(value ?? '')
  .replace(/\r\n?/g, '\n')
  .replace(/[ \t]+\n/g, '\n')
  .trim()

const decodeHtml = (value: string) => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#0?39;/gi, '\'')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))

export const htmlToMarkdown = (value?: string | null) => {
  if (!value) return ''

  return decodeHtml(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|section|article|ul|ol)>/gi, '\n\n')
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em\b[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i\b[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<[^>]+>/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const numericPrice = (value?: number | string | null) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const formatAmd = (value?: number | string | null) => {
  const parsed = numericPrice(value)
  return parsed === null ? '' : `${new Intl.NumberFormat('en-US').format(parsed)} AMD`
}

const formatPrice = (from?: number | string | null, to?: number | string | null) => {
  const parsedFrom = numericPrice(from)
  const parsedTo = numericPrice(to)
  if (parsedFrom === null) return ''
  if (parsedTo !== null && parsedTo > parsedFrom) return `${formatAmd(parsedFrom)}-${formatAmd(parsedTo)}`
  return formatAmd(parsedFrom)
}

const link = (label: string, url: string) => `- [${markdownEscape(label)}](${url})`

const apiFetch = <T>(apiBase: string, path: string, locale: Locale, query: Record<string, string | number> = {}) =>
  $fetch<T>(`${apiBase}${path}`, {
    query: { ...query, lang: locale },
    headers: {
      Accept: 'application/json',
      'Accept-Language': locale,
      'X-Locale': locale,
    },
  })

const catalogPath = (brand: Brand, section: string) => brand === 'tor' ? `/tor/${section}` : `/${section}`

const absolute = (siteUrl: string, locale: Locale, path: string) =>
  `${siteUrl}/${locale}${path === '/' ? '' : path}`

export const parseMarkdownPath = (rawPath: string) => {
  const segments = rawPath.replace(/\.md$/, '').split('/').filter(Boolean)
  const locale = (['hy', 'ru', 'en'].includes(segments[0]) ? segments.shift() : 'hy') as Locale
  const brand: Brand = segments[0] === 'tor' ? (segments.shift(), 'tor') : 'freya'

  return { locale, brand, segments }
}

export const buildMarkdownPage = async (
  apiBase: string,
  siteUrl: string,
  rawPath: string,
): Promise<string | null> => {
  const { locale, brand, segments } = parseMarkdownPath(rawPath)
  const t = copy[locale]
  const brandName = brand === 'tor' ? 'Tor Barbershop' : 'Freya Beauty Salon'
  const brandRoot = brand === 'tor' ? '/tor' : ''
  const canonicalPath = `/${locale}${brandRoot}${segments.length ? `/${segments.join('/')}` : ''}`
  const header = [
    `# ${brandName}`,
    '',
    t.location,
    '',
    `Canonical: ${siteUrl}${canonicalPath}`,
    '',
  ]

  if (segments.length === 0) {
    return [
      ...header,
      brand === 'tor'
        ? 'Men\'s haircuts, beard care, grooming services, products, and online booking in Yerevan.'
        : 'Beauty salon services, professional masters, care products, gift cards, and online booking in Yerevan.',
      '',
      `## ${t.booking}`,
      '',
      link(t.book, absolute(siteUrl, locale, `${brandRoot}/booking`)),
      link(t.contact, absolute(siteUrl, locale, `${brandRoot}/contacts`)),
      '',
      `## ${t.services}`,
      '',
      link(t.services, absolute(siteUrl, locale, catalogPath(brand, 'services'))),
      link(t.masters, absolute(siteUrl, locale, catalogPath(brand, 'masters'))),
      link(t.products, absolute(siteUrl, locale, catalogPath(brand, 'products'))),
      link(t.blog, absolute(siteUrl, locale, catalogPath(brand, 'blog'))),
    ].join('\n')
  }

  const section = segments[0]
  if (!['services', 'products', 'masters', 'blog'].includes(section)) {
    return null
  }

  if (section === 'services') {
    const [categoriesResponse, servicesResponse] = await Promise.all([
      apiFetch<ApiListResponse<Category>>(apiBase, '/categories', locale, { brand }),
      apiFetch<ApiListResponse<Service>>(apiBase, '/services', locale, { brand }),
    ])
    const categories = categoriesResponse.data.filter(item => item.is_active !== false)
    const services = servicesResponse.data.filter(item => item.is_active !== false)

    if (segments.length === 1) {
      return [
        ...header,
        `## ${t.services}`,
        '',
        ...categories.flatMap(category => [
          `### ${markdownEscape(category.name)}`,
          '',
          ...(category.description ? [markdownEscape(category.description), ''] : []),
          ...services
            .filter(service => service.category_id === category.id)
            .map(service => link(
              `${service.name} - ${formatPrice(service.price_from, service.price_to)}`,
              `${absolute(siteUrl, locale, catalogPath(brand, 'services'))}/${category.slug}/${service.slug}`,
            )),
          '',
        ]),
      ].join('\n')
    }

    const category = categories.find(item => item.slug === segments[1])
    if (!category) return null

    if (segments.length === 2) {
      return [
        `# ${markdownEscape(category.name)}`,
        '',
        category.description ? markdownEscape(category.description) : '',
        '',
        ...services
          .filter(service => service.category_id === category.id)
          .map(service => link(
            `${service.name} - ${formatPrice(service.price_from, service.price_to)}`,
            `${absolute(siteUrl, locale, catalogPath(brand, 'services'))}/${category.slug}/${service.slug}`,
          )),
      ].join('\n')
    }

    const service = services.find(item => item.category_id === category.id && item.slug === segments[2])
    if (!service) return null

    return [
      `# ${markdownEscape(service.name)}`,
      '',
      `Canonical: ${siteUrl}${canonicalPath}`,
      '',
      service.description ? markdownEscape(service.description) : '',
      '',
      `- ${t.duration}: ${service.duration_minutes || 0} ${t.minutes}`,
      `- ${t.price}: ${formatPrice(service.price_from, service.price_to)}`,
      `- ${t.location}`,
      '',
      link(t.book, `${absolute(siteUrl, locale, `${brandRoot}/booking`)}?service_id=${service.id}`),
    ].join('\n')
  }

  if (section === 'products') {
    const [categoriesResponse, productsResponse] = await Promise.all([
      apiFetch<ApiListResponse<Category>>(apiBase, '/product-categories', locale, { brand }),
      apiFetch<ApiListResponse<Product>>(apiBase, '/products', locale, { brand }),
    ])
    const categorySlugById = new Map(
      categoriesResponse.data
        .filter(item => item.is_active !== false)
        .map(item => [item.id, item.slug]),
    )
    const products = productsResponse.data.filter(item => item.is_active !== false)

    if (segments.length === 1) {
      return [
        ...header,
        `## ${t.products}`,
        '',
        ...products.map(product => link(
          `${product.name} - ${formatAmd(product.price)}`,
          `${absolute(siteUrl, locale, catalogPath(brand, 'products'))}/${categorySlugById.get(product.category_id) || 'catalog'}/${product.slug}`,
        )),
      ].join('\n')
    }

    const product = products.find(item => item.slug === segments.at(-1))
    if (!product) return null

    return [
      `# ${markdownEscape(product.name)}`,
      '',
      `Canonical: ${siteUrl}${canonicalPath}`,
      '',
      product.description ? markdownEscape(product.description) : '',
      '',
      `- ${t.price}: ${formatAmd(product.price)}`,
      ...(product.line_brand ? [`- Brand: ${markdownEscape(product.line_brand)}`] : []),
      ...(product.volume_label ? [`- Volume: ${markdownEscape(product.volume_label)}`] : []),
      ...(product.ingredients ? ['', '## Ingredients', '', markdownEscape(product.ingredients)] : []),
      ...(product.usage ? ['', '## Usage', '', markdownEscape(product.usage)] : []),
    ].join('\n')
  }

  if (section === 'blog') {
    if (segments.length === 1) {
      const response = await apiFetch<ApiListResponse<BlogArticle>>(apiBase, '/blog', locale, { brand, limit: 100 })
      return [
        ...header,
        `## ${t.blog}`,
        '',
        ...response.data.map(article => link(
          article.title,
          `${absolute(siteUrl, locale, catalogPath(brand, 'blog'))}/${article.slug}`,
        )),
      ].join('\n')
    }

    const response = await apiFetch<ApiItemResponse<BlogArticle>>(apiBase, `/blog/${segments[1]}`, locale, { brand })
    const article = response.data
    return [
      `# ${markdownEscape(article.title)}`,
      '',
      `Canonical: ${siteUrl}${canonicalPath}`,
      '',
      ...(article.published_at ? [`Published: ${article.published_at}`, ''] : []),
      ...(article.excerpt ? [markdownEscape(article.excerpt), ''] : []),
      htmlToMarkdown(article.body_html),
      ...(article.faq_items?.length
        ? ['', '## FAQ', '', ...article.faq_items.flatMap(item => [
            `### ${markdownEscape(item.question)}`,
            '',
            markdownEscape(item.answer),
            '',
          ])]
        : []),
    ].join('\n')
  }

  if (segments.length === 1) {
    const response = await apiFetch<ApiListResponse<Master>>(apiBase, '/masters', locale, { brand })
    return [
      ...header,
      `## ${t.masters}`,
      '',
      ...response.data
        .filter(master => master.is_active !== false && master.slug)
        .map(master => link(
          master.name,
          `${absolute(siteUrl, locale, catalogPath(brand, 'masters'))}/${master.slug}`,
        )),
    ].join('\n')
  }

  const response = await apiFetch<ApiItemResponse<Master>>(apiBase, `/masters/${segments[1]}`, locale, { brand })
  const master = response.data
  return [
    `# ${markdownEscape(master.name)}`,
    '',
    `Canonical: ${siteUrl}${canonicalPath}`,
    '',
    master.bio ? markdownEscape(master.bio) : '',
    '',
    ...(typeof master.experience_duration_years === 'number'
      ? [`- ${master.experience_duration_years} ${t.years}`]
      : []),
    ...(master.specialties?.length ? [`- Specialties: ${master.specialties.join(', ')}`] : []),
    ...(master.languages?.length ? [`- Languages: ${master.languages.join(', ')}`] : []),
    ...(master.services?.length
      ? ['', `## ${t.services}`, '', ...master.services.map(service =>
          `- ${markdownEscape(service.name)} - ${formatPrice(service.price_from, service.price_to)}`
        )]
      : []),
  ].join('\n')
}

export const markdownResponse = (body: string) => new Response(`${body.trim()}\n`, {
  headers: {
    'content-type': 'text/markdown; charset=utf-8',
    'cache-control': 'public, max-age=900, s-maxage=3600, stale-while-revalidate=86400',
    'x-robots-tag': 'index, follow',
  },
})
