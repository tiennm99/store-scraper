import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('Google Play Scraper Worker', () => {
	it('responds with API information for root endpoint', async () => {
		const request = new Request('http://example.com');
		const response = await SELF.fetch(request);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.message).toBe('Welcome to Google Play Scraper API');
		expect(data.endpoints).toHaveLength(10);
	});

	it('responds with app details when calling /app endpoint', async () => {
		const request = new Request('http://example.com/app', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ appId: 'com.google.android.apps.translate' })
		});

		// Note: This test would require actual network access to Google Play
		// In a real test environment, you would mock the gplay.app function
		const response = await SELF.fetch(request);
		// We're just checking that the endpoint exists and returns a response
		expect(response.status).toBe(200);
	});

	it('responds with categories when calling /categories endpoint', async () => {
		const request = new Request('http://example.com/categories');
		const response = await SELF.fetch(request);

		// Expecting an array of categories
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(Array.isArray(data)).toBe(true);
	});

	it('handles OPTIONS request for CORS', async () => {
		const request = new Request('http://example.com/app', {
			method: 'OPTIONS'
		});

		const response = await SELF.fetch(request);
		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});

	it('handles invalid JSON in request body', async () => {
		const request = new Request('http://example.com/app', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: 'invalid json'
		});

		const response = await SELF.fetch(request);
		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toBe('Invalid JSON in request body');
	});
});