export const useStructuredData = (schema: Record<string, any> | (() => Record<string, any> | null) | null) => {
  useHead(() => {
    const payload = typeof schema === 'function' ? schema() : schema

    if (!payload) {
      return {}
    }

    return {
      script: [
        {
          key: 'structured-data',
          type: 'application/ld+json',
          children: JSON.stringify(payload),
        },
      ],
    }
  })
}
