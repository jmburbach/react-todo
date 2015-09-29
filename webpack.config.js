var fs = require('fs');
var webpack = require('webpack');

var cacheDirectory = './.build-cache';
var production = (process.env.NODE_ENV === 'production');
var plugins = [];

if (production) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({comments: false, sourceMap: false}));
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.OccurenceOrderPlugin(true));
}

if (!fs.existsSync(cacheDirectory)) {
    fs.mkdirSync(cacheDirectory);
}

module.exports = {  
    entry: './todo/static/js/src/main.js',
    output: {
        path: './todo/static/js/dist',
        filename: 'application-bundle.js'
    },
    module: {
        loaders: [{
            test: /todo\/static\/js\/src\/.+.js$/,
            loader: 'babel-loader',
            query: {
                cacheDirectory: cacheDirectory
            }
        }]
    },
    externals: {
        'jquery': 'jQuery'
    },
    plugins: plugins
};
