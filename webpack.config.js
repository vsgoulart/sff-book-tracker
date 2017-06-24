#!/usr/bin/env node
"use strict";

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const vendor = ["babel-polyfill", "firebase", "react", "react-dom", "redux"];
const extensions = [".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".json"];

module.exports = (env = {}) => {
  let plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"]
    }),
    new HtmlWebpackPlugin({
      template: "src/index.htm",
      chunksSortMode: "dependency"
    }),
    new ExtractTextPlugin({
      filename: "style.[contenthash].css",
      allChunks: true
    })
  ];

  if (env.analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    entry: {
      bundle: "./src/index.tsx",
      vendor
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].[chunkhash].js"
    },
    module: {
      rules: [
        {
          use: "babel-loader",
          test: /\.jsx?$/,
          exclude: /node_modules/
        },
        {
          use: ["babel-loader", "ts-loader"],
          test: /\.tsx?$/,
          exclude: /node_modules/
        },
        {
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", "sass-loader"]
          }),
          test: /\.s?css$/
        }
      ]
    },
    resolve: {
      extensions
    },
    plugins
  };
};