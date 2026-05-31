export const useBrandContext = () => {
  const route = useRoute()

  const isTor = computed(() => /(^|\/)tor(\/|$)/.test(route.path))
  const brand = computed<'freya' | 'tor'>(() => (isTor.value ? 'tor' : 'freya'))
  const rootPath = computed(() => (isTor.value ? '/tor' : ''))
  const bookingPath = computed(() => (isTor.value ? '/tor/booking' : '/booking'))
  const servicesPath = computed(() => (isTor.value ? '/tor/services' : '/services'))
  const productsPath = computed(() => (isTor.value ? '/tor/products' : '/products'))
  const mastersPath = computed(() => (isTor.value ? '/tor/masters' : '/masters'))
  const contactsPath = computed(() => (isTor.value ? '/tor/contacts' : '/contacts'))
  const legalPath = computed(() => (isTor.value ? '/tor/legal' : '/legal'))
  const privacyPolicyPath = computed(() => (isTor.value ? '/tor/privacy-policy' : '/privacy-policy'))
  const giftCardsPath = computed(() => (isTor.value ? '/tor/gift-cards/buy' : '/gift-cards/buy'))
  const authLoginPath = computed(() => (isTor.value ? '/tor/account/login' : '/account/login'))
  const authRegisterPath = computed(() => (isTor.value ? '/tor/account/register' : '/account/register'))
  const authForgotPasswordPath = computed(() => (isTor.value ? '/tor/account/forgot-password' : '/account/forgot-password'))
  const authResetPasswordPath = computed(() => (isTor.value ? '/tor/account/reset-password' : '/account/reset-password'))
  const authProfilePath = computed(() => (isTor.value ? '/tor/account' : '/account'))
  const authAppointmentsPath = computed(() => (isTor.value ? '/tor/account/appointments' : '/account/appointments'))
  const authMasterProfilePath = computed(() => (isTor.value ? '/tor/account/master-profile' : '/account/master-profile'))
  const authProductOrdersPath = computed(() => (isTor.value ? '/tor/account/orders' : '/account/orders'))
  const blogPath = computed(() => (isTor.value ? '/tor/blog' : '/blog'))
  const authGiftCardsPath = computed(() => (isTor.value ? '/tor/account/gift-cards' : '/account/gift-cards'))
  const authGiftCardScanBasePath = computed(() => (isTor.value ? '/tor/account/gift-cards/scan' : '/account/gift-cards/scan'))

  return {
    isTor,
    brand,
    rootPath,
    bookingPath,
    servicesPath,
    productsPath,
    mastersPath,
    contactsPath,
    legalPath,
    privacyPolicyPath,
    giftCardsPath,
    authLoginPath,
    authRegisterPath,
    authForgotPasswordPath,
    authResetPasswordPath,
    authProfilePath,
    authAppointmentsPath,
    authMasterProfilePath,
    authProductOrdersPath,
    blogPath,
    authGiftCardsPath,
    authGiftCardScanBasePath,
  }
}
