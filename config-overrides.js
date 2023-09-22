const webpack = require('webpack');

module.exports = function override(config) {
  // Fallback configurations for compatibility
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("readable-stream"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url")
  });
  config.resolve.fallback = fallback;

  // Plugins configuration
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // updated the path
      Buffer: ['buffer', 'Buffer']
    })
  ]);

  // Disable source maps
  config.devtool = false;

  config.stats = {
    warnings: false
  };

  return config;
}
