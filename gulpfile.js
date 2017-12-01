var gulp = require("gulp");
var webserver = require("gulp-webserver");
var fs = require("fs");
var path = require("path");
var concat = require('gulp-concat');
var minify = require('gulp-minify-css')
var uglify = require('gulp-uglify');
gulp.task('minicss', function() {
    gulp.src('./css/*.css')
        .pipe(concat('new.css'))
        .pipe(minify())
        .pipe(gulp.dest('./css'))
})
gulp.task('minijs', function() {
    gulp.src('./js/*.js')
        .pipe(concat('new.js'))
        .pipe(uglify())

});
gulp.task("webserver", function() {
    gulp.src(".")
        .pipe(webserver({
            host: "localhost",
            port: 8090,
            open: true,
            fallback: "index.html",
            livereload: true
        }))
});

gulp.task("server", function() {
    gulp.src(".")
        .pipe(webserver({
            host: "localhost",
            port: 8080,
            middleware: function(req, res, next) {
                res.writeHead(200, {
                    "Content-type": "text/json;charset=utf8",
                    "Access-Control-Allow-Origin": "*"
                });
                if (req.url == '/data/') {
                    var filename = req.url.split("/")[1];
                    var dataFile = path.join(__dirname, "js", filename + ".json");
                    res.end(fs.readFileSync(dataFile));
                }
                next();
            }
        }))
});
gulp.task("default", function() {
    gulp.start("minicss", "minijs", "webserver", "server")
});