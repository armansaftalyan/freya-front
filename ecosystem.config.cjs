module.exports = {
  apps: [
    {
      name: 'beauty-salon-web',
      script: 'node',
      args: '.output/server/index.mjs',
      instances: 'max',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        NITRO_PORT: 3000,
        NITRO_HOST: '127.0.0.1',
      },
    },
  ],
}
