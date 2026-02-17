export interface ParsedApiError {
  message: string
  fieldErrors: Record<string, string>
}

const fieldErrorKeyMap: Record<string, string> = {
  email: 'common.emailInvalid',
  password: 'common.passwordRequired',
  name: 'common.nameRequired',
  phone: 'common.phoneShort',
  branch_id: 'booking.errors.branch',
  category_id: 'booking.errors.category',
  service_id: 'booking.errors.service',
  master_id: 'booking.errors.master',
  start_at: 'booking.errors.slot',
  date: 'booking.errors.date',
  comment: 'booking.errors.comment',
}

const statusKeyMap: Record<number, string> = {
  401: 'common.backend.unauthorized',
  403: 'common.backend.forbidden',
  404: 'common.backend.notFound',
  422: 'common.backend.validationFailed',
  429: 'common.backend.tooManyRequests',
  500: 'common.backend.serverError',
  502: 'common.backend.badGateway',
  503: 'common.backend.serviceUnavailable',
}

const mapMessageToKey = (message: string): string | null => {
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid') && normalized.includes('credential')) return 'common.backend.invalidCredentials'
  if (normalized.includes('unauth')) return 'common.backend.unauthorized'
  if (normalized.includes('forbidden')) return 'common.backend.forbidden'
  if (normalized.includes('too many')) return 'common.backend.tooManyRequests'
  return null
}

export const useApiError = (error: any): ParsedApiError => {
  const { t } = useLocale()
  const fieldErrorsRaw = error?.data?.errors as Record<string, string[] | string> | undefined
  const fieldErrors: Record<string, string> = {}

  if (fieldErrorsRaw) {
    for (const [field, value] of Object.entries(fieldErrorsRaw)) {
      const normalizedField = field.split('.')[0]
      const translated = fieldErrorKeyMap[normalizedField] ? t(fieldErrorKeyMap[normalizedField]) : ''
      const fallback = Array.isArray(value) ? String(value[0] || '') : String(value)

      if (Array.isArray(value)) {
        fieldErrors[field] = translated || fallback
      }
      else {
        fieldErrors[field] = translated || fallback
      }
    }
  }

  const status = Number(error?.statusCode || error?.status || 0)
  const firstFieldError = Object.values(fieldErrors)[0] || ''
  const backendMessage = String(error?.data?.message || error?.message || '')
  const mappedByText = backendMessage ? mapMessageToKey(backendMessage) : null
  const mappedByStatus = statusKeyMap[status] || null

  const message = firstFieldError
    || (mappedByText ? t(mappedByText) : '')
    || (mappedByStatus ? t(mappedByStatus) : '')
    || backendMessage
    || t('common.unexpectedError')

  return {
    message,
    fieldErrors,
  }
}
