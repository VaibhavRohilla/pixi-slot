import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import common from './webpack.common';
import * as OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

export default merge(common, <webpack.Configuration>{
    mode: 'production', // "production" | "development" | "none"
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    plugins: [
        // list of additional plugins
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
        }),
    ],
});
