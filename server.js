import app from './index.js';

const PORT = process.env.PORT || 3000;

console.log('Environment variables:', process.env);
console.log('Attempting to start on port:', PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
