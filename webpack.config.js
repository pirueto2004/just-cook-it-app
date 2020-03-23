const path = require('path'); //'path' is an npm built-in package
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =  {
    entry: ['babel-polyfill','./src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'js/bundle.js'
       
    },
    // mode: 'development'
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            fileName: 'index.html',
            template: './src/index.html'
        })
    ]
};