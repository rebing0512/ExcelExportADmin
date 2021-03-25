
// 封装 缓存方式
(function(window,document,undefined){

    // 5M容量限制

    function RedisImage() {
        this.prefix = 'image:';
    }

    RedisImage.prototype.set = function (key, value) {
        try {
            localStorage.setItem(this.prefix+key, JSON.stringify(value));
        } catch (e) {
            if (e.code === QUOTA_EXCEEDED_ERR_CODE) {
                console.error("已经超出了最大容量，暂时未处理。");
            }
        }
    };

    RedisImage.prototype.get = function (key) {
        if(! window.localStorage) {
            return false; // 如果不支持 localStorage ，则全部走flase需要网络获取
        }
        return localStorage.getItem(this.prefix+key) ? JSON.parse(localStorage.getItem(this.prefix+key)) : false;
    };

    RedisImage.prototype.remove = function (key) {
        return localStorage.removeItem(this.prefix+key);
    };


    window.RedisImage = RedisImage;

})(window,document);


function getImageUrl(serverid,callback,parameters) {
    var priorityCallback = (arguments[2] && arguments[2].priority===false) ? arguments[2].priority : true;

    var type =  (arguments[2] && arguments[2].type) ? '.'+arguments[2].type : '';

    getBaseImageUri(serverid,function (res) {

        // parameters.type
        // 原始 original 原始图片
        // 预览 preview  等比例缩放，最长边800

        // console.log("getImageUrl");
        // console.log(res);
        var imageInfo = {};

        for(var key  in res){

            imageInfo[key] = res[key];
            imageInfo[key].url =  imageInfo[key].url + type;

        }

        callback && callback(imageInfo);

    },priorityCallback)
}

function getBaseImageUri(serverid,callback,priorityCallback) {

    var priorityCallback = (arguments[2]===false) ? arguments[2] : true;//设置第二个参数的默认值为2
    // console.log(priorityCallback);

    var imageInfo = {};
    var serverIds = null;
    if(typeof serverid == 'string'){
        serverIds = serverid.split(","); //字符分割
    }else if(serverid instanceof Array){
        serverIds = serverid;
    }
    // console.log("getBaseImageUri");
    // console.log(serverid);
    // console.log(serverIds);
    if(serverIds == null){
        // console.log("没有serverIds");
        return {};
    }

    var  Cache = new RedisImage(); //声明缓存处理

    var tempServerIds = [];
    for(var j = 0,len=serverIds.length; j < len; j++) {
        //console.log(j);
        var serverid = serverIds[j];
        //console.log(serverid);
        var thisImageInfo = Cache.get(serverid);
        //console.log(thisImageInfo);
        if(thisImageInfo){
            imageInfo[serverid] = thisImageInfo;
            imageInfo[serverid].cdev = 'cache';
        }else{
            tempServerIds.push(serverid);
        }
    }

    //console.log(imageInfo);
    // console.log(tempServerIds);


    //console.log(Cache.get("48435713-da39-41f0-817d-bac9f14f6e93"));

    // 是否执行优先回调，默认执行，获取完本地图片优先通知1次
    // console.log(Object.keys(imageInfo).length);
    if(priorityCallback && Object.keys(imageInfo).length>0){
        callback && callback(imageInfo);
        var priority = imageInfo;
        imageInfo = {};
        imageInfo.priority = priority;
    }

    // 如果所有信息本地不完全拥有，怎接口请求
    if(tempServerIds.length>0){
        var cfg = {
            'url':ApiUrl.getImageUri,
            'data':{
                serverIds:tempServerIds
            },
            'success':function (res) {

                //console.log("------ *************** ");
                //console.log(res);
                // @todo:本地存储逻辑

                //var imageInfo = {};// that.imageInfo;
                //console.log(imageInfo);

                var baseImageInfo = res.result.imageInfo;
                var basePathInfo = res.result.pathInfo;
                var length = res.result.num;

                for(var key  in baseImageInfo){
                    imageInfo[key] = baseImageInfo[key];
                    imageInfo[key].url = basePathInfo[imageInfo[key].storage_name]+imageInfo[key].uri;
                    imageInfo[key].cdev = 'api';

                    delete imageInfo[key].storage_name;
                    delete imageInfo[key].uri;
                    delete imageInfo[key].dev;

                    // 存储信息

                    Cache.set(key,imageInfo[key]);

                }

                callback && callback(imageInfo);

            }
        };
        $.Ajax(cfg);
    }else if(!priorityCallback){
        // 没有更多数据时直接回调
        callback && callback(imageInfo);
    }

}

// <img src="./img/chat.png" width="28" height="28" class="pettybImage" data-serverid="d79d49da-f238-4722-9d60-7390b6945ace" data-imgstate="0" />
function pettybDisposeImageUrl() {
    // console.log("pettybDisposeImageUrl**");
    var serverIds = [];
    $('img.pettybImage[data-imgstate="0"]').map(function (index,item) {
        //console.log($(item));
        serverIds.push($(item).data('serverid'));
    });
    if(serverIds.length==0){
        // console.log('pettybDisposeImageUrl 无数据');
        return true;
    }
    // console.log(serverIds);
    (function () {
        getImageUrl(serverIds,function (res) {
            for(var serverId in res){
                $('img[data-serverid="'+serverId+'"]').attr('src',res[serverId].url).data('imgstate',1);
            }
        })
    })();

}