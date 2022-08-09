'use strict';
var webpack = require('webpack');
var path = require("path");
var APP = __dirname + '/app';
let ExtractTextPlugin = require('extract-text-webpack-plugin');

// multiple extract instances
let extractCSS = new ExtractTextPlugin('vendor.css');
let extractSASS = new ExtractTextPlugin('app.css');

module.exports = {
    context: APP,
    entry: {
        app: ['webpack/hot/dev-server', './core/bootstrap.js']
    },
    output: {
        path: APP,
        publicPath: "http://localhost:8080/", // Development server
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jade$/,
                loader: 'raw!jade-html'
            },
            {
                test: /\.scss$/,
                loader: extractSASS.extract(['css','sass'])
            },
            {
                test: /\.css$/,
                loader: extractCSS.extract("style-loader", "css-loader")
            },
            {
                test: /\.js$/,
                loader: 'ng-annotate!babel!eslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(woff|woff2|ttf|eot|otf)$/,
                loader: 'file'
            },
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                loader: 'file'
            }
        ]
    },
    resolve: {
        root: [path.join(__dirname, "bower_components")]
    },
    plugins: [
        extractCSS,
        extractSASS,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ],
    // devServer: {
    //     proxy: {
    //         '/api/*': 'http://localhost:8000'
    //     }
    // }
};
