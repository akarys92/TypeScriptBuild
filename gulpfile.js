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

gulp.task('scripts', function() {
    var tsResult = gulp.src("./src/scripts/**/*.ts") 
        .pipe(tsProject());
    var endDest = DESTINATION + 'scripts/';
    return tsResult.js
        .pipe(gulp.dest(endDest));
});

gulp.task('clean-scripts', function(){
    glob('**/*.js', {cwd: DEV_LOC}, function(err, files){
        if (err) {
            throw err;
        }
        else {
            var destination_map = files.map(function(obj){
                return obj.replace(".js", ".ts");
            });
            glob('**/*.ts', {cwd: SOURCE}, function(err, source_files){
                var to_delete = [];
                for(var index in destination_map) {
                    var js_path = destination_map[index];
                    var index = source_files.indexOf(js_path);
                    if(index === -1) {
                        to_delete.push(js_path);
                    }
                }
                delete_files(to_delete);
            });
        }
    });
});

function delete_files(arr) {
    console.log("Diff: ");
    console.log(arr);
    //THIS IS GETTING PASSED TS FILES!!! NEEDS JS FILES!!!
    return gulp.src(arr, {cwd: DEV_LOC})
        .pipe(clean());
}

/** Build styles  **/

/** Compile views  **/

/** Update Index **/

/** Dev build **/
gulp.task('build', ['scripts'], function(){

});
/** Serve **/

/** Official Build  **/

/** Watch **/
// (watch_source) 
// Watch the source: when a source changes, perform the corresponding build piece, update dev_build

// (serve_dev)
// Start the build server then -> Watch the dev_build folder: when an update occurs, refresh the browser
