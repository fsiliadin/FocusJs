var gulp = require('gulp')
    concat = require('gulp-concat')
    uglify = require('gulp-uglify')


gulp.task('uglify', function(){
    return gulp.src('focus.js')
    .pipe(uglify('focus.min.js', {}))
    .pipe(gulp.dest('.'))
});