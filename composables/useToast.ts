type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: ToastType
}

export const useToast = () => {
  const toasts = useState<ToastMessage[]>('toasts', () => [])

  const push = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    toasts.value.push({ ...toast, id })

    setTimeout(() => {
      toasts.value = toasts.value.filter((item) => item.id !== id)
    }, 4200)
  }

  const remove = (id: string) => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  return {
    toasts,
    push,
    remove,
  }
}
