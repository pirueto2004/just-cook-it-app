const path = require('path'); //'path' is an npm built-in package
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =  {
    entry: ['babel-polyfill','./src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    // mode: 'development'
    devServer: {
        port: 8080,
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            fileName: './index.html',
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                API_url: 'API_url',
                'NODE_ENV': JSON.stringify('production')
            },
          }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};