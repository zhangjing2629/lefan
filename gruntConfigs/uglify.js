var banner = '/* <%=pkg.name%> | <%=pkg.description%> | vserion <%=pkg.version%>*/\r\n';
module.exports = {
    options: {
        mangle: {
            except: ['require']
        },
        banner: banner
    },
    lithe: {
        files: [{
            expand: true,
            cwd: './dist/js/conf/',
            src: '**/*.js',
            dest: './dist/js/conf' //输出到此目录下
        }]
    },
    config: {
        files: {
            './.tmp/js/lithe.js': ['./.tmp/js/lithe.js']
        }
    }
}
