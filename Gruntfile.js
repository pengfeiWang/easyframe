module.exports = function (grunt) {
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-banner");
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		usebanner: {
			taskName: {
				options: {
					position: "top",
					banner: "/*! ============================================= \n"+
					 	"    project: <%= pkg.name %>  \n"+
					 	"    version: <%= pkg.version %> \n"+
						"    update: <%= grunt.template.today('yyyy-mm-dd') %> \n"+
						"    author: <%= pkg.author %> \n"+
						"==================================================  */",
					linebreak: true
				},
				files: {
					// src: [ "dist/*.js", "build/*.js"/*, "js/plugins/*.js"*/ ]
					src: [
						"./dist/<%= pkg.name %>.min.js",
						"./dist/<%= pkg.name %>.js"
					]

				}
			}
		},
		concat: {
			"easyframe": {
				
				files: {


					"./dist/<%= pkg.name %>.js": [
						'src/open.js'
						,'src/core/regexp.js'
						,'src/core/object.js'
						,'src/core/class2type.js'
						,'src/core/sys_ext_method.js'
						,'src/core/arrunique.js'
						,'src/core/is.js'
						,'src/core/extend.js'
						,'src/core/each.js'

						,'src/browser/browser.js'
						,'src/selector/selector.js'
						,'src/class/class.js'
						,'src/css/css.js'
						,'src/event/event.js'
						,'src/ajax/get_field.js'
						,'src/ajax/serialize.js'
						,'src/api.js'
						,'src/close.js'
					]
				}
			}
		},
		uglify : {
           
           'all': {
                // files: [
                //     {
                //         expand: true,
                //         cwd: 'build/',
                //         src: ['*.js'],
                //         filter : 'isFile',
                //         dest: 'build/',
                //     }
                // ]
                options: {
                    mangle: true, //不混淆变量名
                    preserveComments: 'some', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer:'\n/*! <%= pkg.name %> 由 pengfeiWang 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                files: {
                    './dist/<%= pkg.name %>.min.js': 
                    [
                    	'./dist/<%= pkg.name %>.js'
                	]
                }
            }
        }
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('build', [ 'concat',   'uglify',  'usebanner']);
	

}