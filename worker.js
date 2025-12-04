import store from 'app-store-scraper';
import gplay from 'google-play-scraper';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'GET') {
      if (url.pathname === '/') {
        return Response.json({
          message: 'Store Scraper',
          homepage: 'https://github.com/tiennm99/store-scraper'
        });
      } else if (url.pathname === '/apple/') {
        return Response.json({
          message: 'App Store Scraper',
          documentation: 'https://github.com/facundoolano/app-store-scraper'
        });
      } else if (url.pathname === '/google/') {
        return Response.json({
          message: 'Google Play Scraper',
          documentation: 'https://github.com/facundoolano/google-play-scraper'
        });
      }
    } else if (request.method === 'POST') {
      try {
        const body = await request.json();
        const action = url.pathname.split('/')[2];

        if (url.pathname.startsWith('/apple/')) {
          switch (action) {
            case 'app':
              return Response.json(await store.app(body));
            case 'search':
              return Response.json(await store.search(body));
            case 'suggest':
              return Response.json(await store.suggest(body));
            case 'reviews':
              return Response.json(await store.reviews(body));
            case 'similar':
              return Response.json(await store.similar(body));
            case 'developer':
              return Response.json(await store.developer(body));
            case 'list':
              return Response.json(await store.list(body));
            default:
              return Response.json({ error: 'Invalid Apple Store method' }, { status: 400 });
          }
        }

        if (url.pathname.startsWith('/google/')) {
          switch (action) {
            case 'app':
              return Response.json(await gplay.app(body));
            case 'search':
              return Response.json(await gplay.search(body));
            case 'suggest':
              return Response.json(await gplay.suggest(body));
            case 'reviews':
              return Response.json(await gplay.reviews(body));
            case 'similar':
              return Response.json(await gplay.similar(body));
            case 'developer':
              return Response.json(await gplay.developer(body));
            case 'permissions':
              return Response.json(await gplay.permissions(body));
            case 'categories':
              return Response.json(await gplay.categories());
            default:
              return Response.json({ error: 'Invalid Play Store method' }, { status: 400 });
          }
        }

      } catch (error) {
        return Response.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};
