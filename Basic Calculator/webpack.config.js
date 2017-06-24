var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    debug: true,

    //  Defines the entrypoint of our application.
    entry: path.resolve(__dirname, './src/js/loadCalculator.js'),

    //  Bundle to a ./build/public/bundle.js file.
    output: {
        path: path.resolve(__dirname, './build/public'),
        filename: 'basic-calculator-1.0.0.combine.js'
    },

    //  Use babel for anything that is *.js or *.jsx.
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, './src/js')
            }
        ]
    }
};