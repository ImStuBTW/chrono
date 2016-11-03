var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    return gulp.src('./public/sass/**/*.scss')
               .pipe(sass().on('error', sass.logError))
               .pipe(gulp.dest('./public/css'));
});

gulp.task('libraries', function() {
    gulp.src('./node_modules/react/dist/react.min.js')
    .pipe(gulp.dest('./public/js/react'));
    gulp.src('./node_modules/react-dom/dist/react-dom.min.js')
    .pipe(gulp.dest('./public/js/react-dom'));
    gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./public/js/jquery'));
    gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(gulp.dest('./public/fonts/bootstrap'));
    gulp.src('./node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js')
    .pipe(gulp.dest('./public/js/bootstrap'));
});

gulp.task('build', function() {
    browserify({entries: './app.js'})
        .external(['./public/js/react.min.js','./public/js/react-dom.min.js'])
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public/js'));
    browserify({entries: './split.js'})
        .external(['./public/js/react.min.js','./public/js/react-dom.min.js'])
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('split.js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('serve', ['sass', 'build', 'libraries'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./public/sass/**/*.scss', ['sass']);
    gulp.watch('./*.js', ['build']);
    gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', ['sass', 'build', 'libraries'], function() {
    //console.log('Default Task Complete');
});

gulp.task('watch', ['sass', 'build', 'libraries'], function() {
    gulp.watch('./public/sass/**/*.scss', ['sass']);
    gulp.watch('./*.js', ['build']);
});
