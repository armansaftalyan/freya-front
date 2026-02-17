module.exports = {
  apps: [
    {
      name: 'beauty-salon-web',
      script: '.output/server/index.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3000,
        NITRO_HOST: '0.0.0.0',
        NITRO_PORT: 3000,
      },
    },
  ],
}
