import gplay from 'google-play-scraper';

gplay.app({ appId: "pool.us" }).then(value => {
  console.log(JSON.stringify(value));
});
