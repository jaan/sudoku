'use strict';
/*global module */
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") + "\\n" %>' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */ <%= "\\n" %>'
		},		
		jshint: {
			all: ['scripts/main.js', 'Gruntfile.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true
			},
			globals: {
				exports: true,
				module: false,
				jQuery: false,
				$: false
			}
		},
		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},
			allscripts: {
				src: 'scripts/main.js',
				dest: 'scripts/main.min.js'
			}
		},
		less: {
			main: {
				// options: {
				// 	yuicompress: false
				// },
				files: {
					'styles/main.css': 'styles/main.less'
				}
			},
			fonts: {
				options: {
					yuicompress: false
				},
				files: {
					'styles/fonts.css': 'styles/fonts/fonts.less'
				}
			}
		},
		cssmin: {
			main: {
				src: 'styles/main.css',
				dest: 'styles/main.min.css'
			},
			fonts: {
				src: 'styles/fonts.css',
				dest: 'styles/fonts.min.css'
			}
		},
		watch: {
			files: ['scripts/*.js', 'styles/*.less', 'grunt.js'],
			// tasks: ['jshint', 'uglify', 'less', 'cssmin']
			tasks: ['uglify', 'less', 'cssmin']
		},
		connect: {
            options: {
                port: 8000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static("./")
                        ];
                    }
                }
            }
        }
	});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');


	// Default task.
	grunt.registerTask('build', ['uglify', 'less', 'cssmin']);

	//grunt.registerTask('server', ['build', 'less', 'watch']);

	grunt.registerTask('serve', ['build', 'connect', 'watch']);

};

