import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './playwright',
	fullyParallel: true,
	use: {
		baseURL: 'http://127.0.0.1:4173',
		viewport: { width: 800, height: 600 },
	},
	webServer: {
		command: 'vite --host 127.0.0.1 --port 4173',
		url: 'http://127.0.0.1:4173/playwright/fixtures/progression.html',
		reuseExistingServer: !process.env.CI,
	},
})
