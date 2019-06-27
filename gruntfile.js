module.exports = function(grunt){

	const sass = require('node-sass');
	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
		sass: {
			options: {
				implementation: sass,
			},
			dist: {
				files: {
					'style.css': 'sass/pitko.sass'
				}
			}
		},
		babel: {
			options: {
				sourceMap: false
			},
			dist: {
				files: {
					"dist/cart.js": "js/cart.js"
				}
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			sass: {
				files: ["sass/**"],
				tasks: ["sass:dist"],
				options: {
					spawn: false
				}
			},
			html: {
				files: ['*.php']
			},
			js: {
				files: ['js/*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

}