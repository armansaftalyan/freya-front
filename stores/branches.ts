import type { ApiListResponse } from '~/types/api'
import type { Branch } from '~/types/branch'

export const useBranchesStore = defineStore('branchesStore', () => {
  const branches = ref<Branch[]>([])
  const loading = ref(false)
  const api = useApi()

  const fetchBranches = async () => {
    loading.value = true
    try {
      const response = await api.get<ApiListResponse<Branch>>('/branches')
      branches.value = response.data
    }
    finally {
      loading.value = false
    }
  }

  return {
    branches,
    loading,
    fetchBranches,
  }
})
