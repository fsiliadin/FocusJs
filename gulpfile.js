var gulp = require('gulp')
var concat = require('gulp-concat');
var uglifyCSS = require('gulp-uglifycss')


// concats and minify css
gulp.task('compressCss', function(){
    return  gulp.src('./components/*/*.css')
        .pipe(concat('focus.css'))
        .pipe(uglifyCSS())
        .pipe(gulp.dest('./'))

})
