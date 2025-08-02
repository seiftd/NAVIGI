module.exports = {
  apps: [
    {
      name: 'navigi-main-bot',
      script: 'telegram-bot/bot.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      log_file: './logs/navigi-main-bot.log',
      out_file: './logs/navigi-main-bot-out.log',
      error_file: './logs/navigi-main-bot-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'navigi-admin-bot',
      script: 'admin-bot-setup.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      log_file: './logs/navigi-admin-bot.log',
      out_file: './logs/navigi-admin-bot-out.log',
      error_file: './logs/navigi-admin-bot-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ],

  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/navigi/sbaro-bot.git',
      path: '/var/www/navigi-bot',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/navigi-bot/logs'
    }
  }
};