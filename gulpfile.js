const gulp = require("gulp");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const sass = require("gulp-sass");
const gulpStylelint = require("gulp-stylelint");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

const lintSass = () => {
  return gulp.src("src/scss/*.scss").pipe(
    gulpStylelint({
      reporters: [{ formatter: "string", console: true }],
    })
  );
};

const buildSass = () => {
  return gulp
    .src("src/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(autoprefixer({ overrideBrowserslist: ["last 3 versions"] }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
};

const deleteDistFolder = () => {
  return del(["dist"]);
};

const copyImages = () => {
  return gulp
    .src("src/img/**/*")
    .pipe(gulp.dest("dist/img"))
    .pipe(browserSync.stream());
};

const copyHtml = () => {
  return gulp
    .src("src/**/*.html")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
};

const copyRootFiles = () => {
  return gulp
    .src("src/root/*")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
};

const watchSourceFiles = () => {
  gulp.watch("src/scss/*.scss", gulp.series("lint:sass", "build:sass"));
  gulp.watch("src/**/*.html", copyHtml);
  gulp.watch("src/img/**/*", copyImages);
  gulp.watch("src/root/*", copyRootFiles);
};

const startServer = () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
};

gulp.task("lint:sass", lintSass);
gulp.task("build:sass", buildSass);
gulp.task("build:clean", deleteDistFolder);
gulp.task("build:copyImages", copyImages);
gulp.task("build:copyHtml", copyHtml);
gulp.task("build:copyRoot", copyRootFiles);
gulp.task(
  "build:copy",
  gulp.parallel("build:copyImages", "build:copyHtml", "build:copyRoot")
);
gulp.task("watch", watchSourceFiles);
gulp.task("server", startServer);
gulp.task("lint", gulp.series("lint:sass"));
gulp.task(
  "build",
  gulp.series("build:clean", gulp.parallel("build:sass", "build:copy"))
);
gulp.task(
  "default",
  gulp.series("lint", "build", gulp.parallel("watch", "server"))
);
