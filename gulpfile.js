var gulp = require('gulp');
var sass = require('gulp-sass');
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

gulp.task('react-dom', function() {
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./public/sass/**/*.scss', ['sass']);
    gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', ['sass', 'libraries'], function() {
    //console.log('Default Task Complete');
});

gulp.task('watch', ['sass', 'libraries'], function() {
    gulp.watch('./public/sass/**/*.scss', ['sass']);
});
