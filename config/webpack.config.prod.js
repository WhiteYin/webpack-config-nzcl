const Webpack = require('webpack');
const path = require('path');

// 插件
const WebpackRemoveHashedFiles = require('webpack-remove-hashed-files');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const distDir = './dist/';

const config = {
    context: path.resolve(__dirname, '../src'),
    entry: {
        index: './index.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[chunkhash:5].js',
        // 生产环境publicPath值为cdn路径
        publicPath: ''
    },
    rules: [
        {
            test: /.jsx?$/,
            use: 'babel-loader',
            include: path.resolve(__dirname, '../src')
        },
        {
            test: /.less$/,
            use: ExtractTextWebpackPlugin.extract({
                use: [
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ],
                fallback: 'style-loader'
            })
        }
    ],
    plugins: [
        new WebpackRemoveHashedFiles(distDir),
        new ExtractTextWebpackPlugin({
            filename: '[name].[contenthash:5].css'
        }),
        // 压缩输出的 JavaScript 代码
        new UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        })
    ]
};

module.exports = config;
