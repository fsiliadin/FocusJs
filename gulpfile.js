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

gulp.task('concatTests', function() {
	return gulp.src('./test/components/*/*.js')
		.pipe(concat('tests.js'))
		.pipe(gulp.dest('./test/'))
})