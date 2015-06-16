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
						//正则
						,'src/core/regexp.js'
						//缓存
						,'src/core/cache.js'
						,'src/core/class2type.js'
						//原型扩展方法
						,'src/core/sys_ext_method.js'
						//数组去重
						,'src/core/arrunique.js'
						//各种判断函数
						,'src/core/is.js'
						//扩展方法
						,'src/core/extend.js'
						//循环
						,'src/core/each.js'
						//userAgent
						,'src/browser/browser.js'
						//选择器
						,'src/selector/selector.js'
						//class
						,'src/class/class.js'
						//css
						,'src/css/css.js'
						//事件系统
						,'src/event/event.js'
						//ajax
						,'src/ajax/get_field.js'
						,'src/ajax/serialize.js'
						,'src/ajax/ajax.js'
						//动画系统
						,'src/animate/animate.js'
						//对外api
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