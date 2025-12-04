import store from 'app-store-scraper';
import gplay from 'google-play-scraper';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // GET routes
    if (request.method === 'GET') {
      if (path === '/') {
        return Response.json({
          message: 'Store Scraper',
          homepage: 'https://github.com/tiennm99/store-scraper'
        });
      }

      if (path === '/apple/' || path === '/apple') {
        return Response.json({
          message: 'App Store Scraper',
          documentation: 'https://github.com/facundoolano/app-store-scraper'
        });
      }

      if (path === '/google/' || path === '/google') {
        return Response.json({
          message: 'Google Play Scraper',
          documentation: 'https://github.com/facundoolano/google-play-scraper'
        });
      }
    }

    // POST routes
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const pathParts = path.split('/').filter(p => p);

        if (pathParts.length !== 2) {
          return Response.json(
            { error: 'Invalid path format' },
            { status: 400 }
          );
        }

        const [platform, method] = pathParts;

        if (platform === 'apple') {
          if (!store[method]) {
            return Response.json(
              { error: `Method '${method}' not supported` },
              { status: 400 }
            );
          }
          const result = await store[method](body);
          return Response.json(result);
        }

        if (platform === 'google') {
          if (!gplay[method]) {
            return Response.json(
              { error: `Method '${method}' not supported` },
              { status: 400 }
            );
          }
          const result = await gplay[method](body);
          return Response.json(result);
        }

        return Response.json(
          { error: 'Invalid platform' },
          { status: 400 }
        );

      } catch (error) {
        console.log("Error: " + JSON.stringify([error]));
        console.error("Request failed!", error);
        return Response.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};
