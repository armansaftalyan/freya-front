export {}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}
