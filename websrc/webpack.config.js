/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

const config = {
  mode: isProd ? "production" : "development",
  devtool: !isProd && "source-map",
  entry: path.resolve(__dirname, "./index.ts"),
  output: {
    path: path.resolve(__dirname, "../websrc-dist"),
    publicPath: "/",
    filename: isProd ? "[name].[hash].js" : "[name].js"
  },
  stats: "verbose", // 日志输出（全部输出）
  resolveLoader: {
    modules: ["node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: path.posix.join("static", "[name].[hash:7].[ext]")
        }
      }
    ]
  },
  resolve: {
    extensions: [".vue", ".ts", ".tsx", ".js", ".json"],
    alias: {
      vue: "vue/dist/vue.esm-browser.js",
      "@lerna-repo": path.resolve(__dirname, "../packages"),
      examples: path.resolve(__dirname)
    }
  },
  plugins: [
    new WebpackBar(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "./websrc/assets/index.html"
    })
    // new BundleAnalyzerPlugin(),
  ],
  devServer: {
    inline: true,
    hot: true,
    open: true,
    port: "8080",
    progress: true,
    stats: "minimal",
    publicPath: "/",
    contentBase: __dirname,
    overlay: true
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()]
  }
};

const cssRule = {
  test: /\.(sass|scss|css)$/,
  use: [
    "css-loader",
    {
      loader: "sass-loader",
      options: {
        implementation: require("sass")
      }
    }
  ]
};
cssRule.use.unshift("style-loader");
config.module.rules.push(cssRule);
module.exports = config;
