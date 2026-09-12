import { defineConfig } from "vitest/config";
import { cloudflarePool } from "@cloudflare/vitest-pool-workers";

export default defineConfig({
	test: {
		pool: cloudflarePool({
			// optional Miniflare config
			// miniflare: {
			// 	modules: true
			// }
		}),
		// environment: "cloudflare",
	},
});
