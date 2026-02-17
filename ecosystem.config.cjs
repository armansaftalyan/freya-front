module.exports = {
  apps: [
    {
      name: 'freya',
      script: '.output/server/index.mjs', // для Nuxt 3
      exec_mode: 'cluster',
      instances: 'max', // сколько процессов
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
