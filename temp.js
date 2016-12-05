var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var bs = require('browser-sync').create();

/**  Configuration **/

//DEV env destination
var DESTINATION = 'dev_build/';
//PROD destination
var PROD_LOC = 'prod_build/';
//Index file name
var INDEX_FILE = 'index.html';


/** Compile Scripts  **/

gulp.task('scripts', function() {
    var tsResult = gulp.src("./src/scripts/**/*.ts") 
        .pipe(tsProject());
    var endDest = DESTINATION + 'scripts/';
    return tsResult.js
        .pipe(gulp.dest(endDest));
});

/** Build styles  **/
gulp.task('styles',function() {
    var endDest = DESTINATION + 'styles/';
    gulp.src('./src/styles/**/*.css')
        .pipe(gulp.dest(endDest));
});

/** Compile views  **/
gulp.task('views', function() {
    var endDest = DESTINATION + 'views/';
    gulp.src('src/**/*.html')
        .pipe(gulp.dest(endDest));
});

/** Update Index **/
gulp.task('index', function() {
    var endDest = DESTINATION;
    gulp.src('src/' + INDEX_FILE)
        .pipe(gulp.dest(endDest));
});

gulp.task('inject', function() {
    var target = gulp.src(DESTINATION + 'index.html');
    var sources = gulp.src([DESTINATION + '**/*.js', DESTINATION + '**/*.css'], {read: false},
    {
        ignorePath: '/dev_build',
        addRootSlash: false
    });
 
    return target.pipe(inject(sources))
        .pipe(gulp.dest(DESTINATION));
});

/** Dev build **/

/** Serve **/
gulp.task('serve', function(){
    bs.init({
    server: {
        baseDir: "dev_build/"
    }
    });
});

/** Official Build  **/

/** Watch **/
// (watch_source) 
// Watch the source: when a source changes, perform the corresponding build piece, update dev_build

// (serve_dev)
// Start the build server then -> Watch the dev_build folder: when an update occurs, refresh the browser

gulp.task('watch', function () {
  gulp.watch('src/**/*.css', ['styles']);
  gulp.watch('src/**/*.ts', ['scripts']);
  gulp.watch('src/**/*.html', ['views'])
  gulp.watch('src/index.html', ['index', 'inject']);
  gulp.watch(DESTINATION + '*').on('change', bs.reload);
});



glob('**/*.js', {cwd: DEV_LOC}, function(err, destination_files){
		if (err) {
			throw err;
		}
		else {
			var destination_map = destination_files.map(function(obj){
				return obj.replace(".js", ".ts");
			});
			glob('**/*.ts', {cwd: SOURCE}, function(err, source_files){
				//Get list of destination files, get list of source files
				//Go throught the list of destination files and check if it is in source
				//  if it is, cntinue
				//  else, add its path to the delete array
				var to_delete = [];
				for(var index in destination_map) {
					var js_path = destination_map[index];
					var index = source_files.indexOf(js_path);
					if(index === -1) {
						js_path = js_path.replace(".ts", ".js");
						to_delete.push(js_path);
					}
				}
				delete_files(to_delete);
			});
		}
	});