import { describe, it, expect } from "vitest";
import worker from "../src/index";

describe("Health endpoint", () => {
	it("returns status ok", async () => {
		const request = new Request("http://localhost:8787/health");
		const response = await worker.fetch(request, {} as any);
		expect(await response.json()).toEqual({ status: "ok" });
	});
});
