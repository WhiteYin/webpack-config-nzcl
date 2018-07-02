const webpack = require('webpack');
const path = require('path');

// 插件
const WebpackRemoveHashedFiles = require('webpack-remove-hashed-files');
// 根据模板自动生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distDir = './build/';

const config = {
    // 文件上下文为src文件夹
    context: path.resolve(__dirname, '../src'),
    entry: {
        // 入口为context+'index.js'
        index: './index.js'
    },
    output: {
        // 开发环境构建输出到build目录下
        path: path.resolve(__dirname, '../build'),
        // 5位hash，不要在开发环境中使用chunkhash，因为这样会增加编译负担
        filename: '[name].[hash:5].js',
        // 开发环境publicPath值为空
        publicPath: ''
    },
    // 开发环境使用轻量级的eval-source-map
    devtool: 'eval-source-map',
    devServer: {
        // 使用inline模式实现自动刷新
        inline: true,
        // 开启热更新
        hot: true,
        // 监听端口4000
        port: 4000,
        // 由于以后要开发PWA应用，所以需要开启https。证书由webpack自动生成
        https: true,
        historyApiFallback: {
            rewrites: [
                // 404页面路由
                {
                    from: /./,
                    to: '404.html'
                }
            ]
        }
    },
    module: {
        rules: [
            {
                // 处理js或jsx文件
                test: /.jsx?$/,
                // 启用缓存目录
                use: 'babel-loader?cacheDirectory',
                // 只对src文件夹中的文件进行处理
                include: path.resolve(__dirname, '../src')
            },
            {
                // 处理less文件
                test: /.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        // 使用postcss，配置见postcss.config.js
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                // 对非文本文件采用 file-loader 加载
                test: /\.(gif|png|jpe?g|eot|woff|ttf|pdf|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ],
            },
            {
                // svg文件使用svg-inline-loader
                test: /.svg$/,
                use: 'svg-inline-loader'
            }
        ]
    },
    plugins: [
        new WebpackRemoveHashedFiles(distDir),
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
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;
