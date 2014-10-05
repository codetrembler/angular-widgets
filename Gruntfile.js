/*global module */
/*jslint indent: 2 */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    less: {
      dist: {
        options: {
          paths: ["styles"],
          compress: true,
          cleancss: true
        },
        files: {
          'angular-widgets.min.css': ['app/styles/main.less']
        }
      },
      src: {
        options: {
          paths: ["styles"],
          beautify: true,
          compress: false,
          cleancss: false
        },
        files: {
          'angular-widgets.src.css': ['app/styles/main.less']
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'temp/widgets/search-input.html': 'app/widgets/search-input/search-input.html',
          'temp/widgets/spinner.html': 'app/widgets/spinner/spinner.html'
        }
      },
      src: {
        options: {
          removeComments: false,
          collapseWhitespace: false,
          beautify: true
        },
        files: {
          'temp/widgets.src/search-input.html': 'app/widgets/search-input/search-input.html',
          'temp/widgets/spinner.html': 'app/widgets/spinner/spinner.html'
        }
      }
    },

    html2js: {
      dist: {
        options: {
          base: 'temp/widgets'
        },
        src: ['temp/widgets/**/*.html'],
        dest: 'temp/widget-templates.js'
      },
      src: {
        options: {
          base: 'temp/widgets.src'
        },
        src: ['temp/widgets.src/**/*.html'],
        dest: 'temp/widget-templates.src.js'
      }
    },

    uglify: {
      dist: {
        files: {
          "angular-widgets.min.js": [
            "temp/widget-templates.js",
            "app/app.js",
            "app/widgets/**/*.js",
            "!app/widgets/**/*.spec.js"
          ]
        }
      },
      src: {
        options: {
          compress: false,
          mangle: false,
          beautify: true
        },
        files: {
          "angular-widgets.src.js": [
            "temp/widget-templates.src.js",
            "app/app.js",
            "app/widgets/**/*.js",
            "!app/widgets/**/*.spec.js"
          ]
        }
      }
    },

    jslint: {
      src: ['app/**/*.js', 'test/**/*.js']
    },

    'string-replace': {
      styles: {
        files: {
          'angular-widgets.min.css': 'angular-widgets.min.css'
        },
        options: {
          replacements: [{
            pattern: '../widgets/search-input/magnifier.svg',
            replacement: 'resources/magnifier.svg'
          }]
        }

      },
      dist: {
        files: {
          'angular-widgets.min.js': 'angular-widgets.min.js'
        },
        options: {
          replacements: [{
            pattern: 'angular.module("angular-widgets",[])',
            replacement: 'angular.module("angular-widgets",["templates-dist"])'
          }]
        }
      },
      src: {
        files: {
          'angular-widgets.src.js': 'angular-widgets.src.js'
        },
        options: {
          replacements: [{
            pattern: 'angular.module("angular-widgets", [])',
            replacement: 'angular.module("angular-widgets",["templates-src"])'
          }]
        }
      }
    },

    copy: {
      all: {
        files: [
          {
            expand: true,
            cwd: 'app/widgets/search-input',
            src: 'magnifier.svg',
            dest: 'resources/'
          }
        ]
      }
    },

    clean: ['angular-widgets*.js', 'angular-widgets*.css', 'resoures/'],

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false,
        browsers: ['PhantomJS']
      }
    }

//    watch: {
//      scripts: {
//        files: ['app/scripts/**', 'app/styles/**', 'app/*.html', 'app/templates/*.html'],
//        tasks: ['debugTomcat', 'uglify:devmock'],
//        options: {
//          spawn: false
//        }
//      }
//    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.registerTask('dist', ['jslint', 'karma', 'copy:all', 'htmlmin:dist', 'html2js:dist', 'less:dist', 'uglify:dist', 'string-replace:styles', 'string-replace:dist']);
  grunt.registerTask('src', ['jslint', 'karma', 'copy:all', 'htmlmin:src', 'html2js:src', 'less:src', 'uglify:src', 'string-replace:src']);

  grunt.registerTask('default', ['clean', 'dist', 'src']);
  grunt.registerTask('travis', ['clean', 'dist', 'src']);
};
