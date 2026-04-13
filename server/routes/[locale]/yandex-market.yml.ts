import { createError, getRouterParam } from 'h3'
import { feedXml, getFeedMeta, loadFeedCatalogByLocale, type FeedLocale } from '../../utils/catalogFeeds'

const isFeedLocale = (value: string): value is FeedLocale => value === 'hy' || value === 'ru' || value === 'en'

export default defineEventHandler(async (event) => {
  const localeParam = String(getRouterParam(event, 'locale') || '').trim()
  if (!isFeedLocale(localeParam)) {
    throw createError({ statusCode: 404, statusMessage: 'Feed locale not found' })
  }

  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || '').replace(/\/+$/, '')
  const apiBase = String(config.public.apiBase || '').replace(/\/+$/, '')

  if (!siteUrl || !apiBase) {
    throw createError({ statusCode: 500, statusMessage: 'Feed config is incomplete' })
  }

  const items = await loadFeedCatalogByLocale(apiBase, siteUrl, localeParam)
  const generatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const escape = feedXml.escape
  const meta = getFeedMeta(localeParam)

  const categories = Array.from(new Map(
    items.map(item => [item.categoryExternalId, { id: item.categoryExternalId, name: item.categoryName }]),
  ).values())

  const offers = items
    .map(item => `    <offer id="${escape(item.id)}" available="${item.yandexAvailable ? 'true' : 'false'}">
      <name>${escape(item.title)}</name>
      <vendor>${escape(item.vendor || item.storeName)}</vendor>
      <url>${escape(item.link)}</url>
      <price>${escape(item.price)}</price>
      ${item.salePrice ? `<oldprice>${escape(item.oldPrice)}</oldprice>` : ''}
      <currencyId>${item.currency}</currencyId>
      <categoryId>${escape(item.categoryExternalId)}</categoryId>
      ${item.imageLink ? `<picture>${escape(item.imageLink)}</picture>` : ''}
      <description>${escape(item.description)}</description>
      <pickup>true</pickup>
      <delivery>true</delivery>
      ${item.sku ? `<vendorCode>${escape(item.sku)}</vendorCode>` : ''}
    </offer>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${escape(generatedAt)}">
  <shop>
    <name>${escape(meta.storeName)}</name>
    <company>${escape(meta.company)}</company>
    <url>${escape(siteUrl)}</url>
    <currencies>
      <currency id="AMD" rate="1"/>
    </currencies>
    <categories>
${categories.map(category => `      <category id="${escape(category.id)}">${escape(category.name)}</category>`).join('\n')}
    </categories>
    <offers>
${offers}
    </offers>
  </shop>
</yml_catalog>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
