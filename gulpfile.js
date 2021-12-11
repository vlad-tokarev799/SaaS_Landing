var gulp = require('gulp');
	sass = require('gulp-sass');
	browserSync = require('browser-sync');
	concat = require('gulp-concat');
	uglify = require('gulp-uglify-es').default;
	del = require('del');
	imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'); // Подключаем библиотеку для работы с 
    cache = require('gulp-cache'); // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');
	gcmq = require('gulp-group-css-media-queries');
	cleanCSS = require('gulp-clean-css');

gulp.task('clean', async function() {
	return del.sync('dist')
})

gulp.task('sass', function(){ // Создаем таск "sass"
    return gulp.src('app/sass/*.+(scss|sass)')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gcmq())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
})

gulp.task('html', function() {
	return gulp.src('app/*.html')
		.pipe(browserSync.reload({stream: true}))
})

gulp.task('js', function() {
	return gulp.src('app/js/*.js')
		.pipe(browserSync.reload({stream: true}))
})

gulp.task('watch', function() {
	gulp.watch('app/sass/**/**.+(scss|sass)', gulp.parallel('sass'));
	gulp.watch('app/*.html', gulp.parallel('html'));
	gulp.watch('app/js/*.js', gulp.parallel('js'));
})

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app/' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});


gulp.task('start', gulp.parallel('browser-sync', 'watch'));

gulp.task('b-css', function() {
	return gulp.src('app/css/*.css')
			.pipe(cleanCSS({compatibility: 'ie8'}))
			.pipe(gulp.dest('dist/css'))
})

gulp.task('b-js', function() {
	return gulp.src('app/js/*.js')
			.pipe(gulp.dest('dist/js'))
})

gulp.task('b-html', function() {
	return gulp.src('app/*.html')
			.pipe(gulp.dest('dist'))
})

gulp.task('b-img', function() {
	    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен

})

gulp.task('b-fonts', function() {
	return gulp.src('app/fonts/*')
			.pipe(gulp.dest('dist/fonts'))
})

gulp.task('clear', function () {
    return cache.clearAll();
})


gulp.task('build', gulp.parallel('clear', 'b-css', 'b-js', 'b-html', 'b-img', 'b-fonts'))

