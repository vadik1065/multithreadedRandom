const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const TSLintPlugin = require("tslint-webpack-plugin");
const path = require("path");
module.exports = {
  entry: "./index.ts",
  watch: true,
  watchOptions: {
    ignored: "**/node_modules",
    aggregateTimeout: 200,
    poll: 10000
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"]
      }
    ]
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./index.html", favicon: "./src/favicon.ico" }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ["dist"]
        }
      }
    }),
    new TSLintPlugin({
      files: ["./src/**/*.ts", "index.ts"]
    })
  ],
  mode: "development"
};
