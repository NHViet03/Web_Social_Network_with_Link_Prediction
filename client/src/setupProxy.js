const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      headers: {
        'Connection': 'keep-alive'
      }
    })
  );
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      headers: {
        'Connection': 'keep-alive'
      }
    })
  );
};