import * as webpack from 'webpack';
import prod from './webpack.config.prod';
import * as merge from 'webpack-merge';

export default merge(prod, <webpack.Configuration>{
    module: {
        // configuration regarding modules
        rules: [
            { test: /\.*(ts)$/, loader: "strip-loader?strip[]=debug,strip[]=console.log" }
        ]
    }
});
