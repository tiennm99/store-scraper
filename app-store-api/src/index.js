import express from 'express';
import store from 'app-store-scraper';

const app = express();

app.use(express.json({ limit: '10mb' }));

app.post('/:method', async (req, res) => {
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

app.get('/', (req, res) => {
  res.json({
    message: 'App Store Scraper',
    documentation: 'https://github.com/facundoolano/app-store-scraper'
  });
});

export default app;
