const gulp = require("gulp");
const gulpStylelint = require("gulp-stylelint");

const lintSass = () => {
  return gulp
  .src("css/scss/*.scss")
  .pipe(gulpStylelint({
      reporters: [{ formatter: "string", console: true }],
    })
  );
}

gulp.task("lint:sass", lintSass);
