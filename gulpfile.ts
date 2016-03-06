/**
 * gulpfile module. set up gulp tasks
 * @module gulpfile
 */
import * as gulp from 'gulp';
import * as nodemon from 'gulp-nodemon';
import * as tslint from 'gulp-tslint';
// var jshint = require('gulp-jshint');
// var mocha = require('gulp-mocha');
// var nodemon = require('gulp-nodemon');
// var stylish = require('jshint-stylish');
//


// const paths = {
//     jshintFiles: ['*.js', 'routes/**/*.js', 'models/**/*.js', 'tests/**/*.js'],
//     testFiles: './tests/**/*test.js',
//     tslintFiles: ['gulpfile.ts']
// };


gulp.task('tslint', () =>
    gulp.src(['gulpfile.ts', 'app.ts'])
        .pipe(tslint())
        .pipe(tslint.report('verbose'))
);

gulp.task('default', ['tslint'], function () {
    nodemon({ script: './bin/www.js',
            ext: 'html js',
            tasks: ['tslint'],
            execMap: {'js':'node --debug'},
            env: {
              'NODE_ENV': 'development',
              'DEBUG':'server:*,express:application,mongo-website:*'
            }
        })
        // .on('crash', nodemon.restart)
        .on('restart', function () {
            console.log('restarted!');
        });

});

