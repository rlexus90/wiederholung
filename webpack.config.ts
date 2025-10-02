import path = require("path");
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ZipPlugin = require("zip-webpack-plugin")

 
const config = {
  entry: {
    ["bot"]: "./src/lambdas/bot/index.ts",
		["send"]: "./src/lambdas/send/index.ts",
  },
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/index.js",
    library: {
      type: "commonjs",
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  mode: "production",
  plugins: [new CleanWebpackPlugin()],
  watchOptions:{
    ignored: '**/test',
  } 
};

const pluginConfig = {
  plugins: Object.keys(config.entry).map(entryName => {
    return new ZipPlugin({
      path: path.resolve(__dirname, "dist/"),
      filename: entryName,
      extension: "zip",
      include: [entryName],
    })
  }),
}

const webpackConfig = Object.assign(config, pluginConfig)
module.exports = webpackConfig