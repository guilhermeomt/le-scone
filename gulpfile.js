const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const gulpStylelint = require("gulp-stylelint");
const browserSync = require("browser-sync").create();

const lintSass = () => {
  return gulp.src("css/scss/*.scss").pipe(
    gulpStylelint({
      reporters: [{ formatter: "string", console: true }],
    })
  );
};

const buildSass = () => {
  return gulp
    .src("css/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(autoprefixer({ overrideBrowserslist: ["last 3 versions"] }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
};

const watch = () => {
  gulp.watch("css/scss/*.scss", gulp.series(["lint:sass", "sass"]));
  gulp.watch("./*.html").on('change', browserSync.reload);
};

const server = () => {
  browserSync.init({
    server: {
      baseDir: ".",
    },
  });
};

gulp.task("lint:sass", lintSass);
gulp.task("sass", buildSass);
gulp.task("watch", watch);
gulp.task("server", server);
gulp.task("default", gulp.parallel("watch", "server"));
