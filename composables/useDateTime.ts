const yerevanDateTimeFormatter = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Yerevan',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const yerevanDateFormatter = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Yerevan',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const yerevanTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Yerevan',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export const useDateTime = () => {
  const formatYerevanDateTime = (raw?: string | Date | null, fallback = '-'): string => {
    if (!raw) return fallback
    const date = raw instanceof Date ? raw : new Date(raw)
    if (Number.isNaN(date.getTime())) return String(raw)
    return yerevanDateTimeFormatter.format(date).replace(',', '')
  }

  const formatYerevanDate = (raw?: string | Date | null): string => {
    if (!raw) return ''
    const date = raw instanceof Date ? raw : new Date(raw)
    if (Number.isNaN(date.getTime())) return ''
    return yerevanDateFormatter.format(date)
  }

  const formatYerevanTime = (raw?: string | Date | null): string => {
    if (!raw) return ''
    const date = raw instanceof Date ? raw : new Date(raw)
    if (!Number.isNaN(date.getTime())) {
      return yerevanTimeFormatter.format(date)
    }

    const timeMatch = String(raw).match(/(\d{2}:\d{2})/)
    return timeMatch?.[1] || String(raw)
  }

  const todayYerevanDate = (): string => yerevanDateFormatter.format(new Date())

  return {
    formatYerevanDateTime,
    formatYerevanDate,
    formatYerevanTime,
    todayYerevanDate,
  }
}
