var gulp = require('gulp');
var util = require('gulp-util');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var basePath = '../'; // relative path to repository root
var jsPath = basePath + 'src/js/';
var htmlPath = basePath + 'src/html/';
var lessPath = basePath + 'src/contents/less/';
var mainLessPath = lessPath + 'main.less';

gulp.task('less', function(){
	gulp.src(mainLessPath)
		.pipe(less())
		.pipe(gulp.dest(htmlPath));
});

gulp.task('watch', function()
{
	gulp.watch(lessPath + '*.less', ['less']);
});

gulp.task('default', ['less', 'watch']);