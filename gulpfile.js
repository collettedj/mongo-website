"use strict";

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var stylish = require('jshint-stylish');

var paths = {
    jshintFiles: ['*.js', 'routes/**/*.js', 'models/**/*.js', 'tests/**/*.js'],
    testFiles: './tests/**/*test.js'
};


gulp.task('lint', function() {
    return gulp.src(paths.jshintFiles)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
}); 

var handleError = function (err) {
    console.log(err.toString());
    this.emit('end');
};

// gulp.task("test", ['lint'], function() {
//     process.env.NODE_ENV = 'test';
//     return gulp.src(paths.testFiles)
//         .pipe(mocha({ 
//             reporter: "spec" 
//         })
//         .on("error", handleError));
// });

gulp.task('default', ['lint'], function () {
    nodemon({ script: './bin/www.js',
            ext: 'html js',
            tasks: ['lint'],
            execMap: {'js':'node --debug'},
            env: { 
              'NODE_ENV': 'development',
              'DEBUG':'server:*,express:application,mongo-website:*'
            }
        })
        .on('restart', function () {
            console.log('restarted!');
        }); 
});

