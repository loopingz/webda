var gulp        = require('gulp');
var shell       = require('gulp-shell');
var connect     = require('gulp-connect');
var path        = require('path');
var _           = require('lodash');
var glob        = require('glob');
var clipboard   = require('gulp-clipboard');

var join = path.join.bind(path);
var cwd = process.cwd();

// Test paths
var test = { path:'test/'};
_.extend(test, { 
  docs: { path: join(test.path, 'docs/') },
  src: { path: join(test.path, 'source/') } 
});

_.extend(test.docs, {
  css: { path: join(test.docs.path, 'css/') },
  js: { path: join(test.docs.path, 'js/') }
});

// Asset paths
var assets = { path:'assets/' };
_.extend(assets, {
  css: { path: join(assets.path, 'css/') },
  js: { path: join(assets.path, 'js/') }
});

// Doxx commands
var cmd = { source:' -s ', output:' -o ', template: ' -j ', kit:' -k ', name: ' -n '};

// Doxx commands with path
var source = cmd.source +  join(cwd, test.src.path),
    output = cmd.output + join(cwd, test.docs.path),
    template = cmd.template + join(cwd, 'template/index.jade'),
    kit = cmd.kit,
    name = cmd.name + '"Mr. Doc\'s Default Theme"';
cmd = source + output + template + kit + name;

/** ---------------------- Tasks ---------------------- */

// Task 1: Build the docs
gulp.task('docs',shell.task([
    './node_modules/mr-doc/bin/mr-doc ' + cmd
]));


// Task 2: Copy the files from bower into js and assets
gulp.task('copy:js', ['docs'], function () {
  return gulp.src(glob.sync(assets.js.path + '*.js'))
  .pipe(clipboard())
  .pipe(gulp.dest(test.docs.js.path));
});

// Task 3: Copy the files from bower into css
gulp.task('copy:css', ['docs'], function () {
  return gulp.src(glob.sync(assets.css.path + '*.css'))
  .pipe(gulp.dest(test.docs.css.path));
});

// Create server
gulp.task('connect', function() {
  connect.server({
    root: test.docs.path,
    livereload: true
  });
});

// Reload the page
gulp.task('html', function () {
  gulp.src(test.docs.path + '*.html')
    .pipe(connect.reload());
});

// Watch for changes
gulp.task('watch', function () {
  gulp.watch(['template/*.jade','./*.md'], ['docs']);
});

// Default
gulp.task('default', ['build', 'copy:js', 'copy:css', 'connect', 'watch']);

// Build
gulp.task('build', ['docs']);