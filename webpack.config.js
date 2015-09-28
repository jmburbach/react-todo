module.exports = {  
    entry: './todo/static/js/src/main.js',
    output: {
        path: './todo/static/js/dist',
        filename: 'application-bundle.js'
    },
    module: {
        loaders: [{
            test: /todo\/static\/js\/src\/.+.js$/,
            loader: 'babel'
        }]
    },
    externals: {
        'jquery': 'jQuery'
    }
};
