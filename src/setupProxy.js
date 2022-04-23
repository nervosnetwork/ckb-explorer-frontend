const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    ['/testnet/api', '/api'],
    createProxyMiddleware({
      target: 'https://api.explorer.nervos.org',
      changeOrigin: true,
    })
  )
};