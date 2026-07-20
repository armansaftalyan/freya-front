const referralCodeKey = 'freya_referral_code'
const referralClickedAtKey = 'freya_referral_clicked_at'

export const useReferralAttribution = () => {
  const code = useState<string | null>('referral-code', () => null)
  const clickedAt = useState<string | null>('referral-clicked-at', () => null)

  const hydrate = () => {
    if (!import.meta.client) return

    code.value = sessionStorage.getItem(referralCodeKey)
    clickedAt.value = sessionStorage.getItem(referralClickedAtKey)
  }

  const capture = (value: unknown) => {
    const raw = Array.isArray(value) ? value[0] : value
    if (typeof raw !== 'string') return

    const normalized = raw.trim().toUpperCase()
    if (!/^[A-Z0-9_-]{2,32}$/.test(normalized)) return

    const capturedAt = new Date().toISOString()
    code.value = normalized
    clickedAt.value = capturedAt

    if (import.meta.client) {
      sessionStorage.setItem(referralCodeKey, normalized)
      sessionStorage.setItem(referralClickedAtKey, capturedAt)
    }
  }

  return { code, clickedAt, hydrate, capture }
}
