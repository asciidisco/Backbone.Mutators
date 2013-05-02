/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc:'.jshintrc'
      },
      all: ['Gruntfile.js', 'src/*.js', 'test/*.js']
    },

    qunit: {
      options: {
        '--web-security':'no',
        timeout: 40000,
        coverage: {
          src: ['src/*.js'],
          instrumentedFiles: 'temp',
          htmlReport: 'report/coverage'
        }
      },
      all: ['test/index.html']
    },

    complexity: {
      generic: {
        src: ['src/*.js'],
        options: {
          errorsOnly: false,
          cyclomatic: 8,
          halstead: 31,
          maintainability: 100
        }
      }
    },

    plato: {
      bc: {
        src: ['src/backbone.mutators.js'],
        dest: 'docs/complexity',
        options: {
          jshint : grunt.file.readJSON('.jshintrc')
        }
      }
    },

  'saucelabs-qunit': {
    all: {
        options: {
          username: 'asciidisco',
          urls: ['http://rawgithub.com/asciidisco/Backbone.Mutators/master/test/index_sauce.html'],
          tunnelTimeout: 100000,
          testTimeout: 100000,
          testname: 'Backbone.Mutators',
          tags: ['backbone', 'plugin', 'mutators', 'unittest'],
          build: process.env.TRAVIS_JOB_ID,
          browsers: [ {
            browserName: 'internet explorer',
            platform: 'XP',
            version: '6'
          }, {
            browserName: 'internet explorer',
            platform: 'XP',
            version: '7'
          }, {
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '8'
          }, {
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9'
          }, {
            browserName: 'firefox',
            platform: 'Windows 7',
            version: '21'
          }, {
            browserName: 'chrome',
            platform: 'Windows 7'
          }, {
            browserName: 'opera',
            platform: 'Windows 2008',
            version: '12'
          }]
        }
      }
    },

    nodeunit: {
      all: ['test/*node_test.js']
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
          '------------------------------\n' +
          'Build @ <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          'Documentation and Full License Available at:\n' +
          '<%= pkg.homepage %>\n' +
          '<%= pkg.repository.url %>\n' +
          'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n\n' +
          'Permission is hereby granted, free of charge, to any person obtaining a\n' +
          'copy of this software and associated documentation files (the "Software"),\n' +
          'to deal in the Software without restriction, including without limitation\n' +
          'the rights to use, copy, modify, merge, publish, distribute, sublicense,\n' +
          'and/or sell copies of the Software, and to permit persons to whom the\n\n' +
          'Software is furnished to do so, subject to the following conditions:\n' +
          'The above copyright notice and this permission notice shall be included in\n' +
          'all copies or substantial portions of the Software.\n\n' +
          'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,\n' +
          'EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' +
          'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\n' +
          'IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n' +
          'DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,\n' +
          'ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS\n' +
          'IN THE SOFTWARE.*/\n'
      },
      dist: {
        src: ['src/<%= pkg.name.toLowerCase() %>.js'],
        dest: '<%= pkg.name.toLowerCase() %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= concat.options.banner %>'
      },
      dist: {
        files: {
          '<%= pkg.name.toLowerCase() %>.min.js': ['<%= pkg.name.toLowerCase() %>.js']
        }
      }
    },

    docco: {
      debug: {
        src: ['src/*.js'],
        options: {
          output: 'docs/literal'
        }
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          linkNatives: true,
          selleck: true,
          paths: 'src/',
          outdir: 'docs/api'
        }
      }
    }

  });

  // Load 3rd party tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-qunit-istanbul');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-plato');

  // Default task.
  grunt.registerTask('default', ['jshint', 'complexity', 'qunit', 'nodeunit', 'concat', 'uglify']);
  grunt.registerTask('travis', ['jshint', 'complexity', 'qunit', 'saucelabs-qunit']);


};
