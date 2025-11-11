import express from 'express';
import store from 'app-store-scraper';
import gplay from 'google-play-scraper';

const app = express();

app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Store Scraper',
    homepage: 'https://github.com/tiennm99/store-scraper'
  });
});

app.get('/apple/', (req, res) => {
  res.json({
    message: 'App Store Scraper',
    documentation: 'https://github.com/facundoolano/app-store-scraper'
  });
});

app.post('/apple/:method', async (req, res) => {
  try {
    const method = req.params.method;
    const params = req.body;

    if (!store[method]) {
      return res.status(400).json({
        error: `Method '${method}' not supported`
      });
    }

    const result = await store[method](params);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/google/', (req, res) => {
  res.json({
    message: 'Google Play Scraper',
    documentation: 'https://github.com/facundoolano/google-play-scraper'
  });
});

app.post('/google/:method', async (req, res) => {
  try {
    const method = req.params.method;
    const params = req.body;

    if (!gplay[method]) {
      return res.status(400).json({
        error: `Method '${method}' not supported`
      });
    }

    const result = await gplay[method](params);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
