/*globasl module:false */
module.exports = function(grunt) {
    'use strict';

    // Project configuration
    grunt.initConfig({

        // Vars from package
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: {
                src: [
                    /*libs*/
                    /*"js/libs/jquery-1.11.1.min.js",*/
                    'js/libs/jquery-ui.min.js',
                    'js/libs/jquery.format.js',
                    'js/libs/handlebars-1.3.0.js',
                    'assets/bootstrap/js/bootstrap.min.js',
                    'assets/datepicker/js/bootstrap-datepicker.js',
                    'js/libs/bootbox.js',
                    'js/libs/parsley.js',
                    'assets/datatables/js/jquery.dataTables.min.js',
                    'assets/datatables/js/datatables.js',
                    'assets/summernote/summernote.min.js',
                    /*data*/
                    'js/data/form.js',
                    'js/data/page.js',
                    'js/data/input.js',
                    'js/data/radio.js',
                    'js/data/select.js',
                    'js/data/buttons.js',
                    'js/data/table.js',
                    'js/data/validation.js',
                    'js/data/events.js',
                    'js/data/vis.js',
                    /*app*/
                    'js/app.js',
                    'js/utils.js',
                    'js/event-handlers.js',
                    'js/files.js',
                    'js/views.templates.js',
                    'js/views.designer.js',
                    'js/views.rows.js',
                    'js/views.pages.js',
                    'js/views.form.js',
                    'js/views.tablegroup.js',
                    'js/views.rulebuilder.js',
                    'js/views.code.js',
                    'js/init.js',
                    'js/preview.js',
                    'js/updater.js',
                    'js/integration/PubSub.js',
                    'js/integration/GetVersion.js',
                    /* modes */
                    'js/modes/bootstrap3.js',
                    'js/modes/mylife.js',
                    'js/modes/affordability.js'
                ],
                dest: 'dist/js/main.js'
            },

            jsrun: {
                src: [
                    'js/libs/Chart.min.js',
                    'js/libs/jquery.tablesorter.js',

                    'js/integration/PubSub.js',
                    'js/integration/Calculon.js',
                    'js/integration/Calculon2.js',
                    'js/integration/LocalStorage.js',
                    'js/integration/EmailAPI.js',
                    'js/utils.js',

                    'js/runtime.js',
                    'js/runtime.nav.js',
                    'js/runtime.tablegroup.js',
                    'js/runtime.events.js',
                    'js/runtime.dates.js',
                    'js/runtime.init.js',
                    'js/runtime.visibility.js',

                    'js/Shelter.Templates.js',
                    'js/Shelter.Custom.js',
                    'js/Shelter.Feedback.js',
                    'js/Shelter.Demo.js'
                ],
                dest: 'dist/js/formbuilder.js'
            },

            css: {
                src: [
                    'css/normalize.css',
                    'assets/bootstrap/css/bootstrap.min.css',
                    'css/jquery-ui.min.css',
                    'assets/font-awesome-4.1.0/css/font-awesome.min.css',
                    'assets/datepicker/css/datepicker.css',
                    'assets/summernote/summernote.css',
                    'assets/bootstrap-tagsinput/bootstrap-tagsinput.css',
                    'css/style.css',
                    'css/flex.css'
                ],
                dest: 'dist/css/main.css'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            js: {
                src:  'dist/js/main.js',
                dest: 'dist/js/main.min.js'
            },
            jsrun: {
                src:  'dist/js/formbuilder.js',
                dest: 'dist/js/formbuilder.min.js'
            }
        },

        cssmin: {
            css:{
                src:  'dist/css/main.css',
                dest: 'dist/css/main.min.css'
            }
        },

        clean: {
            emptyall: {
                src: [
                  'dist/js/*.js',
          'dist/css/*.css'
                ]
            },
            emptyjs: {
                src: [
                  'dist/js/*.js'
        ]
            },
            emptycss: {
                src: [
                  'dist/css/*.css'
                ]
            },
            tidyall: {
                src: [
                  'dist/js/main.js',
          'dist/js/main.min.js',
          'dist/js/formbuilder.js',
                  'dist/js/formbuilder.min.js',
          'dist/css/main.css',
          'dist/css/main.min.css'
                ]
            },
            tidyjs: {
                src: [
                  'dist/js/main.js',
          'dist/js/main.min.js',
          'dist/js/formbuilder.js',
                  'dist/js/formbuilder.min.js'
                ]
            },
            tidycss: {
                src: [
          'dist/css/main.css',
          'dist/css/main.min.css'
                ]
            }
        },

        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: 'dist/css/main.min.css',
                dest: 'dist/css'
            },
            js: {
                src: 'dist/js/main.min.js',
                dest: 'dist/js'
            },
            jsrun: {
                src: 'dist/js/formbuilder.min.js',
                dest: 'dist/js'
            }
        },

        bake: {
            dist:{
                options: {
                    process: null
                },
                files: {
                    'index.html'      : 'templates/index-dev.html',
                    'dist/index.html' : 'templates/index-prod.html'
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: ['css/*.css'],
                    dest: 'dist/'
                }]
            }
        },

        updateRevFiles: {
            filesSrc: ['index.html', 'dist/index.html']
        },

        watch: {
            scripts: {
                files: ['js/**/*.js', 'css/*.css', 'templates/**/*.html'],
                tasks: 'nowatch',
                options: {
                    livereload: true
                }
            }
        },

        compress: {
            dist: {
                options: {
                    archive: 'releases/<%= pkg.version %>.zip'
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*'],
                dest: 'formbuilder-<%= pkg.version %>/'
            }
        },

        web_server: {
            options: {
                cors: true,
                port: 8000,
                nevercache: true,
                logRequests: true
            },
            foo: 'bar'
        },

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bake');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-web-server');

    // Register tasks
    grunt.registerTask('default', ['clean:emptyall', 'concat', 'uglify', 'cssmin', 'filerev', 'bake', 'updateRevFiles', 'copy', 'clean:tidyall', 'watch']);

    grunt.registerTask('nowatch', ['clean:emptyall', 'concat', 'uglify', 'cssmin', 'filerev', 'bake', 'updateRevFiles', 'copy', 'clean:tidyall']);

    grunt.registerTask('build', ['compress:dist']);

    // Custom task to rewrite revved filenames
    grunt.registerMultiTask("updateRevFiles", "rewrite revved files", function () {
        var options = this.options({
           assets: grunt.filerev ? grunt.filerev.summary : {}
        });

        var self = this;
        var assets = options.assets;

        self.filesSrc.forEach(function (file) {
           var jsFile = grunt.file.read(file);
           var original = jsFile;

           // Find all js:src matches
           jsFile = jsFile.replace(/(?:src=|url\(\s*)['"]?([^'"\)]+)['"]?\s*\)?/gm, function (match, src) {
              // Need to add leading path to match assets
              var key = "dist/" + src.replace("src=", "");
              // Convert / to \\ and find any matching val from revved key-val store
              var asset = assets[key.replace(new RegExp("/", "g"), "\\")];
              // If there is a filerev entry, then use it
              if (asset !== undefined) {
                // Sort out the slashes and remove the leading dist/
                var val = asset.replace(new RegExp("\\\\", "g"), "/");
                val = val.replace("dist/", "");
                return match.replace(src, val);
              }
              // Else don't change
              else {
                return match;
              }
           });

           // Find all css:href matches
           jsFile = jsFile.replace(/(?:href=|url\(\s*)['"]?([^'"\)]+)['"]?\s*\)?/gm, function (match, src) {
              // Need to add leading path to match assets
              var key = "dist/" + src.replace("src=", "");
              // Convert / to \\ and find any matching val from revved key-val store
              var asset = assets[key.replace(new RegExp("/", "g"), "\\")];
              // If there is a filerev entry, then use it
              if (asset !== undefined) {
                // Sort out the slashes and remove the leading dist/
                var val = asset.replace(new RegExp("\\\\", "g"), "/");
                val = val.replace("dist/", "");
                return match.replace(src, val);
              }
              // Else don't change
              else {
                return match;
              }
           });

           if(original !== jsFile) {
              grunt.log.writeln(">> ".green + "File \"" + file + ("\" updated."));
              grunt.file.write(file, jsFile);
           }
        });
    });

};
