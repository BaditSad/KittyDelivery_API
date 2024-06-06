const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();
const PORT = 3000;

//Need the middleware here to check token
//Ici on redirige les requêtes vers les bons microservices

app.use('/api/mc_component', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
}));

app.use('/api/mc_user', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
}));

app.use('/api/mc_notification', createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
}));

app.use('/api/mc_order', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true,
}));

app.use('/api/mc_auth', createProxyMiddleware({
  target: 'http://localhost:3005',
  changeOrigin: true,
}));

app.use('/api/mc_article', createProxyMiddleware({
  target: 'http://localhost:3006',
  changeOrigin: true,
}));

app.use('/api/mc_token', createProxyMiddleware({
  target: 'http://localhost:3007',
  changeOrigin: true,
}));

app.listen(PORT, () => console.log(`app running on http://localhost:${PORT}`));