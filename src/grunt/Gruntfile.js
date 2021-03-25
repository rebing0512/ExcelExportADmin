module.exports = function(grunt) {


    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // 基础配置文件
        config: grunt.file.readJSON('bulid.config.json'),

        // 合并文件
        concat: {
            publish:{
                files:{
                    '../dist/cache/js/dependencies.js':[
                        '../js/jquery.min.js',
                        '../js/artTemplate.js',
                        '../js/bootstrap.min.js',
                        '../js/layer.js',
                        '../js/bootstrap-table/bootstrap-table.js',
                        '../js/bootstrap-table/bootstrap-table-mobile.min.js',
                        '../js/bootstrap-table/locale/bootstrap-table-zh-CN.min.js',
                        '../js/validate/jquery.validate.min.js',
                        '../js/validate/messages_zh.min.js'
                    ],
                    '../dist/cache/css/dependencies.css':[
                        '../css/bootstrap-table.min.css',
                        '../css/bootstrap.min.css',
                        '../css/animate.css',
                        '../css/font-awesome.css',
                        '../css/style.css',
                        '../css/component.css'
                    ],
                    '../dist/cache/js/pettyb.js':[
                        '../config/config.js',
                        '../pettyb/base/md5.js',
                        '../pettyb/base/sha1.js',
                        '../pettyb/core.js',
                        '../pettyb/baserun.js',
                        '../pettyb/getImageUrl.js'
                    ],
                    '../dist/cache/js/upload.js':[
                        '../upload/jQuery.upload.js',
                        '../upload/qiniu.min.js',
                        '../upload/previewImage.js'
                    ],
                    '../dist/cache/css/upload.css':[
                        '../upload/upload.css'
                    ],
                    '../dist/cache/js/diy.js':[
                        '../diy/js/ddsort.js',
                        '../diy/js/diy.js'
                    ],
                    '../dist/cache/css/diy.css':[
                        '../diy/css/diy.css',
                        '../diy/css/jquery.dad.css'
                    ]
                }
            }
        },

        // 压缩文件
        uglify: {
            options: {
                mangle: true, //混淆变量名
                comments: 'false' //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
            },
            publish: {
                files: {
                    '../dist/publish/js/pettyb.min.js': ['../dist/cache/js/pettyb.js'],
                    '../dist/publish/js/dependencies.min.js': ['../dist/cache/js/dependencies.js'],
                    '../dist/publish/js/upload.min.js': ['../dist/cache/js/upload.js'],
                    '../dist/publish/js/diy.min.js': ['../dist/cache/js/diy.js']
                }
            }
        },
        // 压缩css文件
        cssmin: {
            publish: {
                options: {
                    keepSpecialComments: 0, /* 删除所有注释 */
                    banner: '/* pettyB minified css file */',
                    report:'min'
                },
                src:'../dist/cache/css/dependencies.css',
                dest:'../dist/publish/css/dependencies.min.css'
            },
            upload: {
                options: {
                    keepSpecialComments: 0, /* 删除所有注释 */
                    banner: '/* pettyB minified css file */',
                    report:'min'
                },
                src:'../dist/cache/css/upload.css',
                dest:'../dist/publish/css/upload.min.css'
            },
            diy: {
                options: {
                    keepSpecialComments: 0, /* 删除所有注释 */
                    banner: '/* pettyB minified css file */',
                    report:'min'
                },
                src:'../dist/cache/css/diy.css',
                dest:'../dist/publish/css/diy.min.css'
            }
        },

        // 拷贝文件
        copy: {
            config:{
                expand: true,
                cwd: '../config/config.ini/config-dev',
                src: ['config.js'],
                dest: '../config/'
            },
            publish_js: {
                expand: true,
                cwd: '../dist/publish/js',
                src: ['**'],
                dest: '<%= config.publishPath %>/js/'
            },
            publish_css: {
                expand: true,
                cwd: '../dist/publish/css',
                src: ['**'],
                dest: '<%= config.publishPath %>/css/'
            },
        }
    });


    // 合并文件
    grunt.loadNpmTasks('grunt-contrib-concat');
    // 压缩js
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 压缩css
    grunt.loadNpmTasks('grunt-css');
    // 拷贝文件
    grunt.loadNpmTasks('grunt-contrib-copy');


    // 注册任务
    grunt.registerTask('publish',[
        'copy:config', // 拷贝config  config/config.js
        'concat:publish', // 合成核心文件  dependencies.js\dependencies.css\pettyb.js
        'uglify:publish', // 压缩核心文件js  dependencies.min.js\pettyb.min.js
        'cssmin:publish',  // 压缩核心文件css  dependencies.min.css
        'cssmin:upload',  // 压缩核心文件css  upload.min.css
        'cssmin:diy',  // 压缩核心文件css  diy.min.css
        'copy:publish_js', // 发布js文件
        'copy:publish_css', // 发布css文件
    ]);


    // 判断字符串是否在数组内
    function in_array(psearch,parray) {
        var testStr = ',' + parray.join(",") + ",";
        return (testStr.indexOf("," + psearch + ",") != -1);
        //true 在，不可以/false 不在
    }


    grunt.registerTask('pettyb', 'PettyB 执行命令', function(version) {
        if (arguments.length === 0) {
            version = 'dev';
        }
        version = version.toLocaleLowerCase(); // 转成小写
        console.log('log:','version',version);

        var versions =  ["dev", "pro","wohand"];

        var inrun = in_array(version,versions);

        if(inrun){
            console.log("remind:","可执行命令");
            thisVersion = version;
            console.log('log:',"thisVersion",thisVersion);
            grunt.config.set('copy.config.cwd', '../config/config.ini/config-'+thisVersion);
            grunt.task.run('publish');
        }else{
            console.log("remind:","无可执行版本，输入版本信息为：",version);
        }
    });

};
