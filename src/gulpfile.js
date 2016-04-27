var basePath = '../',					// relative path to repository root
	fontPathSegment = 'font-awesome/fonts/';

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
	htmlmin = require('gulp-htmlmin'),
	templateCache = require('gulp-angular-templatecache'),
	config = require(basePath + 'config.json');

var htmlDest = config.serverRoot + '/',
	jsDest = config.serverRoot + '/js/',
	cssDest = config.serverRoot + '/contents/',
	libDest = config.serverRoot + '/lib/';
var fontDest = libDest + fontPathSegment;

// PRODUCTION TASKS

gulp.task('move', function()
{
	gulp.src([htmlPath + '**/*',
			'!' + htmlPath + 'index.html'])
		.pipe(gulp.dest(buildPath + 'contents/'));
});

gulp.task('less', function(){
	gulp.src([lessPath + 'embed-containers.less',
			libPath + 'EasyAutocomplete/dist/easy-autocomplete.min.css'])
		.pipe(less())
		.pipe(gConcat('embed-containers.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest(buildPath + 'css/'));
});

gulp.task('templateCache', function() {
	gulp.src([htmlPath + '**/*',
			'!' + htmlPath + 'index.html'])
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(templateCache('templateCache.js', {
			moduleSystem: 'IIFE',
			templateHeader: 'EntityEmbed = EntityEmbed || {}; var templateCache = {};',
			templateBody: 'templateCache["<%= url %>"] = "<%= contents %>";',
			templateFooter: 'EntityEmbed.templateCache = templateCache;'
		}))
		.pipe(gulp.dest(jsPath));
});

gulp.task('concatJs', function()
{
	gulp.src([jsPath + 'templateCache.js',
			jsPath + 'apiService.js',
			jsPath + 'entityEmbedToolbar.js',
			jsPath + 'genericEmbed.js',
			jsPath + 'modal.js',
			jsPath + 'confirmModalDefaults.js',
			jsPath + 'embedModalDefaults.js',
			jsPath + 'embeds/*.js',
			jsPath + 'embedModal.js',
			jsPath + 'entityEmbedAddon.js',
			libPath + 'EasyAutocomplete/dist/jquery.easy-autocomplete.min.js'])
		.pipe(gConcat('embed-containers.js'))
		.pipe(gulp.dest(buildPath + 'js/'))
		.pipe(gConcat('embed-containers.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(buildPath + 'js/'));
});

// DEVELOPMENT TASKS

gulp.task('devLess', function(){
	gulp.src([lessPath + 'main.less',
			lessPath + '/priEmbeds/priEntityEmbeds.less'])
		.pipe(less())
		.pipe(gulp.dest(cssDest));
});

gulp.task('devConcatJs', function()
{
	gulp.src([jsPath + 'templateCache.js',
			jsPath + 'apiService.js',
			jsPath + 'entityEmbedToolbar.js',
			jsPath + 'genericEmbed.js',
			jsPath + 'modal.js',
			jsPath + 'confirmModalDefaults.js',
			jsPath + 'embedModalDefaults.js',
			jsPath + 'embeds/*.js',
			jsPath + 'embedModal.js',
			jsPath + 'entityEmbedAddon.js',
			jsPath + 'demo.js'])
		.pipe(gConcat('main.js'))
		.pipe(gulp.dest(jsDest));
});

gulp.task('devMove', function()
{
	gulp.src(htmlPath + '**/*')
		.pipe(gulp.dest(htmlDest));
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
	gulp.watch(lessPath + '**/*.less', ['devLess']);
});

gulp.task('watchJs', function()
{
	gulp.watch([jsPath + '*.js', jsPath + 'embeds/*.js'], ['devConcatJs']);
});

gulp.task('watchHtml', function()
{
	gulp.watch(htmlPath + '**/*.html', ['templateCache', 'devConcatJs', 'devMove']);
});

gulp.task('watchPhp', function()
{
	gulp.watch(htmlPath + '**/*.php', ['devMove']);
});

gulp.task('watch', ['watchLess', 'watchJs', 'watchHtml', 'watchPhp']);

gulp.task('default', ['copyLib', 'devLess', 'templateCache', 'devConcatJs', 'devMove', 'watch']);

gulp.task('build', ['less', 'templateCache', 'concatJs', 'move'])