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
  const escape = feedXml.escape
  const meta = getFeedMeta(localeParam)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escape(meta.title)}</title>
    <link>${escape(siteUrl)}</link>
    <description>${escape(meta.description)}</description>
${items.map(item => `    <item>
      <g:id>${escape(item.id)}</g:id>
      <title>${escape(item.title)}</title>
      <description>${escape(item.description)}</description>
      <link>${escape(item.link)}</link>
      ${item.imageLink ? `<g:image_link>${escape(item.imageLink)}</g:image_link>` : ''}
      <g:availability>${escape(item.availability)}</g:availability>
      <g:price>${escape(`${item.oldPrice || item.price} ${item.currency}`)}</g:price>
      ${item.salePrice ? `<g:sale_price>${escape(`${item.salePrice} ${item.currency}`)}</g:sale_price>` : ''}
      <g:condition>new</g:condition>
      <g:brand>${escape(item.vendor || item.storeName)}</g:brand>
      <g:product_type>${escape(item.categoryName)}</g:product_type>
      <g:google_product_category>${escape('Health & Beauty > Personal Care')}</g:google_product_category>
      <g:identifier_exists>${item.gtin || item.mpn || item.sku ? 'yes' : 'no'}</g:identifier_exists>
      ${item.mpn ? `<g:mpn>${escape(item.mpn)}</g:mpn>` : ''}
      ${item.sku ? `<g:sku>${escape(item.sku)}</g:sku>` : ''}
      <g:custom_label_0>${escape(item.customLabel0)}</g:custom_label_0>
      <g:custom_label_1>${escape(item.customLabel1)}</g:custom_label_1>
    </item>`).join('\n')}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
