const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const path = require("path");
module.exports = {
  entry: "./index.ts",
  watch: true,
  watchOptions: {
    ignored: "**/node_modules",
    aggregateTimeout: 200,
    poll: 1000
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
    new HtmlWebpackPlugin({ template: "./index.html" }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ["dist"]
        }
      }
    })
  ],
  mode: "development"
};
