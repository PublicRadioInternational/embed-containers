var basePath = '../',					// relative path to repository root
	fontPathSegment = 'components-font-awesome/fonts/';

var buildPath = basePath + 'dist/', 	// path from repo root to dist folder
	jsPath = basePath + 'src/js/',
	htmlPath = basePath + 'src/html/',
	lessPath = basePath + 'src/contents/less/',
	libPath = basePath + 'bower_components/',
	fontPath = libPath + fontPathSegment;

var gulp = require('gulp'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	gConcat = require('gulp-concat'),
	watch = require('gulp-watch'),
	config = require(basePath + 'config.json');

var htmlDest = config.serverRoot + '/',
	jsDest = config.serverRoot + '/js/',
	cssDest = config.serverRoot + '/contents/',
	libDest = config.serverRoot + '/lib/';
var fontDest = libDest + fontPathSegment;

gulp.task('devLess', function(){		// development less task
	gulp.src(lessPath + 'main.less')
		.pipe(less())
		.pipe(gulp.dest(cssDest));
});

gulp.task('devConcatJs', function()		// development concatenation task for javascript
{										// same as concatJs but it does not uglify
	gulp.src(jsPath + '*.js')
		.pipe(gConcat('main.js'))
		.pipe(gulp.dest(jsDest));
});

gulp.task('move', function()
{
	gulp.src(htmlPath + '**/*')
		.pipe(gulp.dest(htmlDest));
});

// TODO : include library style sheets in production release?
gulp.task('less', function(){			// production less task
	gulp.src(lessPath + 'embed-containers.less')	
		.pipe(less())
		.pipe(minifyCss())
		.pipe(gulp.dest(buildPath));
});

gulp.task('concatJs', function()
{
	gulp.src([jsPath + 'entityEmbedAddon.js',
			jsPath + 'modal.js'])
		.pipe(gConcat('embed-containers.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(buildPath));
});

gulp.task('copyLibJs', function(){
	gulp.src(libPath + '**/*.js')
		.pipe(gulp.dest(libDest));
});

gulp.task('copyLibCss', function(){
	gulp.src(libPath + '**/*.css')
		.pipe(gulp.dest(libDest));
});

gulp.task('copyLibFonts', function()
{
	gulp.src(fontPath + '*')
		.pipe(gulp.dest(fontDest));
});

gulp.task('copyLib', ['copyLibJs', 'copyLibCss', 'copyLibFonts']);

gulp.task('watchLess', function()
{
	gulp.watch(lessPath + '*.less', ['devLess']);
});

gulp.task('watchJs', function()
{
	gulp.watch(jsPath + '*.js', ['devConcatJs']);
});

gulp.task('watchHtml', function()
{
	gulp.watch(htmlPath + '**/*.html', ['move']);
});

gulp.task('watchPhp', function()
{
	gulp.watch(htmlPath + '**/*.php', ['move']);
});

gulp.task('watch', ['watchLess', 'watchJs', 'watchHtml', 'watchPhp']);

gulp.task('default', ['copyLib', 'devLess', 'devConcatJs', 'move', 'watch']);

gulp.task('build', ['less', 'concatJs'])