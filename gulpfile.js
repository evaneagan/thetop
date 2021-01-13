const gulp = require('gulp');

const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')
const postcssPresetEnv = require('postcss-preset-env')

const browserSync = require('browser-sync').create();

const webpack = require('webpack-stream')

const imagemin = require('gulp-imagemin')

const ghpages = require("gh-pages")


const { watch, parallel } = require('gulp');







function runCss(cb) {

    gulp.src([
        'src/css/reset.css',
        'src/css/typography.css',
        'src/css/app.css',
    ])
    .pipe(sourcemaps.init())
        .pipe(
            postcss([
                require('autoprefixer'),
                require('postcss-preset-env'),
                postcssPresetEnv({
                    stage:1,
                    browsers: ['IE 11', 'last 2 versions']
                }),
        ])
      )
      .pipe(concat('app.css'))
      .pipe(cleanCss({compatibility: 'ie8'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream())
      cb();

}

function HTML(cb) {
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))

    cb();
}

function images(cb){
    gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))

    cb();
}

function fonts(cb){
    gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'))

    cb();
}

function data(cb){
    gulp.src('src/data.js')
    .pipe(gulp.dest('dist'))

    cb();
}

function scripts(cb){
    gulp.src('src/js/*')
    .pipe(
        webpack({
            mode: 'production',
            devtool: 'source-map',
            output: {
                filename:'app.js'
            }
        })
    )
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream())

    cb();
}



// function Sync(cb){

//     browserSync.init({
//         server: {
//             baseDir: ('dist')
//         }
//     })

//     cb();
// }



exports.deploy = function(cb) {
    ghpages.publish('dist') 

    cb();
}

exports.default = function() {

    browserSync.init({
        server: {
            baseDir: ('dist')
        }
    })

    watch('src/js/*', scripts);
    watch('src/css/app.css', runCss);
    watch('src/css/typography.css', runCss);
    watch('src/img/*', images);
    watch('src/fonts/*', fonts);
    watch('src/data.js', data);
    watch('src/*.html', parallel(HTML, fonts, images, scripts, data)).on('change', browserSync.reload); 
    

    
};