var gulp = require('gulp'),
    inlineCss = require('gulp-inline-css');

gulp.task('default', function() {
    return gulp.src('index.html')
        .pipe(inlineCss({
        	preserveMediaQueries:true,
        	removeStyleTags:false
        }))
        .pipe(gulp.dest('inline/'));
});