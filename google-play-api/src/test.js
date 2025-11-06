import gplay from 'google-play-scraper';

gplay.app({ appId: "pool.us", lang: "vi", country: "vn" }).then(value => {
  console.log(JSON.stringify(value));
});
