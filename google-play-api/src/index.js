import gplay from 'google-play-scraper';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		// Handle CORS preflight requests
		if (method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		// Parse request body for POST requests or query params for GET requests
		let params = {};
		if (method === 'POST') {
			try {
				const contentType = request.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					params = await request.json();
				}
			} catch (error) {
				return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		} else {
			// For GET requests, parse query parameters
			for (const [key, value] of url.searchParams.entries()) {
				// Try to parse as JSON, fallback to string
				try {
					params[key] = JSON.parse(value);
				} catch (e) {
					params[key] = value;
				}
			}
		}

		// Set CORS headers for all responses
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		};

		try {
			// Route to appropriate method based on path
			switch (path) {
				case '/app':
					return handleApp(params, corsHeaders);

				case '/list':
					return handleList(params, corsHeaders);

				case '/search':
					return handleSearch(params, corsHeaders);

				case '/developer':
					return handleDeveloper(params, corsHeaders);

				case '/suggest':
					return handleSuggest(params, corsHeaders);

				case '/reviews':
					return handleReviews(params, corsHeaders);

				case '/similar':
					return handleSimilar(params, corsHeaders);

				case '/permissions':
					return handlePermissions(params, corsHeaders);

				case '/datasafety':
					return handleDatasafety(params, corsHeaders);

				case '/categories':
					return handleCategories(corsHeaders);

				default:
					return new Response(JSON.stringify({
						message: 'Welcome to Google Play Scraper API',
						endpoints: [
							'POST /app - Get app details',
							'POST /list - Get list of apps',
							'POST /search - Search for apps',
							'POST /developer - Get apps by developer',
							'POST /suggest - Get search suggestions',
							'POST /reviews - Get app reviews',
							'POST /similar - Get similar apps',
							'POST /permissions - Get app permissions',
							'POST /datasafety - Get app data safety info',
							'POST /categories - Get all categories'
						],
						compatibility: 'Note: This implementation uses the google-play-scraper library which may have compatibility issues with Cloudflare Workers'
					}), {
						status: 200,
						headers: corsHeaders
					});
			}
		} catch (error) {
			// Handle compatibility errors specifically
			if (error.message.includes('Cannot resolve') || error.message.includes('import')) {
				return new Response(JSON.stringify({
					error: 'Compatibility Error',
					message: 'The google-play-scraper library is not compatible with Cloudflare Workers due to Node.js specific dependencies.',
					solution: 'Consider using a proxy approach where this worker calls a backend service that can run the scraper.',
					details: error.message
				}), {
					status: 500,
					headers: corsHeaders
				});
			}

			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: corsHeaders
			});
		}
	},
};

// Handler functions for each method
async function handleApp(params, headers) {
	return new Response(JSON.stringify(await gplay.app(params)), {
		status: 200,
		headers
	});
}

async function handleList(params, headers) {
	return new Response(JSON.stringify(await gplay.list(params)), {
		status: 200,
		headers
	});
}

async function handleSearch(params, headers) {
	return new Response(JSON.stringify(await gplay.search(params)), {
		status: 200,
		headers
	});
}

async function handleDeveloper(params, headers) {
	return new Response(JSON.stringify(await gplay.developer(params)), {
		status: 200,
		headers
	});
}

async function handleSuggest(params, headers) {
	return new Response(JSON.stringify(await gplay.suggest(params)), {
		status: 200,
		headers
	});
}

async function handleReviews(params, headers) {
	return new Response(JSON.stringify(await gplay.reviews(params)), {
		status: 200,
		headers
	});
}

async function handleSimilar(params, headers) {
	return new Response(JSON.stringify(await gplay.similar(params)), {
		status: 200,
		headers
	});
}

async function handlePermissions(params, headers) {
	return new Response(JSON.stringify(await gplay.permissions(params)), {
		status: 200,
		headers
	});
}

async function handleDatasafety(params, headers) {
	return new Response(JSON.stringify(await gplay.datasafety(params)), {
		status: 200,
		headers
	});
}

async function handleCategories(headers) {
	return new Response(JSON.stringify(await gplay.categories()), {
		status: 200,
		headers
	});
}