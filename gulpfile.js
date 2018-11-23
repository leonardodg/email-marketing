var gulp = require('gulp'),
    inlineCss = require('gulp-inline-css'),
	  styleInject = require("gulp-style-inject"),
    watch = require('gulp-watch'),
    compass = require('gulp-compass');
    
/*gulp.task('compass', function() {
  console.log('compass');
  return gulp.src('./sass/*.scss')
              .pipe(compass({
                config_file: './config.rb',
                css: 'stylesheets',
                sass: 'sass'
              }))
              .pipe(gulp.dest('estilos'));
});*/

gulp.task('default', function() {
 return gulp.src('index.html')
            .pipe(styleInject())    
                .pipe(inlineCss({
                  preserveMediaQueries:false,
                  removeStyleTags:false,
                  applyStyleTags:false
                  //applyLinkTags : false
                }))
                .pipe(gulp.dest('inline/'))
});

/*gulp.task('default', function () {
    gulp.watch('sass/*.scss', ['compass']);
    gulp.watch('estilos/*.css', ['inlineCss']);
    //gulp.watch('sass/*.scss', ['styleInject']);
    // watch(['./sass/*.scss', './estilos/*.css'], ['compass','inlineCss']);
});*/

//gulp.task('default']);