const path = require('path');
const webpack = require('webpack');

// 插件
const WebpackRemoveHashedFiles = require('webpack-remove-hashed-files');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
// 根据模板自动生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HappyPack = require('happypack');

const distDir = './dist/';

const config = {
    context: path.resolve(__dirname, '../src'),
    entry: {
        vendor: ['react','react-dom'],
        index: './index.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[chunkhash:5].js',
        // 生产环境publicPath值为cdn路径
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                use: 'babel-loader?cacheDirectory',
                include: path.resolve(__dirname, '../src')
            },
            {
                test: /.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true,
                                sourceMap: true
                            }
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
            },
            {
                // 对非文本文件采用 file-loader 加载
                test: /\.(gif|png|jpe?g|eot|woff|ttf|pdf|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/image/[name].[ext]'
                        }
                    }
                ],
            },
            {
                // svg文件使用svg-inline-loader
                test: /.svg$/,
                use: 'svg-inline-loader'
            }
        ],
    },
    plugins: [
        new WebpackRemoveHashedFiles(distDir),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextWebpackPlugin({
            filename: '[name].[contenthash:5].css'
        }),
        new HtmlWebpackPlugin({
            title: '首页',
            template: '../static/index.html',
            favicon: '../assets/favicon.ico'
        }),
        new HtmlWebpackPlugin({
            filename: '404.html',
            template: '../static/404.html',
            inject: false,
            favicon: '../assets/favicon.ico'
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
            },
            parallel: true
        }),
        new BundleAnalyzerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: 'vendor',
            minChunks: Infinity,
        })
    ]
};

module.exports = config;
