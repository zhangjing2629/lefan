module.exports = {
    minify: {
        expand: true,
        cwd: './app/css/conf/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/conf',
        ext: '.css'
    }
}
