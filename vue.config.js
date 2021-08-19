const pkg = require('./package.json');
const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');

// const assetsDir = 'dist';
// const publicPathPrefix = process.env.NODE_ENV === 'production' ? `https://vusion-templates.github.io/${pkg.name}` : '/';
const publicPathPrefix = '/';

module.exports = {
  // assetsDir,
  outputDir: 'dist',
  publicPath: publicPathPrefix,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375,
            // propList: ["*", "!font-size", "!line-height"],
            propList: ["*"],
            selectorBlackList: ["nov"],
          })
        ]
      }
    }
  },
  lintOnSave: false,
  chainWebpack(config) {
    config.externals({
      vue: "Vue",
      'vue-router': 'VueRouter',
      vant: 'vant',
    }),
      config.output.jsonpFunction('webpackJsonp' + pkg.name);
  },
};
