var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
//var BaseURL = "https://www.gdbase.be/simulations/";
module.exports = {
    entry:"./scripts/imports.js",
    output: {
        filename: "gdbase.js",
    },
    devServer: {
        contentBase: './',
        stats: { colors: true },
        hot:true,
        inline:true
    },
    module: {
        loaders: [{
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg)$/,
                loader: "file-loader?name=assets/[path][name].[ext]"
            },
            {
                test: /\.(html)$/,
                loader: "file-loader?name=./[path][name].[ext]"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?(\-alpha\.[0-9])?$/,
                loader: "file-loader?name=assets/[path][name].[ext]"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?(\-alpha\.[0-9])?$/,
                loader: "file-loader?name=assets/[path][name].[ext]"
            },
            {
                test: /jquery-mousewheel/,
                loader: "imports?define=>false&this=>window"
            },
            {
                test: /malihu-custom-scrollbar-plugin/,
                loader: "imports?define=>false&this=>window"
            }
        ]
    }
}