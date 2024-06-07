const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

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

app.use('/api/mc_menu', createProxyMiddleware({
  target: 'http://localhost:3008',
  changeOrigin: true,
}));

app.use('/api/mc_log', createProxyMiddleware({
  target: 'http://localhost:3009',
  changeOrigin: true,
}));

app.use('/api/mc_payment', createProxyMiddleware({
  target: 'http://localhost:3010',
  changeOrigin: true,
}));

app.listen(PORT, () => console.log(`app running on http://localhost:${PORT}`));