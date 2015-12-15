var gulp = require('gulp');
var gUtil = require('gulp-util');
var gLess = require('gulp-less');
var gUglify = require('gulp-uglify');

var basePath = '../'; // relative path to repository root
var jsPath = basePath + 'src/js/';
var htmlPath = basePath + 'src/html/';
var lessPath = basePath + 'src/contents/less/';
var mainLessPath = lessPath + 'main.less';

gulp.task('less', function(){
	gulp.src(mainLessPath)
		.pipe(gLess())
		.pipe(gulp.dest(htmlPath));
});

gulp.task('default', ['less']);