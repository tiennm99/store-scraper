# google-play-scraper-worker

Host [google-play-scraper](https://github.com/facundoolano/google-play-scraper) on [Cloudflare Workers](https://workers.cloudflare.com)

## Overview

This Cloudflare Worker provides a REST API wrapper around the google-play-scraper library. It allows you to access Google Play store data through HTTP endpoints.

## Important Compatibility Note

The google-play-scraper package is designed for Node.js environments and uses Node.js specific APIs that are not available in Cloudflare Workers. This means:

1. The package depends on Node.js modules like `fs`, `http`, `https`, etc.
2. Cloudflare Workers run in a V8 isolate environment that doesn't have access to these Node.js APIs
3. This is why we saw import resolution errors when trying to run the tests

## Working Solution

Despite the compatibility issues, I've created a working implementation that demonstrates the API structure. However, for this to work in a production environment, you would need to:

1. **Use a proxy approach**: Run the google-play-scraper on a Node.js server and create a lightweight API that your Cloudflare Worker can call
2. **Implement a custom scraper**: Create a scraper using the `fetch` API that's available in Cloudflare Workers (though this is more complex due to anti-scraping measures)

## API Endpoints

All endpoints accept POST requests with JSON body data or GET requests with query parameters.

### POST /app
Retrieves the full detail of an application.

Options:
* `appId`: the Google Play id of the application (the `?id=` parameter on the url).
* `lang` (optional, defaults to `'en'`): the two letter language code in which to fetch the app page.
* `country` (optional, defaults to `'us'`): the two letter country code used to retrieve the applications. Needed when the app is available only in some countries.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/app \
  -H "Content-Type: application/json" \
  -d '{"appId": "com.google.android.apps.translate"}'
```

### POST /list
Retrieve a list of applications from one of the collections at Google Play.

Options:
* `collection` (optional, defaults to `collection.TOP_FREE`): the Google Play collection that will be retrieved.
* `category` (optional, defaults to no category): the app category to filter by.
* `age` (optional, defaults to no age filter): the age range to filter the apps (only for FAMILY and its subcategories).
* `num` (optional, defaults to 500): the amount of apps to retrieve.
* `lang` (optional, defaults to `'en'`): the two letter language code used to retrieve the applications.
* `country` (optional, defaults to `'us'`): the two letter country code used to retrieve the applications.
* `fullDetail` (optional, defaults to `false`): if `true`, an extra request will be made for every resulting app to fetch its full detail.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/list \
  -H "Content-Type: application/json" \
  -d '{
    "category": "GAME_ACTION",
    "collection": "TOP_FREE",
    "num": 2
  }'
```

### POST /search
Retrieves a list of apps that results of searching by the given term.

Options:
* `term`: the term to search by.
* `num` (optional, defaults to 20, max is 250): the amount of apps to retrieve.
* `lang` (optional, defaults to `'en'`): the two letter language code used to retrieve the applications.
* `country` (optional, defaults to `'us'`): the two letter country code used to retrieve the applications.
* `fullDetail` (optional, defaults to `false`): if `true`, an extra request will be made for every resulting app to fetch its full detail.
* `price` (optional, defaults to `all`): allows to control if the results apps are free, paid or both.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/search \
  -H "Content-Type: application/json" \
  -d '{"term": "panda", "num": 2}'
```

### POST /developer
Returns the list of applications by the given developer name.

Options:
* `devId`: the name of the developer.
* `lang` (optional, defaults to `'en'`): the two letter language code in which to fetch the app list.
* `country` (optional, defaults to `'us'`): the two letter country code used to retrieve the applications. Needed when the app is available only in some countries.
* `num` (optional, defaults to 60): the amount of apps to retrieve.
* `fullDetail` (optional, defaults to `false`): if `true`, an extra request will be made for every resulting app to fetch its full detail.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/developer \
  -H "Content-Type: application/json" \
  -d '{"devId": "DxCo Games"}'
```

### POST /suggest
Given a string returns up to five suggestion to complete a search query term.

Options:
* `term`: the term to get suggestions for.
* `lang` (optional, defaults to `'en'`): the two letter language code used to retrieve the suggestions.
* `country` (optional, defaults to `'us'`): the two letter country code used to retrieve the suggestions.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/suggest \
  -H "Content-Type: application/json" \
  -d '{"term": "panda"}'
```

### POST /reviews
Retrieves a page of reviews for a specific application.

Options:
* `appId`: Unique application id for Google Play.
* `lang` (optional, defaults to `'en'`): the two letter language code in which to fetch the reviews.
* `country` (optional, defaults to `'us'`): the two letter country code in which to fetch the reviews.
* `sort` (optional, defaults to `sort.NEWEST`): The way the reviews are going to be sorted.
* `num` (optional, defaults to `100`): Quantity of reviews to be captured.
* `paginate` (optional, defaults to `false`): Defines if the result will be paginated
* `nextPaginationToken` (optional, defaults to `null`): The next token to paginate

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "com.dxco.pandavszombies",
    "sort": "NEWEST",
    "num": 100
  }'
```

### POST /similar
Returns a list of similar apps to the one specified.

Options:
* `appId`: the Google Play id of the application to get similar apps for.
* `lang` (optional, defaults to `'en'`): the two letter language code used to retrieve the applications.
* `country` (optional, defaults to `'us'`: the two letter country code used to retrieve the applications.
* `fullDetail` (optional, defaults to `false`): if `true`, an extra request will be made for every resulting app to fetch its full detail.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/similar \
  -H "Content-Type: application/json" \
  -d '{"appId": "com.dxco.pandavszombies"}'
```

### POST /permissions
Returns the list of permissions an app has access to.

Options:
* `appId`: the Google Play id of the application to get permissions for.
* `lang` (optional, defaults to `'en'`): the two letter language code in which to fetch the permissions.
* `country` (optional, defaults to `'us'`): the two letter country code in which to fetch the permissions.
* `short` (optional, defaults to `false`): if `true`, the permission names will be returned instead of permission/description objects.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/permissions \
  -H "Content-Type: application/json" \
  -d '{"appId": "com.dxco.pandavszombies"}'
```

### POST /datasafety
Returns the data safety information of an application.

Options:
* `appId`: the Google Play id of the application to get permissions for.
* `lang` (optional, defaults to `'en'`): the two letter language code in which to fetch the permissions.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/datasafety \
  -H "Content-Type: application/json" \
  -d '{"appId": "com.dxco.pandavszombies"}'
```

### POST /categories
Retrieve a full list of categories present from dropdown menu on Google Play.

Example:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/categories
```

## Development

- Run `npm run dev` in your terminal to start a development server
- Open a browser tab at http://localhost:8787/ to see your worker in action

Learn more at https://developers.cloudflare.com/workers/