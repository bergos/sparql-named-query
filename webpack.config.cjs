const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  plugins: [new NodePolyfillPlugin()],
  resolve: {
    alias: {
      stream: require.resolve('readable-stream')
    }
  }
}
