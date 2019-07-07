module.exports = function(grunt){

	const sass = require('node-sass');
	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
		sass: {
			options: {
				implementation: sass,
			},
			compile: {
				files: {
					'css/style.css': 'sass/pitko.sass'
				}
			}
		},

		babel: {
			options: {
				sourceMap: false
			},
			dist: {
				files: {
					'js/cart.js': 'js/es6/cart.js'
				}
			}
		},

		concat: {
			dev: {
				src: ['js/cart.js', 'js/main.js'],
				dest: 'js/built.js',
			},
		},

		cssmin: {
			minify: {
				files: {
					'dist/css/appstyle.min.css' : 'css/style.css',
				}
			}
		},

		uglify: {
			js: {
				files: {
					'dist/js/jquery.min.js' : 'js/vendor/jquery-3.3.1.js',
					'dist/js/app.min.js': 'js/built.js',
				}
			}
		},

		watch: {
			options: {
				livereload: true,
			},
			sass: {
				files: ['sass/**'],
				tasks: ['sass:compile', 'cssmin:minify'],
				options: {
					spawn: false
				}
			},
			html: {
				files: ['*.php']
			},
			js: {
				files: ['js/**'],
				tasks: ['babel:dist', 'concat:dev', 'uglify:js']
			}
		}

	});
}