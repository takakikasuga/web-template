const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
  mode: 'development',
  // NOTE: エントリポイント
  entry: './assets/scss/index.scss',
  // NOTE: 出力先
  output: {
    path: path.resolve(__dirname, './out/'),
    assetModuleFilename(pathData) {
      return pathData.filename;
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: [
          // NOTE: cssファイルとして別ファイルに出力する
          MiniCssExtractPlugin.loader,
          // NOTE: cssをCommonJS形式に変換してjavaScriptで扱えるようにする
          'css-loader',
          {
            // NOTE: PostCSSでcssを処理する
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // NOTE: ベンダープレフィックスを自動付与する
                plugins: [require('autoprefixer')({ grid: true })] // NOTE: Gridプロパティ系のベンダープレフィックスを付与
              }
            }
          },
          {
            // NOTE: sassをコンパイルしてcssに変換する
            loader: 'sass-loader',
            options: {
              // NOTE: Dart Sassを使えるようにする
              implementation: require('sass'),
              /**
               * @desc Node16系以降はfiberに互換性がないため、falseに設定する。
               * @ref https://blog.nasbi.jp/programming/devenv/webpack/the-story-of-fibers-about-sass-loader-and-dart-sass/
               */
              sassOptions: {
                fiber: false
              }
            }
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './out')
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html'
    }),
    new RemoveEmptyScriptsPlugin()
  ],
  // NOTE: devtool: 'source-map', // NOTE: source-map タイプのソースマップを出力
  watchOptions: {
    // NOTE: node_modules を監視（watch）対象から除外
    ignored: /node_modules/ // NOTE: 正規表現で指定
  }
};
