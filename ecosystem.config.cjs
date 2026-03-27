module.exports = {
  apps: [
    {
      name: 'freya',
      script: '.output/server/index.mjs', // для Nuxt 3
      exec_mode: 'cluster',
      instances: 'max', // сколько процессов
      env: {
        NODE_ENV: 'production',
        NUXT_PUBLIC_API_BASE: process.env.NUXT_PUBLIC_API_BASE,
        NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL,
        NUXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
        NUXT_PUBLIC_YANDEX_METRIKA_ID: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID,
      },
    },
  ],
};
