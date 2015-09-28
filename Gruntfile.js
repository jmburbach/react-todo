module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-webpack-without-server');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config.js');

    grunt.initConfig({
        webpack: {
            options: webpackConfig,
            build: {
                devtool: 'sourcemap',
                debug: true
            }
        },
        watch: {
            app: {
                files: ['todo/static/js/src/**/*.js'],
                tasks: ['webpack:build'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', ['webpack']);

    // Build and watch cycle (another option for development)
    // Advantage: No server required, can run app from filesystem
    // Disadvantage: Requests are not blocked until bundle is available,
    //               can serve an old app on too fast refresh
    grunt.registerTask('dev', ['webpack:build', 'watch:app']);

    // Production build
    grunt.registerTask('build', ['webpack:build']);
};
