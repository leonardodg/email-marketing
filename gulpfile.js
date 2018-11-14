var gulp = require('gulp'),
    inlineCss = require('gulp-inline-css'),
	styleInject = require("gulp-style-inject");    

gulp.task('default', function() {
    return gulp.src('index.html')
		.pipe(styleInject())    
        .pipe(inlineCss({
        	preserveMediaQueries:false,
        	removeStyleTags:false,
        	applyStyleTags:false
        	//applyLinkTags : false
        }))
        .pipe(gulp.dest('inline/'));
});