const webpack = require('webpack');
const { override, addWebpackPlugin, adjustWorkbox } = require('customize-cra');

module.exports = override(
  // Existing webpack config customizations
  (config) => {
    // Fallback configurations for compatibility
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-http"),
      "assert": require.resolve("assert/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "url": require.resolve("url/")
    });
    config.resolve.fallback = fallback;

    // Disable source maps
    config.devtool = false;

    // Silence certain webpack warnings
    config.stats = {
      warnings: false,
    };

    return config;
  },

  // Add ProvidePlugin to webpack plugins
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  ),

  // Adjust Workbox settings
  adjustWorkbox((wb) => ({
    ...wb,
    maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB
    // Additional Workbox configurations can go here
  }))
);
