module.exports = {
    html: {
        files: [{
            expand: true,
            src: ['./**/html-forphp/**/*.html'],
            dest: 'dist/',
            cwd: 'app/'
        }]
    },
    //mincss: {
    //    files: [{
    //        expand: true,
    //        src: ['./**/*.min.css'],
    //        dest: 'dist/css/',
    //        cwd: 'app/css/'
    //    }]
    //},
    js: { //复制jquery，以后移除
        expand: true,
        src: ['./lithe.js'],
        dest: 'dist/js/',
        cwd: '.tmp/js/'
    }
}
