export default defineNuxtPlugin(() => {
  const route = useRoute()
  const referral = useReferralAttribution()
  const legacyCodeCookie = useCookie<string | null>('referral_code')
  const legacyClickedAtCookie = useCookie<string | null>('referral_clicked_at')

  const captureAndCleanUrl = (value: unknown) => {
    referral.capture(value)

    const url = new URL(window.location.href)
    if (!url.searchParams.has('ref')) return

    url.searchParams.delete('ref')
    window.history.replaceState(window.history.state, '', url.toString())
  }

  referral.hydrate()
  legacyCodeCookie.value = null
  legacyClickedAtCookie.value = null
  captureAndCleanUrl(route.query.ref)
  watch(() => route.query.ref, captureAndCleanUrl)
})
