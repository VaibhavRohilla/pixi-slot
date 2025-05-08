import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';
import * as _ from 'lodash';

/**
 * based on HTML Webpack Injector Plugin
 * https://github.com/thearchitgarg/html-webpack-injector/blob/c3b5e1c1ffb29ee46e82f1d2b7938dbb18a240fe/index.js
 */

export default class HtmlWebpackHeadInjectorPlugin implements webpack.Plugin {
    chunkNames: string[] = [];

    constructor(chunkNames?: string[]) {
        _.merge(this.chunkNames, chunkNames);
    }

    apply(compiler: webpack.Compiler): void {
        if ((<any>HtmlWebpackPlugin).getHooks) {
            // HtmlWebpackPlugin version 4.0.0-beta.5

            throw Error('Update HtmlWebpackHeadInjectorPlugin logic for ^v4');
        } else {
            // HtmlWebpackPlugin version 3.2.0

            compiler.hooks.compilation.tap(
                'HtmlWebpackHeadInjectorPlugin',
                (compilation: webpack.compilation.Compilation) => {
                    (<any>(
                        compilation.hooks
                    )).htmlWebpackPluginAlterAssetTags.tapAsync(
                        'HtmlWebpackHeadInjectorPlugin',
                        (data: any, callback: Function) => {
                            _.forEach(this.chunkNames, (chunkName: string) => {
                                const chunk = _.find(data.chunks, {
                                    id: chunkName,
                                }) as webpack.compilation.Chunk;

                                _.forEach(chunk.files, (fileName: string) => {
                                    const tag = _.find(
                                        data.body,
                                        (t): boolean => {
                                            if (t.tagName === 'link') {
                                                return (
                                                    t.attributes.href ===
                                                    fileName
                                                );
                                            } else if (t.tagName === 'script') {
                                                return (
                                                    t.attributes.src ===
                                                    fileName
                                                );
                                            }
                                        }
                                    );

                                    if (tag) {
                                        _.pull(data.body, tag);

                                        data.head.push(tag);
                                    }
                                });
                            });

                            callback(null, data);
                        }
                    );
                }
            );
        }
    }
}
