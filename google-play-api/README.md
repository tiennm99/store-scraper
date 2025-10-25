# miti-google-play-scraper
Host [google-play-scraper](https://github.com/facundoolano/google-play-scraper) on [Vercel](https://vercel.com)

## Available Methods
All methods from the google-play-scraper library are supported:
- `app`: Retrieves the full detail of an application
- `list`: Retrieves a list of applications from one of the collections at Google Play
- `search`: Retrieves a list of apps that results of searching by the given term
- `developer`: Returns the list of applications by the given developer name
- `suggest`: Given a string returns up to five suggestion to complete a search query term
- `reviews`: Retrieves a page of reviews for a specific application
- `similar`: Returns a list of similar apps to the one specified
- `permissions`: Returns the list of permissions an app has access to
- `datasafety`: Returns the data safety information of an app
- `categories`: Retrieve a full list of categories present from dropdown menu on Google Play

## Usage
The API accepts POST requests with raw JSON body parameters for each method.

### Generic endpoint
```
POST /scraper/:method
```

### Specific endpoints
```
POST /scraper/app
POST /scraper/list
POST /scraper/search
POST /scraper/developer
POST /scraper/suggest
POST /scraper/reviews
POST /scraper/similar
POST /scraper/permissions
POST /scraper/datasafety
POST /scraper/categories
```

### Examples

Get app details:
```bash
curl -X POST http://localhost:3000/scraper/app \
  -H "Content-Type: application/json" \
  -d '{"appId": "com.google.android.apps.translate"}'
```

Search for apps:
```bash
curl -X POST http://localhost:3000/scraper/search \
  -H "Content-Type: application/json" \
  -d '{"term": "panda", "num": 2}'
```

Get developer apps:
```bash
curl -X POST http://localhost:3000/scraper/developer \
  -H "Content-Type: application/json" \
  -d '{"devId": "Google LLC"}'
```

## Development

To develop locally:
```
npm install
vc dev
```

```
open http://localhost:3000
```

To build locally:
```
npm install
vc build
```

To deploy:
```
npm install
vc deploy
```