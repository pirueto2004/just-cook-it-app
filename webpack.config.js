const path = require('path'); //'path' is an npm built-in package
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    // mode: 'development'
    devServer: {
       contentBase: './dist',
       open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            fileName: './dist/index.html',
            template: './src/index.html'
        }),
        
    ],
    module: {
        rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    // Loads the javacript into html template provided.
                    // Entry point is set below in HtmlWebPackPlugin in Plugins 
                    test: /\.html$/,
                    use: [
                      {
                        loader: "html-loader",
                        //options: { minimize: true }
                      }
                    ]
                }
        ]
    }
};