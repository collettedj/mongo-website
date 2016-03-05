/**
 * gulpfile module. set up gulp tasks
 * @module gulpfile
 */
"use strict";
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
// var jshint = require('gulp-jshint');
// var mocha = require('gulp-mocha');
// var nodemon = require('gulp-nodemon');
// var stylish = require('jshint-stylish');
//
var paths = {
    jshintFiles: ['*.js', 'routes/**/*.js', 'models/**/*.js', 'tests/**/*.js'],
    testFiles: './tests/**/*test.js'
};
gulp.task('default', function () {
    nodemon({ script: './bin/www.js',
        ext: 'html js',
        tasks: ['lint'],
        execMap: { 'js': 'node --debug' },
        env: {
            'NODE_ENV': 'development',
            'DEBUG': 'server:*,express:application,mongo-website:*'
        }
    })
        .on('restart', function () {
        console.log('restarted!');
    });
});
//# sourceMappingURL=gulpfile.js.map