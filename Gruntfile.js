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
      },
      examples: {
        options: {
          paths: ["styles"],
          beautify: true,
          compress: false,
          cleancss: false
        },
        files: {
          'examples/angular-widgets-examples.src.css': ['examples/**/*.less']
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 10']
      },
      dist: {
        src: 'angular-widgets.min.css',
        dest: 'angular-widgets.min.css'
      },
      src: {
        src: 'angular-widgets.src.css',
        dest: 'angular-widgets.src.css'
      },
      examples: {
        src: 'examples/angular-widgets-examples.src.css',
        dest: 'examples/angular-widgets-examples.src.css'
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
          'temp/widgets/spinner-dots.html': 'app/widgets/spinner-dots/spinner-dots.html'
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
          'temp/widgets.src/spinner-dots.html': 'app/widgets/spinner-dots/spinner-dots.html'
        }
      }
    },

    html2js: {
      dist: {
        options: {
          base: 'temp/widgets'
        },
        src: ['temp/widgets/**/*.html', '!temp/widgets/**/example.html'],
        dest: 'temp/widget-templates.js'
      },
      src: {
        options: {
          base: 'temp/widgets.src'
        },
        src: ['temp/widgets.src/**/*.html', '!temp/widgets/**/example.html'],
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
            "!app/widgets/**/example.js",
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
            "!app/widgets/**/example.js",
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
            pattern: 'angular.module("angular-widgets",["ngResource"])',
            replacement: 'angular.module("angular-widgets",["templates-dist", "ngResource"])'
          }]
        }
      },
      src: {
        files: {
          'angular-widgets.src.js': 'angular-widgets.src.js'
        },
        options: {
          replacements: [{
            pattern: 'angular.module("angular-widgets", [ "ngResource" ])',
            replacement: 'angular.module("angular-widgets",["ngResource", "templates-src"])'
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
    },

    watch: {
      scripts: {
        files: ['app/**/*.js', 'app/**/*.html'],
        tasks: ['htmlmin:src', 'html2js:src', 'uglify:src', 'string-replace:src'],
        options: {
          spawn: false
        }
      },
      less: {
        files: ['app/**/*.less'],
        tasks: ['less:src', 'autoprefixer:src', 'examples'],
        options: {
          spawn: false
        }
      }
    }
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
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('dist', ['jslint', 'karma', 'copy:all', 'htmlmin:dist', 'html2js:dist', 'less:dist', 'autoprefixer:dist', 'uglify:dist', 'string-replace:styles', 'string-replace:dist']);
  grunt.registerTask('src', ['jslint', 'karma', 'copy:all', 'htmlmin:src', 'html2js:src', 'less:src', 'autoprefixer:src', 'uglify:src', 'string-replace:src']);
  grunt.registerTask('examples', ['less:examples', 'autoprefixer:examples']);

  grunt.registerTask('default', ['clean', 'dist', 'src']);
  grunt.registerTask('travis', ['clean', 'dist', 'src']);
};
