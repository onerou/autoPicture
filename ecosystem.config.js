module.exports = {
	apps: [
		{
			name: 'weChartBot',
			script: 'app.js',
			// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
			instances: 1,
			autorestart: false,
			watch: false,
			max_memory_restart: '4G',
			env: {
				PM2_SERVE_PORT: 8080,
				PM2_SERVE_PATH: './apidoc',
				NODE_ENV: 'production'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
}
