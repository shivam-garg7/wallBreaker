const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    mode: "development",
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js', '.css','.json'],
        alias: {
            '@scenes': path.resolve(__dirname, 'src/Scenes')
        }
    },
    output: {
        filename: 'main.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            { test: /\.ts$/, use: 'ts-loader' },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './index.html' }),
         new CopyPlugin({
      patterns: [
        { from: "assets", to: "assets" },
        { from: "manifest.json", to: "manifest.json" },
      ],
    }),
    ],
    
}