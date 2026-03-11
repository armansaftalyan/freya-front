import type { ApiItemResponse, ApiListResponse } from '~/types/api'
import type { GiftCard, GiftCardTransaction } from '~/types/gift-card'

export const useGiftCardsStore = defineStore('giftCardsStore', () => {
  const api = useApi()
  const cards = ref<GiftCard[]>([])
  const transactions = ref<GiftCardTransaction[]>([])
  const loading = ref(false)

  const fetchMine = async () => {
    loading.value = true
    try {
      const response = await api.get<ApiListResponse<GiftCard>>('/gift-cards/my')
      cards.value = response.data
    }
    finally {
      loading.value = false
    }
  }

  const fetchCard = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get<ApiItemResponse<GiftCard>>(`/gift-cards/${id}`)
      return response.data
    }
    finally {
      loading.value = false
    }
  }

  const fetchTransactions = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get<ApiListResponse<GiftCardTransaction>>(`/gift-cards/${id}/transactions`)
      transactions.value = response.data
      return response.data
    }
    finally {
      loading.value = false
    }
  }

  return {
    cards,
    transactions,
    loading,
    fetchMine,
    fetchCard,
    fetchTransactions,
  }
})
