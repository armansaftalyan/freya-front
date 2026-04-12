type SeoIntentKeywordOptions = {
  brand: 'freya' | 'tor'
  kind: 'service-category' | 'service-detail' | 'product-category' | 'product-detail'
  slug?: string | null
  name?: string | null
  categorySlug?: string | null
}

const hasAny = (value: string, patterns: string[]) => patterns.some(pattern => value.includes(pattern))

export const useSeoIntentKeywords = (options: SeoIntentKeywordOptions) => {
  const source = `${options.slug || ''} ${options.name || ''} ${options.categorySlug || ''}`.toLowerCase()

  const generic = options.brand === 'tor'
    ? ['barbershop yerevan', 'men grooming', 'muzhskaya strizhka', 'beard trim', 'moruq']
    : ['beauty salon yerevan', 'salon krasoty yerevan', 'manikyur', 'pedikyur', 'massazh', 'gexeckutyan srah yerevan']

  const groups: string[][] = []

  if (hasAny(source, ['massage', 'massazh', 'anti-cellulite', 'anti cellulite', 'lymph', 'drainage', 'relax', 'therapeutic', 'back-', 'arm-', 'leg-', 'body-massage'])) {
    groups.push(['massazh', 'massage yerevan', 'anti cellulite massage', 'anticellyulitniy massazh', 'mersum'])
  }

  if (hasAny(source, ['nails', 'manicure', 'pedicure', 'gel-polish', 'gel-removal', 'nail'])) {
    groups.push(['manikyur', 'pedikyur', 'gel lak', 'manicure yerevan', 'pedicure yerevan', 'matnahardarum'])
  }

  if (hasAny(source, ['elos', 'epilation', 'wax', 'bikini', 'chin', 'upper-lip', 'full-body'])) {
    groups.push(['epilyaciya', 'elos', 'waxing', 'epilation yerevan', 'epilyacia'])
  }

  if (hasAny(source, ['hair', 'keratin', 'botox', 'brazilian', 'blowout', 'color', 'root-coloring', 'repair', 'shampoo', 'mask', 'argan', 'leave-in'])) {
    groups.push(['keratin', 'botoks volos', 'okrashivanie', 'hair treatment', 'maska dlya volos', 'mazeri xnamq'])
  }

  if (hasAny(source, ['cosmetology', 'face', 'serum', 'cream', 'glass-skin', 'lifting', 'cleansing', 'care-program'])) {
    groups.push(['kosmetolog', 'face care', 'serum for face', 'krem dlya lica', 'cosmetology yerevan', 'demqi xnamq'])
  }

  if (hasAny(source, ['brows', 'lashes', 'makeup'])) {
    groups.push(['brows', 'lashes', 'brovi', 'resnicy', 'honqer u resnicner'])
  }

  if (options.brand === 'tor' && hasAny(source, ['beard', 'shaving', 'styling', 'pomade', 'foam', 'beard-wash', 'classic-pomade', 'matte-clay'])) {
    groups.push(['beard care', 'oil dlya borody', 'pomada dlya volos', 'beard wash', 'styling paste', 'moruqi xnamq'])
  }

  if (options.brand === 'freya' && hasAny(source, ['skin-body', 'spa-home', 'body', 'scrub', 'lotion', 'hand-ritual'])) {
    groups.push(['body scrub', 'scrub dlya tela', 'beauty products yerevan', 'body care', 'marmini xnamq'])
  }

  const merged = [...generic, ...groups.flat()]
  return [...new Set(merged)]
}
