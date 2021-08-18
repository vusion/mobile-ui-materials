const pkg = require('./package.json');
const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');

const assetsDir = 'static';
// const publicPathPrefix = process.env.NODE_ENV === 'production' ? `https://vusion-templates.github.io/${pkg.name}` : '/';


module.exports = {
  assetsDir,
  outputDir: 'dist-theme',
  // publicPath: publicPathPrefix,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375,
            propList: ["*", "!font-size", "!line-height"],
            selectorBlackList: ["nov"],
          })
        ]
      }
    }
  },
  lintOnSave: false,
  chainWebpack(config) {
    config.output.jsonpFunction('webpackJsonp' + pkg.name);
  },
};
