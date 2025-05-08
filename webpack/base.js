const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs');

const staticExists = fs.existsSync(path.resolve(__dirname, '../static'));

const plugins = [
  new CleanWebpackPlugin({
    root: path.resolve(__dirname, "../")
  }),
  new webpack.DefinePlugin({
    CANVAS_RENDERER: JSON.stringify(true),
    WEBGL_RENDERER: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "../index.html")
  }),
  new CopyPlugin({
    patterns: [
      {
        from: 'src/assets',
        to: 'assets'
      }
    ]
  })
];

if (staticExists) {
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: 'static',
        }
      ]
    })
  );
}

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  context: path.resolve(__dirname, '..'),
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].bundle.js",
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      { 
        test: /\.tsx?$/, 
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: [/\.vert$/, /\.frag$/],
        type: 'asset/source'
      },
      {
        test: /\.(gif|png|mp3|jpe?g|svg|xml|ogg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[path][name][ext]'
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  plugins,
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'),
      publicPath: '/',
      watch: true
    },
    compress: true,
    port: 8080,
    hot: true,
    historyApiFallback: true
  }
};
