// Use "type: commonjs" in package.json to use CommonJS modules
const express = require('express');
const gplay = require('google-play-scraper');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: '*/*' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Google Play Scraper API is running!',
    methods: [
      'app', 'list', 'search', 'developer',
      'suggest', 'reviews', 'similar',
      'permissions', 'datasafety', 'categories'
    ]
  });
});

// Generic endpoint to handle all Google Play Scraper methods
app.post('/scraper/:method', async (req, res) => {
  try {
    const method = req.params.method;
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Validate method
    if (!gplay[method]) {
      return res.status(400).json({
        error: `Method '${method}' not supported`,
        supportedMethods: Object.keys(gplay).filter(key => typeof gplay[key] === 'function')
      });
    }

    // Execute the requested method with provided parameters
    const result = await gplay[method](params);

    // Return raw result
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Specific endpoints for each method (optional, for convenience)
app.post('/scraper/app', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.app(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/list', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.list(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/search', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.search(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/developer', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.developer(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/suggest', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.suggest(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/reviews', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.reviews(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/similar', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.similar(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/permissions', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.permissions(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/datasafety', async (req, res) => {
  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await gplay.datasafety(params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/scraper/categories', async (req, res) => {
  try {
    const result = await gplay.categories();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Export for Vercel
module.exports = app;

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Google Play Scraper API listening on port ${port}`);
  });
}