import type { CartItem, Product } from '~/types/product'

export const useCartStore = defineStore('cartStore', () => {
  const storage = useCookie<CartItem[] | undefined>('freya_cart_v1', {
    sameSite: 'lax',
  })

  const items = computed<CartItem[]>({
    get: () => Array.isArray(storage.value) ? storage.value : [],
    set: (value) => {
      storage.value = value.length ? value : undefined
    },
  })

  const itemsCount = computed(() => items.value.reduce((sum, item) => sum + Math.max(1, item.quantity || 1), 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + ((item.product.price || 0) * Math.max(1, item.quantity || 1)), 0))

  const addItem = (product: Product, quantity = 1) => {
    const normalizedQuantity = Math.max(1, Number(quantity || 1))
    const next = [...items.value]
    const existing = next.find(item => item.product.id === product.id)

    if (existing) {
      existing.quantity = Math.min(50, existing.quantity + normalizedQuantity)
    } else {
      next.push({ product, quantity: Math.min(50, normalizedQuantity) })
    }

    items.value = next
  }

  const getItemQuantity = (productId: number) => {
    return items.value.find(item => item.product.id === productId)?.quantity ?? 0
  }

  const syncProducts = (products: Product[]) => {
    if (!products.length) return

    const productsMap = new Map(products.map(product => [product.id, product]))
    items.value = items.value.map((item) => {
      const localizedProduct = productsMap.get(item.product.id)

      if (!localizedProduct) {
        return item
      }

      return {
        ...item,
        product: {
          ...item.product,
          ...localizedProduct,
        },
      }
    })
  }

  const decreaseItem = (productId: number, quantity = 1) => {
    const normalizedQuantity = Math.max(1, Number(quantity || 1))
    const next = items.value
      .map((item) => {
        if (item.product.id !== productId) return item

        return {
          ...item,
          quantity: item.quantity - normalizedQuantity,
        }
      })
      .filter(item => item.quantity > 0)

    items.value = next
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const normalizedQuantity = Math.max(1, Math.min(50, Number(quantity || 1)))
    items.value = items.value.map(item => item.product.id === productId ? { ...item, quantity: normalizedQuantity } : item)
  }

  const removeItem = (productId: number) => {
    items.value = items.value.filter(item => item.product.id !== productId)
  }

  const clear = () => {
    items.value = []
  }

  return {
    items,
    itemsCount,
    totalPrice,
    addItem,
    getItemQuantity,
    syncProducts,
    decreaseItem,
    updateQuantity,
    removeItem,
    clear,
  }
})
