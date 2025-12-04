import store from 'app-store-scraper';
import gplay from 'google-play-scraper';

async function handleStoreRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Root endpoint
  if (path === '/') {
    return new Response(JSON.stringify({
      message: 'Store Scraper',
      endpoints: {
        apple: '/apple/',
        google: '/google/'
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Apple Store info endpoint
  if (path === '/apple/') {
    return new Response(JSON.stringify({
      message: 'App Store Scraper',
      documentation: 'https://github.com/facundoolano/app-store-scraper',
      usage: 'POST /apple/{method} with JSON body containing parameters'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Google Play info endpoint
  if (path === '/google/') {
    return new Response(JSON.stringify({
      message: 'Google Play Scraper',
      documentation: 'https://github.com/facundoolano/google-play-scraper',
      usage: 'POST /google/{method} with JSON body containing parameters'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Apple Store scraper methods
  if (path.startsWith('/apple/') && request.method === 'POST') {
    const method = path.split('/apple/')[1];

    try {
      const params = await request.json();

      if (!store[method]) {
        return new Response(JSON.stringify({
          error: `Method '${method}' not supported`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await store[method](params);

      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Apple Store API error:', error);
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Google Play scraper methods
  if (path.startsWith('/google/') && request.method === 'POST') {
    const method = path.split('/google/')[1];

    try {
      const params = await request.json();

      if (!gplay[method]) {
        return new Response(JSON.stringify({
          error: `Method '${method}' not supported`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await gplay[method](params);

      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Google Play API error:', error);
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // 404 for unknown paths
  return new Response(JSON.stringify({
    error: 'Not found'
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

function handleOptions(request) {
  const reqAllowHeaders = request.headers.get("Access-Control-Request-Headers");
  const allowHeaders = reqAllowHeaders ? reqAllowHeaders : "Content-Type";

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": allowHeaders,
    "Access-Control-Max-Age": "86400",
  };

  return new Response(null, { status: 204, headers });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }
    return handleStoreRequest(request);
  }
};
