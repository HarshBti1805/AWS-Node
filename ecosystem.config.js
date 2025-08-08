module.exports = {
  apps: [
    {
      name: "Weather-App",
      script: "app.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 80,
        OPENWEATHER_API_KEY: "your_actual_api_key_here",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 80,
        OPENWEATHER_API_KEY: "your_actual_api_key_here",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
    },
  ],
};
