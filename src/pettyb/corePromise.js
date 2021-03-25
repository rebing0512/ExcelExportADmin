/**
 * Created by fengquanju on 2019/11/11.
 */
;(function($,window,document,undefined){
    var is_ios_client = false;
    console.log(navigator.userAgent);
    if (/(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
        is_ios_client = true;
        var MBCoreClientKey = Config.VLSClient;
        if (localStorage.getItem(MBCoreClientKey) && localStorage.getItem(MBCoreClientKey) != "undefined"){
            sessionStorage.setItem(MBCoreClientKey,localStorage.getItem(MBCoreClientKey) );
        }
        var access_token = Config.VLSAccessToken;
        if (localStorage.getItem(access_token) && localStorage.getItem(access_token) != "undefined"){
            sessionStorage.setItem(access_token,localStorage.getItem(access_token) );
        }
        var auth_token = Config.VLSAuthToken;
        if (localStorage.getItem(auth_token) && localStorage.getItem(auth_token) != "undefined"){
            sessionStorage.setItem(auth_token,localStorage.getItem(auth_token) );
        }
    }
    //调试日志输出
    $.DebugLog = DebugLog = function (str) {
        // console.log(str);
    };
    // 错误提示！
    $.ErrAlert = ErrAlert = function (str) {
        //alert(str);
        console.warn(str);
    };
    // 生成随机字符串
    $.RandomString = RandomString = function (len){
        len = typeof len !== 'undefined' ?  len : 32;
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = chars.length;
        var tmp = '';
        for (var i = 0; i < len; i++) {
            var index = Math.floor(Math.random() * maxPos);
            tmp += chars.charAt(index);
        }
        return tmp;
    };

    // 生成客户端唯一标识
    (function () {
        var MBCoreClientKey = Config.VLSClient;
        var MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
        if (!MBCoreClientValue || MBCoreClientValue=='undefined'){
            var RandomStringValue = RandomString();
            localStorage.setItem(MBCoreClientKey,"H5"+RandomStringValue);
            if(is_ios_client){
                sessionStorage.setItem(MBCoreClientKey,"H5"+RandomStringValue);
            }
        }else{
            if(is_ios_client){
                sessionStorage.setItem(MBCoreClientKey,MBCoreClientValue);
            }
        }
    })();
    //【Funciton】
    /**
     * 生成sign
     */
    var createSign = function(obj){

        // 处理时间
        if (obj.timestamp) obj.timestamp = parseInt(obj.timestamp/1000);

        var arr = [];
        for (var item in obj) {
            arr.push(obj[item]);
            arr.sort();
        }
        var arrString = arr.join("");
        DebugLog('arrString:'+arrString);
        var sha1Str = sha1(arrString);
        DebugLog('sha1Str:'+sha1Str);
        var md5Str = md5(sha1Str);
        DebugLog('md5Str:'+md5Str);
        var signStr = md5Str.toUpperCase();
        DebugLog('signStr:'+signStr);
        return signStr;
    };

    //getH5Mac
    $.getH5Mac = getH5Mac = function () {
        // VLSClient
        var MBCoreClientKey = Config.VLSClient;
        var MBCoreClientValue = null;//localStorage.getItem(MBCoreClientKey);
        if(is_ios_client){
            MBCoreClientValue = sessionStorage.getItem(MBCoreClientKey);
        }else{
            MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
        }
        return MBCoreClientValue;
    };
    $.isApp = isApp = function () {
        var Platform = getPlatform();
        if(Platform=='android' || Platform=='ios'){
            return true;
        }else{
            return false;
        }
    };
    // AccessToken存在
    $.isAccessTokenExist = isAccessTokenExist = function () {
        if(isApp()){
            var CIsAccessTokenExist =$.cookie('isAccessTokenExist');
            //return typeof(CIsAccessTokenExist)=="undefined"?false:CIsAccessTokenExist;
            if(typeof(CIsAccessTokenExist)=="undefined"){
                return false
            }else{
                if(CIsAccessTokenExist=='true'){
                    return true;
                }else{
                    return false;
                }
            }
        }
        var access_token = Config.VLSAccessToken;
        if(is_ios_client){
            //苹果端
            if (sessionStorage.getItem(access_token) && sessionStorage.getItem(access_token) != "undefined"){
                return true;
            }else{
                return false;
            }
        }else{
            //非苹果端
            if (localStorage.getItem(access_token) && localStorage.getItem(access_token) != "undefined"){
                return true;
            }else{
                return false;
            }
        }
    };

    $.isAuthTokenExist = isAuthTokenExist = function () {
        if(isApp()){
            var CIsAuthTokenExist =$.cookie('isAuthTokenExist');
            if(typeof(CIsAuthTokenExist)=="undefined"){
                return false
            }else{
                if(CIsAuthTokenExist=='true'){
                    return true;
                }else{
                    return false;
                }
            }
        }
        var auth_token = Config.VLSAuthToken;
        if(is_ios_client){
            if (sessionStorage.getItem(auth_token) && sessionStorage.getItem(auth_token) != "undefined" ){
                return true;
            }else{
                return false;
            }
        }else{
            if (localStorage.getItem(auth_token) && localStorage.getItem(auth_token) != "undefined" ){
                return true;
            }else{
                return false;
            }
        }
    };
    //【Funciton】
    $.localStorageAccessToken = localStorageAccessToken = function() {
        var access_token = Config.VLSAccessToken;
        if(is_ios_client){
            if (sessionStorage.getItem(access_token)){
                return sessionStorage.getItem(access_token);
            }else{
                return false;
            }
        }else{
            if (localStorage.getItem(access_token)){
                return localStorage.getItem(access_token);
            }else{
                return false;
            }
        }
    };
    //【Funciton】
    $.localStorageAuthToken = localStorageAuthToken = function() {
        var auth_token = Config.VLSAuthToken;
        if(is_ios_client){
            if (sessionStorage.getItem(auth_token)){
                return sessionStorage.getItem(auth_token);
            }else{
                return false;
            }
        }else{
            if (localStorage.getItem(auth_token)){
                return localStorage.getItem(auth_token);
            }else{
                return false;
            }
        }
    };
    // AuthToken存在
    $.isLogin = isLogin = function () {
        if (isAuthTokenExist()){
            DebugLog('is Login true');
        }else{
            goToLogin();
        }
    };
    $.checkLogin = checkLogin = function () {
        if (isAuthTokenExist()){
            //处理跳转
            var thisLocationHref = getLocationHref();
            window.location.href = thisLocationHref;
        }else{
            DebugLog(' check Login false');
        }
    };
    //获取跳转的地址
    $.getLocationHref = getLocationHref = function () {
        var location_href = Config.VLSLocationHref;
        if(is_ios_client){
            if (sessionStorage.getItem(location_href)){
                return sessionStorage.getItem(location_href);
            }else{
                return AppUrl.Index; //默认首页
            }
        }else{
            if (localStorage.getItem(location_href)){
                return localStorage.getItem(location_href);
            }else{
                return AppUrl.Index; //默认首页
            }
        }
    };
    // 设置当前访问的路径
    $.setLocationHref = setLocationHref = function (str) {
        // document.location.href;
        var href = typeof(str)==='undefined'?document.location.href:str;
        var matcher = new RegExp(Config.VSTRLogin,　'i');
        if(href.match(matcher)){
            //找到匹配项
            DebugLog("包含："+Config.VSTRLogin+"地址，不被记录。");
        }else{
            DebugLog("已设置跳转地址："+href);
            var location_href = Config.VLSLocationHref;
            localStorage.setItem(location_href,href);
            if(is_ios_client){
                sessionStorage.setItem(location_href,href);
            }
        }
    };
    //ajaxBase封装
    var ajaxBase = function (cfg) {
        return new Promise((resolve, reject)=>{
            var baseConfig = {
                'url':ApiUrl.testApiRun,
                'type':'post',
                'data':{},
                'headers':{},
                'dataType':'json',
                'success':function (res) {
                    DebugLog('ajaxBase success Default Res:');
                    // console.log(res);
                },
                'error':function (res) {
                    DebugLog('ajaxBase error Default Res:');
                    // console.log(res);
                }
            };

            var thisConfig = $.extend(baseConfig,cfg);
            DebugLog("ajaxBase thisConfig");
            DebugLog(thisConfig);

            var ajaxConfig = {
                url:thisConfig.url,
                type:thisConfig.type,
                data:thisConfig.data,
                headers:thisConfig.headers,
                dataType:thisConfig.dataType,
                success:function (res) {
                    resolve(res)
                },
                error:function (res) {
                    reject(res)
                },
                complete:function (res) {
                    DebugLog('ajaxBase Complete Res:');
                    DebugLog(res);
                }
            };

            //解决图片上传问题
            if(cfg.uploadFile == 1){
                ajaxConfig = $.extend(ajaxConfig,{
                    processData: false,
                    contentType: false,
                    timeout : cfg.timeout?cfg.timeout:30000
                });
            }

            if(cfg.traditional == 1){
                ajaxConfig = $.extend(ajaxConfig,{
                    traditional: true
                });
            }


            DebugLog("ajaxBase ajaxConfig");
            DebugLog(ajaxConfig);

            $.ajax(ajaxConfig);
        });
    };
    //获取access_token
    $.getAccessToken = getAccessToken =  function (){
        return new Promise((resolve, reject)=>{
            // 判断access_token是否存在，存在则返回
            if (isAccessTokenExist()){
                DebugLog("getAccessToken Err,isAccessTokenExist!");
                return false;
            }

            // 执行正常请求
            var timestamp = new Date().getTime();
            var nonce_str = RandomString();
            // VLSClient
            var MBCoreClientKey = Config.VLSClient;
            var MBCoreClientValue = null;//localStorage.getItem(MBCoreClientKey);
            if(is_ios_client){
                MBCoreClientValue = sessionStorage.getItem(MBCoreClientKey);
            }else{
                MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
            }

            var obj = {
                appid: Config.AppAppid,
                secret: Config.AppSecret,
                group_id: Config.AppGroupId,
                channel: Config.AppChannel,
                grant_type: Config.GrantTypeAccessToken,
                timestamp: timestamp,
                nonce_str: nonce_str,
                mac:MBCoreClientValue
            };
            DebugLog(obj);

            var sign = createSign(obj);
            DebugLog(sign);

            var data = {
                grant_type: Config.GrantTypeAccessToken,
                timestamp: timestamp,
                nonce_str: nonce_str,
                sign: sign,
                mac:MBCoreClientValue
            };
            var headers = {
                'appid': Config.AppAppid,
                'channel': Config.AppChannel
            };
            DebugLog(data);
            DebugLog(headers);

            ajaxBase({
                url:ApiUrl.getAccessToken,  //  url
                type:'post',          // 'post'
                data:data,            //  data
                headers:headers,      //  headers
                dataType:'json',      // 'json
            }).then(function (res) {
                getAccessTokenSuccFun(res);
                resolve();
            }).catch(function (res) {
                getAccessTokenErrorFun(res)
            });
        });
    }
    //获取access_token成功的处理方法
    getAccessTokenSuccFun = function (res) {
        var access_token_key = Config.VLSAccessToken;
        //access_token缓存到本地
        localStorage.setItem(access_token_key, res.result.access_token);
        if(is_ios_client){
            sessionStorage.setItem(access_token_key, res.result.access_token);
        }

        // 如果返回cuuid写入mac
        if (res.result.cuuid){
            var MBCoreClientKey = Config.VLSClient;
            localStorage.setItem(MBCoreClientKey, res.result.cuuid);
            if(is_ios_client){
                sessionStorage.setItem(MBCoreClientKey, res.result.cuuid);
            }
        }
    }
    //获取access_token失败的处理方法
    getAccessTokenErrorFun = function (res) {
        DebugLog("errorFun:");
        if (!res.responseText){
            return;
        }
        var code = JSON.parse(res.responseText).code;
        if (code == 403.5 || code == 403.6){
            DebugLog("errorFun:");
            getAccessToken();
        }else{
            ErrAlert("网络请求错误，请退出后重试！");
        }
    }
    //刷新access_token
    $.refreshAccessToken = refreshAccessToken =  function (){
        return new Promise((resolve, reject)=>{
            DebugLog("refreshAccessToken:");
            // 判断access_token是否存在，不存在则返回
            if (!isAccessTokenExist()){
                getAccessToken().then(function (res) {
                    resolve();
                });
                return false;
            }
            // 执行正常请求
            var timestamp = new Date().getTime();
            var nonce_str = RandomString();
            // VLSClient
            var MBCoreClientKey = Config.VLSClient;
            var MBCoreClientValue = null;
            //localStorage.getItem(MBCoreClientKey);
            if(is_ios_client){
                MBCoreClientValue = sessionStorage.getItem(MBCoreClientKey);
            }else{
                MBCoreClientValue = localStorage.getItem(MBCoreClientKey);
            }

            var obj = {
                appid: Config.AppAppid,
                secret: Config.AppSecret,
                group_id: Config.AppGroupId,
                channel: Config.AppChannel,
                grant_type: Config.GrantTypeAccessToken,
                timestamp: timestamp,
                nonce_str: nonce_str,
                mac:MBCoreClientValue
            };
            DebugLog(obj);

            var sign = createSign(obj);
            DebugLog(sign);

            var data = {
                grant_type: Config.GrantTypeAccessToken,
                timestamp: timestamp,
                nonce_str: nonce_str,
                sign: sign,
                mac:MBCoreClientValue
            };
            var headers = {
                'appid': Config.AppAppid,
                'channel': Config.AppChannel
            };

            // 判断auth_token
            if(isAuthTokenExist()){
                var auth_token = localStorageAuthToken();
                headers = $.extend(headers,{'mbcore-auth-token':auth_token});
            }

            DebugLog(data);
            DebugLog(headers);

            ajaxBase({
                url:ApiUrl.refreshAccessToken,  //  url
                type:'post',          // 'post'
                data:data,            //  data
                headers:headers,      //  headers
                dataType:'json',      // 'json
            }).then(function (res) {
                refreshAccessTokenSuccFun(res);
                resolve();
            }).catch(function (res) {
                refreshAccessTokenErrorFun(res)
            });
        });
    };
    refreshAccessTokenSuccFun = function (res) {
        var access_token_key = Config.VLSAccessToken;
        //access_token缓存到本地
        localStorage.setItem(access_token_key, res.result.access_token);
        if(is_ios_client){
            sessionStorage.setItem(access_token_key, res.result.access_token);
        }

        //是否移除autho_token
        if(res.result.removeAuthToken){
            var auth_token_key = Config.VLSAuthToken;
            localStorage.removeItem(auth_token_key);
            if(is_ios_client){
                sessionStorage.removeItem(auth_token_key);
            }
        }
    };
    refreshAccessTokenErrorFun = function (res) {
        DebugLog("errorFun:");
        if (!res.responseText){
            return;
        }
        var code = JSON.parse(res.responseText).code;
        if (code == 403.5 || code == 403.6){
            DebugLog("errorFun:");
            refreshAccessToken();
        }else{
            ErrAlert("网络请求错误，请退出后重试！");
        }
    }

    var MiddlewareErrorProcessor = function (res) {
        return new Promise((resolve, reject)=>{
            if (!res.responseText){
                return;
            }
            //403.12  //403.14
            var code = JSON.parse(res.responseText).code;
            if(code == 403.12 || code == 403.14){
                // 刷新AccessToken
                refreshAccessToken().then(function () {
                    resolve();
                });
            }else if(code == 403.21 || code == 403.22 || code == 403.23 || code == 403.24){
                // 踢出登录，跳转到登录页面
                var auth_token = Config.VLSAuthToken;
                localStorage.removeItem(auth_token);
                if(is_ios_client){
                    sessionStorage.removeItem(auth_token);
                }
                goToLogin();
            }else{
                ErrAlert("网络请求错误，请退出后重试！");
            }
        })
    };
    //登录相关处理
    var goToLogin = function () {
        DebugLog("goToLogin");
        if(isApp()){
            window.MBC.goLogin();
        }else{
            //清除auth_token
            var auth_token_key = Config.VLSAuthToken;
            localStorage.removeItem(auth_token_key);
            if(is_ios_client){
                sessionStorage.removeItem(auth_token_key);
            }
            window.location.href = AppUrl.Login;
        }
    };
    var AjaxAccessToken = function (cfg) {
        return new Promise((resolve, reject)=>{
            DebugLog("----AjaxAccessToken-----");
            DebugLog("AjaxAccessToken cfg:");
            DebugLog(cfg);
            var access_token = localStorageAccessToken();
            // 如果access_token不存在
            if(!access_token){
                DebugLog("----access_token 不存在，启动获取access_token,重新启动api请求-----");
                getAccessToken().then(function (res) {
                    AjaxAccessToken(cfg).then(function (res) {
                        resolve(res);
                    })
                });
                return true;
            }
            // 头文件
            var headers = {
                'appid': Config.AppAppid,
                'mbcore-access-token': access_token
            };

            var thisConfig =  $.extend(cfg, {'headers':headers,'error':error});
            DebugLog("AjaxAccessToken thisConfig");
            DebugLog(thisConfig);
            ajaxBase({
                url:thisConfig.url,  //  url
                type:'post',          // 'post'
                data:thisConfig.data,            //  data
                headers:thisConfig.headers,      //  headers
                dataType:'json',      // 'json
            }).then(function (res) {
                resolve(res);
            }).catch(function (res) {
                MiddlewareErrorProcessor(res).then(function (res) {
                    AjaxAccessToken(cfg);
                });
            });
        });
    };

    var AjaxAuthToken = function (cfg) {
        return new Promise((resolve, reject)=>{
            DebugLog("----AjaxAuthToken-----");
            DebugLog("AjaxAuthToken cfg:");
            DebugLog(cfg);
            // 如果auth_token不存在
            var auth_token = localStorageAuthToken();
            var access_token = localStorageAccessToken();
            //任何一个不存在，都踢出到登录
            if(!auth_token || !access_token){
                goToLogin();
                return false; //终止处理
            }
            // 头文件
            var headers = {
                'appid': Config.AppAppid,
                'mbcore-access-token': access_token,
                'mbcore-auth-token': auth_token
            };
            var thisConfig =  $.extend(cfg, {'headers':headers,'error':error});
            DebugLog("AjaxAccessToken thisConfig");
            DebugLog(thisConfig);

            // 请求ajax
            ajaxBase({
                url:thisConfig.url,  //  url
                type:'post',          // 'post'
                data:thisConfig.data,            //  data
                headers:thisConfig.headers,      //  headers
                dataType:'json',      // 'json
            }).then(function (res) {
                resolve(res);
            }).catch(function (res) {
                MiddlewareErrorProcessor(res).then(function (res) {
                    AjaxAuthToken(cfg);
                });
            });
        });
    };

    // 封装ajax请求
    $.Ajax = function (cfg) {
        DebugLog("----Ajax-----");
        DebugLog("Ajax cfg:");
        DebugLog(cfg);

        var RunAjaxAccessToken,RunAjaxAuthToken;
        var platform = getPlatform();


        if(platform=='android' || platform=='ios'){
            $.DebugLog("进入App端的执行方法");
            //RunAjaxAccessToken = window.MBC.ajaxAccessToken;
            //RunAjaxAuthToken = window.MBC.ajaxAuthToken;
            is_login = typeof cfg.is_login !== 'undefined' ?  cfg.is_login : false;
            delete cfg.is_login;
            // cfg.api_type = is_login;
            // 1 是 AuthToken。2 是 AccessToken 3 是 check。
            switch(is_login){
                case 'check':
                    cfg.api_type = 3;
                    break;
                case true:
                    cfg.api_type = 1;
                    break;
                default:
                    cfg.api_type = 2;
            }
            $.DebugLog("下一步呼起： window.MBC.ajaxRequest");
            $.DebugLog(JSON.stringify(cfg));
            window.MBC.ajaxRequest(cfg);
            return true;
        }
        /*
         else{
         RunAjaxAccessToken = AjaxAccessToken;
         RunAjaxAuthToken = AjaxAuthToken;
         }
         */

        // 是否需要登录的状态，默认无需登录
        is_login = typeof cfg.is_login !== 'undefined' ?  cfg.is_login : false;
        delete cfg.is_login;  //删除属性
        if(is_login == "check"){
            if (($.isAuthTokenExist())){
                return new Promise((resolve, reject)=>{
                    AjaxAuthToken(cfg).then(function (res) {
                        resolve(res);
                    });
                })
            }else {
                return new Promise((resolve, reject)=>{
                    AjaxAccessToken(cfg).then(function (res) {
                        resolve(res);
                    });
                })
            }
        }else if (is_login == true){
            return new Promise((resolve, reject)=>{
                AjaxAuthToken(cfg).then(function (res) {
                    resolve(res);
                });
            })
        }else {
            return new Promise((resolve, reject)=>{
                AjaxAccessToken(cfg).then(function (res) {
                    resolve(res);
                });
            })
        }

    };

    //登录处理
    $.UserLogin = function (data) {
        return new Promise((resolve, reject)=>{
            DebugLog("****UserLogin*****");
            var thisData =  $.extend(data,{});
            //基础成功处理函数
            var baseSuccessFun = function (res) {
                DebugLog("***baseSuccessFun****");
                if(res.code == 1){
                    //存储auth_token
                    var auth_token_value = res.result.auth_token;
                    var auth_token_key = Config.VLSAuthToken;
                    localStorage.setItem(auth_token_key, auth_token_value);
                    if(is_ios_client){
                        sessionStorage.setItem(auth_token_key, auth_token_value);
                    }

                    // 写入old机制的登录第一次状态
                    localStorage.setItem('isLoginFirstPostMessage', '1'); //0
                    if(is_ios_client){
                        sessionStorage.setItem('isLoginFirstPostMessage', '1');
                    }


                    //存储后的处理流程
                    if(typeof(resolve)==='function'){
                        resolve(res);
                    }else{
                        //处理跳转
                        var thisLocationHref = getLocationHref();
                        //history.replaceState(state, title, thisLocationHref);
                        history.replaceState(null, '我的', AppUrl.Index);
                        window.location.href = thisLocationHref;
                    }
                }else {
                    //fail
                    reject && reject(res);
                    // layer.msg(res.result.msg);
                    // $.toast(res.result.msg,"text");
                }

            };
            var thisConfig = {
                url:ApiUrl.LoginApi,
                data:thisData,
            };
            AjaxAccessToken(thisConfig).then(function (res) {
                baseSuccessFun(res);
            })
        });
    };


})(jQuery,window,document);