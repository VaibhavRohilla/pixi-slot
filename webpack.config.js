const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    entry: './src/index.ts',
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
                    filename: 'assets/[name][ext]'
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
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, "./")
        }),
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/assets',
                    to: 'assets'
                }
            ]
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
            publicPath: '/'
        },
        compress: true,
        port: 8080,
        hot: true,
        historyApiFallback: true
    }
}; 