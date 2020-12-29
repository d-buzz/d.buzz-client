const gulp = require('gulp')
const uglify = require('gulp-uglify')

gulp.task('build', function () {
  return gulp.src('public/widgets/buzzWidget.js')
    .pipe(uglify())
    .pipe(gulp.dest('public'))
})