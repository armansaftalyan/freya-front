import type { CapacitorConfig } from '@capacitor/cli'

const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim() || ''

const config: CapacitorConfig = {
  appId: 'am.freyabeauty.app',
  appName: 'Freya Beauty',
  webDir: '.output/public',
  bundledWebRuntime: false,
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith('http://'),
      }
    : undefined,
}

export default config
