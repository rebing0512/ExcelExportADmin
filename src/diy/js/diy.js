;(function($,window,document,undefined){


    var diyPettyEditor = function(el,opt){

        $element = el;
        defaults = {
            'title': '首页',   // 默认标题
            'isIndex': true,  // 是否为首页
            'hasPageBase':false,  // 是否开启页面默认显示
            'pageBaseId':'pageBaseId',
            'pageBaseTtile':'页面基础配置',
            'menuNavsId':'menuNavsId',
            'menuNavsTtile':'页面组件',
            'menuActionButtonId':'submit',
            'menuActionButtonTitle':'保存页面',
            'menuActionModeSwitch':'switch',
            'menuActionModeSwitchTitle':'模式切换',
            'defaultMode':'yulan',
            'categorys':[],
            'mode':{
                'edit':'快速编辑模式',
                'yulan':'内容预览模式'
            },
            'components':{
                'text':'文本段落',
                'images':'多图展示'
            },
            'data':{}
        };
        options = $.extend({},defaults,opt);

        $($element).each(function(){
            var _this = $(this);
            // console.log(_this);
            // initFrame(_this);
            //that.execute(_this); // 初始化
            new diyEditor(_this,options);
        });
    };



    // 唯一性元素处理
    var diyEditor = function(el,opt) {
        // console.log(el);
        var that = this;

        this.$element = el;
        this.options = opt;

        this.$phoneMain = null;
        this.$phoneDiyEditor = null;
        this.$Submit = null;
        this.diyData = this.options['data'];


        this.defaultData = {
            params:{
                explain:'请输入模块说明信息'
            },
            defaults:{
                explain:'请输入模块说明信息'
            }
        };


        this.selectAdvertData = [];
        this.defaultSelectAdvertStr = '';
        this.options.categorys.map(function (item, index) {
            var obj = {};
            obj.id = item.id;
            obj.name = item.cate_name;
            that.selectAdvertData.push(obj);

            if(that.options.data.pagebase && that.options.data.pagebase.params.class_id == item.id){
                that.defaultSelectAdvertStr = item.cate_name;
            }

        });


        this.execute();
    };

    diyEditor.prototype = {

        /**
         * 入口文件
         */
        execute: function () {
            this.initFrame(); // 生成主框架
            this.initSort(); // 注册排序
            this.initClick(); // 注册点击事件
            this.initSelected(); //注册选择事件
            this.initDelete(); // 注册删除事件
            this.initSubmit(); // 注册提交事件
            this.initSwitch(); // 初始化模式切换按钮
            this.initIinputDataBind(); // 注册数据绑定

            // 初始化数据渲染
            this.renderMain();

        },




        /**
         * 初始化类
         */
        // ****************************************************************

        /**
         * 初始化主体框架
         */
        initFrame:function(){
            // console.log("initFrame",this);

            // tpl_diy_pettybEdit


            var $this = this.$element;
            var opts = this.options;

            if(!$this.hasClass('diy-pettyb-editor')){
                $this.addClass('diy-pettyb-editor');
            }

            // var diyPhone = '<div class="diy-phone">' +
            //         '<div class="phone-top '+(opts.isIndex?'index':'')+'">'+opts.title+'</div>' +
            //         '<div id="phone-main" class="phone-main"></div>' +
            //     '</div>';
            // $this.append(diyPhone);


            var modeName = '';
            if(opts.defaultMode=='edit'){
                modeName = opts.mode.edit;
            }else{
                modeName = opts.mode.yulan;
            }

            // var diyMenu = '<div id="diy-menu" class="diy-menu">' +
            //     '<div class="navs">' +
            //         '<div id="'+opts.menuNavsId+'">' +
            //             '<div class="title">'+opts.menuNavsTtile+'</div>' +
            //                 '<div id="components">';
            // Object.keys(opts.components).forEach(function(key){
            //     // console.log(key,);
            //     diyMenu += '<nav class="special" data-type="'+key+'">'+opts.components[key]+'</nav>';
            // });
            // diyMenu +=      '</div>' +
            //             '</div>' +
            //         '</div>' +
            //         '<div class="action">' +
            //             '<div class="actionButton">' +
            //                 '<button id="'+opts.menuActionModeSwitch+'" type="button">'+opts.menuActionModeSwitchTitle+'</button>'
            //                 +'<button id="'+opts.menuActionButtonId+'" type="button" class="menuActionButton">'+opts.menuActionButtonTitle+'</button>'
            //             +'</div>'
            //     +'<span class="actiontip" id="'+opts.menuActionButtonId+'Tip">当前为：<span>' +
            //     modeName+
            //     '</span></span>' +
            //         // '<div class="clearboth"> </div>' +
            //         '</div>' +
            //     '</div>';
            // $this.append(diyMenu);

            //<div class="editor-arrow"></div>
            // var diyEditor = '<div id="diy-editor" class="diy-editor form-horizontal"><div class="inner"></div></div>';


            var item = opts;
            item.modeName = modeName;
            if(this.options.hasPageBase) {
                item.pagebase = opts.data.pagebase;
                if(item.pagebase == undefined) {
                    item.pagebase = {};
                    item.pagebase.params = {};
                }
                item.pagebase.params.className = this.defaultSelectAdvertStr;
            }

            var diyEditor = $(template('tpl_diy_pettybEdit', item));

            $this.append(diyEditor);

            // 主空间
            this.$phoneMain = this.$element.find('.diy-phone').find('#phone-main');
            this.$phoneDiyEditor = this.$element.find('#diy-editor').find('.inner');
            this.$Submit = this.$element.find('#'+opts.menuActionButtonId);
            this.$Switch = this.$element.find('#'+opts.menuActionModeSwitch);

            if(opts.defaultMode=='yulan'){
                this.$phoneMain.addClass('yulan');
            }
            if(this.options.hasPageBase){
                this.$PageBase = this.$element.find('#diy-pagebase');
                this.$PageTitle = this.$element.find('#pageBaseTitle');
            }

        },
        /**
         * 初始化拖拽事件
         */
        initSort:function () {
            var $phoneMain = this.$phoneMain;
            var that = this;
            // diy元素拖拽
            $phoneMain.DDSort({
                target: '.drag',
                delay: 50, // 延时处理，默认为 50 ms，防止手抖点击 A 链接无效
                up: function () {
                    // console.log(that.diyData);
                    var newItems = {};
                    $phoneMain.find('.drag').each(function () {
                        var itemId = $(this).data('itemid');
                        newItems[itemId] = that.diyData[itemId]
                    });
                    that.diyData = newItems;
                    // console.log(that.diyData);
                }
            });
        },
        initClick:function(){
            var $this = this.$element;
            var that = this;
            // 绑定点击事件
            $this.find('#components .special').click(function () {
                var type = $(this).data('type');
                var debug =  $this.data('debug');
                // console.log('#components .special',type,debug);
                that.renderInsertDiyItem(type);
            });
        },
        initSelected:function () {
            var $phoneMain = this.$phoneMain;
            var that = this;
            $phoneMain.on('click', '.drag', function () {
                var $drag = $(this);
                if (!$drag.hasClass('selected')) {
                    // 设置选中
                    $phoneMain.children().removeClass('selected');
                    $drag.addClass('selected');
                    // 渲染编辑器
                    that.renderEditor($drag.data('itemid'));
                }
            });
        },
        initIinputDataBind:function () {
            var that = this;
            // 绑定input修改事件   change
            this.$phoneDiyEditor.on('propertychange input', '[data-bind]', function () {
                // console.log("'propertychange change', 'input[data-bind]'");
                var $this = $(this)
                    , val = $this.val()
                    , itemIndex = $this.data('bind').split('.')
                    , itemId = $this.parents('.itemid').data('itemid');
                //console.log( val,itemIndex,itemId);
                // 数据绑定 (最多支持3级)
                that.funSetData(itemId, itemIndex, val);
                // // 重新渲染diy元素
                that.renderRefreshDiyItem(itemId);
            });

            this.$phoneDiyEditor.on('focus', '[data-bind]', function () {
                //console.log("'focus', 'input[data-bind]'");
                var $this = $(this)
                    , val = $this.val()
                    , defaultVal = $this.data('default');
                if(val == defaultVal){
                    $this.val('');
                }
            });


            //diy-pagebase 如果存在页面基础信息，做信息初始化
            if(this.options.hasPageBase){
                var selectAdvertData = this.selectAdvertData;
                console.log(selectAdvertData);
                this.$PageBase.find('.btnAdvert').click(function () {
                    console.log("btnAdvert");
                    var _this = $(this);
                    var name = $(this).attr('name');
                    _this.selectMenu({
                        title: '选择分类',
                        showField: 'name',
                        keyField: 'id',
                        search: false,//关闭搜索栏
                        data: selectAdvertData,
                        eSelect: function (data) {
                            // console.log(data[0].name);
                            _this.val(data[0].name);
                            _this.attr("data-id", data[0].id);
                            var val = data[0].id;

                            if(that.diyData.pagebase == undefined){
                                that.diyData.pagebase={};
                                that.diyData.pagebase.params={};
                                // that.diyData.pagebase={
                                //     params:{
                                //         [name]:val
                                //     }
                                // };
                            }
                            // else{
                            //     that.diyData['pagebase']['params'][name] = val;
                            // }
                            that.diyData['pagebase']['params'][name] = val;
                        }
                    });
                });

                this.$PageBase.on('propertychange input','input',function () {
                    var $this = $(this)
                        , val = $this.val()
                        , name = $(this).attr('name');


                    // console.log(val,name);
                    // console.log('that.diyData',that.diyData);
                    if(that.diyData.pagebase == undefined){
                        that.diyData.pagebase={};
                        that.diyData.pagebase.params={};
                        // that.diyData.pagebase={
                        //     params:{
                        //         [name]:val
                        //     }
                        // };
                    }
                    // else{
                    //     that.diyData['pagebase']['params'][name] = val;
                    // }

                    if(name!='file'){
                        if ($this.attr("type")=='radio'){
                            //如果是单选按钮
                            val = $this.filter(':checked').attr("data-id");
                        }
                        that.diyData['pagebase']['params'][name] = val;
                        console.log(that.diyData);
                    }

                    if(name=='title'){
                        that.$PageTitle.html(val);
                    }
                });

                this.$PageBase.on('focus', 'input', function () {
                    //console.log("'focus', 'input[data-bind]'");
                    var $this = $(this)
                        , val = $this.val()
                        , defaultVal = $this.data('default');
                    if(val == defaultVal){
                        $this.val('');
                    }
                });

                this.$PageBase.find(".upload").upload(
                    function(_this,data){
                        // alert(data)
                        // console.log(_this);
                        // console.log(data.serverId);
                        previewImage(data.serverId);
                    },
                    function (_this,dataValue) {
                        // console.log(_this);
                        // console.log(dataValue);

                        // 处理图片的设置渲染
                        //  { type: "data-value", value: "6678955d-86e3-44b9-a9a2-0dbf081ab25e" }
                        // console.log("处理图片的设置渲染");

                        var value = dataValue.value;
                        if(dataValue.type == 'data-value'){
                            that.diyData['pagebase']['params']['image'] = value;
                        }
                        //value = value.split(",");

                        console.log(value);


                    }
                );

                // 设置可以隐藏页面基础属性的功能
                // console.log((that.$PageBase.find("#"+that.options.pageBaseId).find('span').length);
                if(that.$PageBase.find("#"+that.options.pageBaseId).find('span').length==0){
                    that.$PageBase.find("#"+that.options.pageBaseId).find('.title').append('<span>（点击隐藏）</span>');
                }
                this.$PageBase.find("#"+this.options.pageBaseId).click(function () {
                    //console.log(that.$PageBase.find('.goodsContent'));
                    if(that.$PageBase.find('.goodsContent').is(':hidden')){
                        that.$PageBase.find('.goodsContent').show(1000);
                        that.$PageBase.find("#"+that.options.pageBaseId).find('span').html('（点击隐藏）');
                    }else{
                        that.$PageBase.find('.goodsContent').hide(1000);
                        that.$PageBase.find("#"+that.options.pageBaseId).find('span').html('（点击显示）');
                    }

                });


            }


        },
        /**
         * 初始化删除事件
         */
        initDelete: function () {
            var $phoneMain = this.$phoneMain;
            var that = this;
            $phoneMain.on('click', '.btn-del', function () {
                var $this = $(this);
                var $item = $this.parent().parent()
                    , $nextItem = $item.next()
                    , itemId = $item.data('itemid');
                layer.confirm('确定要删除['+that.diyData[itemId].params.explain+']吗？', function (index) {
                    that.funDeleteItem(itemId);
                    $item.remove();
                    $nextItem.trigger('click');
                    layer.close(index);

                    // 隐藏编辑区内容
                    // this.$phoneMain.children() selected
                    // this.$phoneDiyEditor.parent("#diy-editor").show();
                    that.$phoneDiyEditor.parent("#diy-editor").hide();
                    var itemid = that.$phoneMain.find('.selected').attr('data-itemid');
                    console.log(itemid);
                    if(itemid){
                        that.renderEditor(itemid);
                    }
                });
            });
        },

        /**
         * 初始化提交事件 保存数据到后端
         */
        initSubmit:function () {
            var that = this;
            console.log(this.$Submit);
            this.$Submit.click(function () {
                console.log("initSubmit click");
                if ($.isEmptyObject(that.diyData)) {
                    layer.msg('至少存在一个页面组件', {anim: 6});
                    return false;
                }
                if(typeof that.options.submit == "function"){
                    that.options.submit({data: that.diyData});
                }else{
                    console.warn("$Submit",that.diyData);
                }
            });
        },

        /**
         * 初始化切换模式按钮
         */
        initSwitch:function () {
            var that = this;
            var opts = this.options;
            var $phoneMain = this.$phoneMain;

            // var modeName = '';
            // if(opts.defaultMode=='edit'){
            //     modeName = opts.mode.edit;
            // }else{
            //     modeName = opts.mode.yulan;
            // }

            this.$Switch.click(function () {
                var modelName = '';
                if($phoneMain.hasClass('yulan')){
                    $phoneMain.removeClass('yulan');
                    // console.log("removeClass $Switch");
                    modelName =  opts.mode.edit;
                }else{
                    $phoneMain.addClass('yulan');
                    // console.log("addClass $Switch");
                    modelName = opts.mode.yulan;
                }

                $('#'+opts.menuActionButtonId+'Tip').find('span').html(modelName);
            });
        },

        // ****************************************************************





        /**
         * 内部函数
         */
        // ****************************************************************

        /**
         * 生成新增数据的id
         * @returns {string}
         */
        funNewDataId: function (length) {
            //return 'p' + Math.random().toString().substr(3);
            if(!Number.isInteger(length)) length = 9;
            return 'p' + Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
        },
        /**
         * 数据绑定
         * @param itemId
         * @param itemIndex
         * @param val
         */
        funSetData: function (itemId, itemIndex, val) {
            // console.log(itemId, itemIndex, val);
            if(typeof itemIndex == "string"){
                itemIndex =['params',itemIndex];
            }
            // console.log(itemId, itemIndex, val);
            // console.log(itemIndex.length);

            var item = this.diyData[itemId][itemIndex[0]];
            //console.log(item);

            switch (itemIndex.length) {
                case 1:
                    item = val;
                    break;
                case 2:
                    item[itemIndex[1]] = val;
                    break;
                case 3:
                    item[itemIndex[1]][itemIndex[2]] = val;
                    break;
            }

            console.log(item);
        },
        /**
         * 删除diy元素
         */
        funDeleteItem: function (itemId) {
            delete this.diyData[itemId];
            //console.log(this.diyData); selected
        },

        // ****************************************************************




        /**
         * 渲染类
         */
        // ****************************************************************

        /**
         * 渲染整个diy页面
         */
        renderMain: function () {
            var html = '';
            $.each(this.diyData, function (index, item) {
                //console.log(index);
                if(index == 'pagebase') return true;
                html += template('tpl_diy_' + item.type, item);
            });
            this.$phoneMain.html(html);
            pettybDisposeImageUrl();
        },

        /**
         * 新增diy子元素
         */
        renderInsertDiyItem: function (type) {
            // 新记录id
            var diyItemId = this.funNewDataId();
            // console.log(diyItemId,type);
            //var item = {};
            var item = this.diyData[diyItemId] = $.extend(true, {}, {
                id: diyItemId,
                type: type
            },this.defaultData);
            // console.log(this.diyData);
            // 处理子元素集
            // if (item.hasOwnProperty('data')) {
            //     var data = {};
            //     $.each(item.data, function (index, val) {
            //         var dataId = method.diyData.newDataId();
            //         data[dataId] = val;
            //     });
            //     item.data = data;
            // }
            // // 渲染页面
            var html = template('tpl_diy_' + type, item);
            // console.log(html);
            // console.log(this.$phoneMain);
            // console.log(self);
            //$(options.phoneMain).append(html);
            this.$phoneMain.children().removeClass('selected'); // 清楚选择内容
            this.$phoneMain.append(html);
            $("#diy-"+diyItemId).addClass('selected');
            //.find('#diy-' + diyItemId).trigger('click');
            // 渲染编辑器
            this.renderEditor(diyItemId);
        },
        /**
         * 渲染元素编辑器
         * @param itemId
         */
        renderEditor: function (itemId) {
            // console.log(itemId);
            var item = this.diyData[itemId];
            // console.log("renderEditor");
            // console.log(item);
            //console.log( item.params.images.value );
            if(item.type=='images' && item.params.images && item.params.images.value){
                item.params.dataValue = item.params.images.value.join(',');
            }
            //console.log(item);
            var $form = $(template('tpl_editor_' + item.type, item));
            // // 注册所有事件
            // method.editor.event.register($form, diyData);
            // // 写入编辑器
            this.$phoneDiyEditor.html($form);
            this.$phoneDiyEditor.parent("#diy-editor").show();


            var thisItemId = itemId;
            var that = this;


            if(item.type=='images'){
                this.$phoneDiyEditor.find(".upload").upload(
                    function(_this,data){
                        // alert(data)
                        // console.log(_this);
                        // console.log(data.serverId);
                        previewImage(data.serverId);
                    },
                    function (_this,dataValue) {
                        // console.log(_this);
                        // console.log(dataValue);

                        // 处理图片的设置渲染
                        //  { type: "data-value", value: "6678955d-86e3-44b9-a9a2-0dbf081ab25e" }
                        // console.log("处理图片的设置渲染");

                        var value = dataValue.value;
                        if(dataValue.type == 'data-value') value = value.split(",");

                        // 数据绑定 (最多支持3级)
                        //console.log(thisItemId);
                        that.funSetData(thisItemId, 'images', {
                            'type':dataValue.type,
                            'value': value
                        });
                        // // 重新渲染diy元素
                        that.renderRefreshDiyItem(thisItemId);

                    }
                );
            }

        },
        /**
         * 重新渲染diy子元素
         * @param itemId
         */
        renderRefreshDiyItem: function (itemId) {
            var item = this.diyData[itemId]
                , html = template('tpl_diy_' + item.type, item)
                , $diy = function () {
                return $('#diy-' + item.id);
            };
            // console.log(item);
            // console.log(html);
            $diy().prop('outerHTML', html).addClass('selected');
            $diy().addClass('selected');

            // 如果试图片，进行图片的渲染
            if(item.type == 'images'){
                pettybDisposeImageUrl();
            }
        }



    };

    // 提供默认参数设置方法
    var defaults = {};
    $.pettybDiyEditorDefaults = function (options) {
        // console.log("pettybDiyEditorDefaults");
        defaults = $.extend({},defaults,options);
    };

    $.fn.pettybDiyEditor = function(options){
        // console.log("pettybDiyEditor");
        options = $.extend({},defaults,options);
        new diyPettyEditor(this,options);
    };


})(jQuery,window,document);