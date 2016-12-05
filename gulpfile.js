var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var bs = require('browser-sync').create();
var glob = require('glob');
var clean = require('gulp-clean')

/**  Configuration **/

// Source location
var SOURCE = 'src/'
//DEV env destination
var DEV_LOC = 'dev_build/';
//PROD destination
var PROD_LOC = 'prod_build/';
//Index file name
var INDEX_FILE = 'index.html';

/** Compile Scripts  **/
gulp.task('scripts', ['compile-scripts', 'clean-scripts'] );

gulp.task('compile-scripts',function(){
	var tsResult = gulp.src(SOURCE + 'scripts/**/*.ts') 
		.pipe(tsProject());
	var endDest = DEV_LOC + 'scripts/';
	return tsResult.js
		.pipe(gulp.dest(endDest));
});

gulp.task('clean-scripts', function(){
	find_diff(SOURCE, '.ts', DEV_LOC, '.js');
});

/** Build styles  **/
gulp.task('styles', ['compile-styles', 'clean-styles']);

gulp.task('compile-styles', function(){
	var endDest = DEV_LOC + 'styles/';
    gulp.src(SOURCE + 'styles/**/*.css')
        .pipe(gulp.dest(endDest));
});

gulp.task('clean-styles', function(){
	find_diff(SOURCE, '.css', DEV_LOC, '.css');
});

/** Compile views  **/
gulp.task('views', ['compile-views', 'clean-views']); 

gulp.task('compile-views', function(){
	var endDest = DEV_LOC + 'views/';
    gulp.src(SOURCE + 'views/**/*.html')
        .pipe(gulp.dest(endDest));
});

gulp.task('clean-views', function(){
	find_diff(SOURCE, '.html', DEV_LOC, '.html');
});

/** Update Index **/
gulp.task('index', ['add-index']);

gulp.task('add-index', function() {
    var endDest = DEV_LOC;
	delete_files(['index.html'])
    gulp.src(SOURCE + INDEX_FILE)
        .pipe(gulp.dest(endDest));
});

gulp.task('inject', function(){
	inject_files();
});

/** Dev build **/
gulp.task('build:dev', ['scripts', 'styles', 'views', 'index'], function(){
	inject_files();
});

/** Serve **/
gulp.task('serve', ['build:dev'], function(){
    bs.init({
		server: {
			baseDir: DEV_LOC
		}
    });
});
/** Official Build  **/

/** Watch **/
// (watch_source) 
// Watch the source: when a source changes, perform the corresponding build piece, update dev_build

//Clean dev location
gulp.task('clean-dev', function(){
	glob('**/*', {cwd: DEV_LOC}, function(err, files){
		if(err) {
			throw err;
		}
		else {
			delete_files(files);
		}
	});
});

//Helpers
function delete_files(arr) {
	console.log("Removing files: ");
	console.log(arr);
	return gulp.src(arr, {cwd: DEV_LOC})
		.pipe(clean());
}

function find_diff(source_loc, source_type, end_loc, end_type){
	glob('*' + end_type, {cwd: end_loc}, function(err, destination_files){
		if (err) {
			throw err;
		}
		else {
			var destination_map = destination_files.map(function(obj){
				return obj.replace(end_type, source_type);
			});
			glob('**/*' + source_type, {cwd: SOURCE}, function(err, source_files){
				var to_delete = [];
				for(var index in destination_map) {
					var end_path = destination_map[index];
					var index = source_files.indexOf(end_path);
					if(index === -1) {
						end_path = end_path.replace(source_type, end_type);
						to_delete.push(end_path);
					}
				}
				delete_files(to_delete);
			});
		}
	});
};

function inject_files() {
    var target = gulp.src(DEV_LOC + 'index.html');
    var sources = gulp.src([DEV_LOC + '**/*.js', DEV_LOC + '**/*.css'], {read: false});
 
    return target.pipe(inject(sources,
    {
        ignorePath: DEV_LOC,
        addRootSlash: false
    }))
        .pipe(gulp.dest(DEV_LOC));
}