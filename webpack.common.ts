import { resolve } from 'path';
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

// boolean indicating if current build is dev or prod
const prod: boolean = module.parent.id.includes('.prod');

export default <webpack.Configuration>{
    entry: {
        game: resolve(__dirname, 'src/ts/game.ts'), // string | object | array
    },
    // defaults to ./src
    // Here the application starts executing
    // and webpack starts bundling
    output: {
        // options related to how webpack emits results
        path: resolve(__dirname, 'bundle'), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: `[name]${prod ? '.[contenthash]' : ''}.js`, // string
        // the filename template for entry chunks
        // publicPath: "/assets/", // string
        // the url to the output directory resolved relative to the HTML page
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: {
            // bundle runtime with preload chunk
            name: 'preload',
        },
        splitChunks: {
            cacheGroups: {
                nprogress: {
                    test: (module: any): boolean => {
                        return (
                            module.resource &&
                            module.resource.includes('nprogress') &&
                            !module.resource.endsWith('.css')
                        );
                    },
                    name: 'nprogress',
                    chunks: 'all',
                },
                vendor: {
                    test: (module: any): boolean => {
                        return (
                            module.resource &&
                            /[\\/]node_modules[\\/]/.test(module.resource) &&
                            !module.resource.includes('nprogress') &&
                            !module.resource.endsWith('.css')
                        );
                    },
                    name: 'vendors',
                    chunks: (chunk: webpack.compilation.Chunk): boolean => {
                        // needed to enable preload chunk tu execute as soon as
                        // it loads, without waiting for other chunks to load
                        return chunk.name !== 'preload';
                    },
                },
            },
        },
        minimizer: [
            new TerserPlugin({
                // webpack defaults
                // https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js#L310
                cache: true,
                parallel: true,
                sourceMap: !prod,
                // custom, for removing comments
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    module: {
        // configuration regarding modules
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            allowTsInNodeModules: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // only enable hot in development
                            hmr: !prod,
                        },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.ejs$/,
                loader: 'compile-ejs-loader',
            },
            {
                test: require.resolve('phaser'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'Phaser',
                    },
                ],
            },
            {
                test: /\.(ttf|eot|woff|woff2|otf)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },
            /**
             * Assets
             */
            {
                test: /\.(jpe?g|png|gif|svg|mp3|ogg|fnt)$/i,
                loader: 'file-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'], // .js for Phaser imports
        // extensions that are used
        alias: {
            '@clientframework': resolve(__dirname, './@clientframework'),
            '@logic': resolve(__dirname, './logic/src'),
            '@backendService': resolve(
                __dirname,
                './@clientframework/common/backend-service/src'
            ),
            '@commonEngine': resolve(
                __dirname,
                './@clientframework/slots/engine/@clientframework/common/engine/src/ts'
            ),
            '@slotsEngine': resolve(
                __dirname,
                './@clientframework/slots/engine/src/ts'
            ),
            '@specific': resolve(__dirname, './src/ts'),
            ASSETS_DIR_COMMON: resolve(
                __dirname,
                './@clientframework/slots/engine/@clientframework/common/engine/assets'
            ),
            ASSETS_DIR: resolve(__dirname, './src/assets'),
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(true),
            'typeof EXPERIMENTAL': JSON.stringify(false),
            'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
            'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
            // 'process.env': {
            //     'ASSETS_DIR_COMMON': JSON.stringify('./@clientframework/slots/engine/@clientframework/common/engine/assets'),
            //     'ASSETS_DIR': JSON.stringify('./src/assets')
            // }
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/ejs/index.ejs',
            templateParameters: {
                title: 'Eight Golden Dragons',
            },
            minify: prod
                ? {
                      removeComments: true,
                      collapseWhitespace: true,
                      conservativeCollapse: true,
                  }
                : {},
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            chunkFilename: `style${prod ? '.[contenthash]' : ''}.css`,
        }),
    ],
};
