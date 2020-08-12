/**
 * Created by jiefan on 2019/10/5.
 */
;(function($,window,document,undefined){

    // console.log(navigator.userAgent.toLowerCase());
    // var localStorage = null;
    // if (/(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
    //     localStorage = window.localStorage;
    // }else{
    //     localStorage = window.localStorage;
    // }
    //localStorage = window.localStorage;

    var is_ios_client = false;
    if (/(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
        console.log(navigator.userAgent);
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

    //var定义的变量是全局变量或者函数变量
    //let定义的变量是块级的变量

    //调试日志输出
    $.DebugLog = DebugLog = function (str) {
        // console.log(str);
    };
    // 错误提示！
    $.ErrAlert = ErrAlert = function (str) {
        //alert(str);
        // console.warn(str);
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


    // **************************************
    // **************************************
    // 获取当前访问平台
    $.getPlatform = getPlatform = function () {
        var ua = navigator.userAgent.toLowerCase();
        var platform = '';

        // 判断是否在App内
        if(ua.match(/mbcore/i)=="mbcore") {

            //ios
            if(ua.match(/iphone/i) || ua.match(/ios/i)) {
                platform = 'ios';
            }else if(ua.match(/android/i)) {  //android
                platform = 'android';
            }else if(ua.match(/mbcclient/i)) {  //未来客户端
                platform = 'client';
            }
        }

        // 判定微信客户端
        if(platform==''){
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                platform = 'wechat';
            }
        }

        // 判定手机环境
        if(platform==''){
            if(ua.match(/android/i)) {
                platform = 'android-wap';
            }else if(ua.match(/iphone/i)) {
                platform = 'iphone-wap';
            }else if(ua.match(/ipad/i)) {
                platform = 'ipad-wap';
            }
        }

        // if(platform=='iphone-wap'  || platform=='ipad-wap' ){
        //     window.onload = function () {
        //         setTimeout(function () {
        //             window.addEventListener("popstate",function (e) {
        //                 self.location = document.referrer;
        //             })
        //         },500)
        //     }
        // }

        if(platform == ''){
            platform = 'pc';
        }


        if(Config.Mode == 'development'){
            if(platform=='android-wap' || platform=='iphone-wap'  || platform=='ipad-wap' ){
                platform = 'wechat';
            }
            // if($(".dev-tip").length == 0){
            //     var html = '<div class="dev-tip" style="width: 50px;max-height:30px;text-align: center;background-color: #890101;position: fixed;top: 3.2rem;left: 30px;z-index: 999999999;color: #fff;border-radius: 4px;font-size: 12px;padding: 2px 6px;"><span>开发模式</span></div>';
            //     $("body").append(html);
            // }

        }

        return platform;

    };

    //判断微信客户端所在的环境是ios
    $.isWechatIosSystem = isWechatIosSystem = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (getPlatform() == 'wechat' && ua.match(/iphone/i)){
            return true
        }else {
            return false
        }
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

    // **************************************
    // **************************************

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


    // 获得AccessToken
    $.getAccessToken = getAccessToken =  function (callback){

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


        var successFun = function (res) {
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

            // callback 回调
            (callback && typeof(callback)==="function") && callback();
        };
        var errorFun = function (res) {
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
        };

        $.ajax({
            url:ApiUrl.getAccessToken,  //  url
            type:'post',          // 'post'
            data:data,            //  data
            headers:headers,      //  headers
            dataType:'json',      // 'json'
            success:successFun,   //  successFun
            error:errorFun,       //  errorFun
            complete:function (res) {
                DebugLog("getAccessToken Complete!");
            }
        });
    };




    // 分别封装方法
    /*
     cfg = {
     url:'',
     type:'',
     data:'',
     headers:'',
     dataType:'',
     success:'',
     error:'',
     };
     */

    var ajaxBase = function (cfg) {
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
            success:thisConfig.success,
            error:thisConfig.error,
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

    };


    $.refreshAccessToken = refreshAccessToken =  function (callbackRun,callbackErr){
        DebugLog("refreshAccessToken:");
        // 判断access_token是否存在，不存在则返回
        if (!isAccessTokenExist()){
            getAccessToken(function () {
                callbackRun();
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


        var successFun = function (res) {
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

            // callback 回调
            (callbackRun && typeof(callbackRun)==="function") && callbackRun();
        };


        var errorFun = function (res) {
            DebugLog("errorFun:");
            if (!res.responseText){
                return;
            }
            var code = JSON.parse(res.responseText).code;
            if (code == 403.5 || code == 403.6){
                DebugLog("errorFun:");
                refreshAccessToken(callbackRun,callbackErr);
            }else{
                (callbackErr && typeof(callbackErr)==="function") && callbackErr(res);
                ErrAlert("网络请求错误，请退出后重试！");
            }
        };

        $.ajax({
            url:ApiUrl.refreshAccessToken,  //  url
            type:'post',          // 'post'
            data:data,            //  data
            headers:headers,      //  headers
            dataType:'json',      // 'json'
            success:successFun,   //  successFun
            error:errorFun,       //  errorFun
            complete:function (res) {
                DebugLog("getAccessToken Complete!");
            }
        });
    };

    var MiddlewareErrorProcessor = function (res,callbackRun,callbackErr) {
        if (!res.responseText){
            return;
        }
        //403.12  //403.14
        var code = JSON.parse(res.responseText).code;
        if(code == 403.12 || code == 403.14){
            // 刷新AccessToken
            refreshAccessToken(callbackRun,callbackErr);
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
    };


    var AjaxAccessToken = function (cfg) {
        DebugLog("----AjaxAccessToken-----");
        DebugLog("AjaxAccessToken cfg:");
        DebugLog(cfg);

        var access_token = localStorageAccessToken();
        // 如果access_token不存在
        if(!access_token){
            DebugLog("----access_token 不存在，启动获取access_token,重新启动api请求-----");
            getAccessToken(function(){
                AjaxAccessToken(cfg);
            });
            return true;
        }

        // 头文件
        var headers = {
            'appid': Config.AppAppid,
            'mbcore-access-token': access_token
        };

        // 错误处理机制
        var errorFun = MiddlewareErrorProcessor;

        var is_errfun_exist = typeof(cfg.error) === 'function' ?  true : false;
        DebugLog("AjaxAccessToken : is_errfun_exist(是否存在错误处理函数):");
        DebugLog(is_errfun_exist);
        var error;
        if(is_errfun_exist){
            var thisErrFun = cfg.error;
            error = function (res) {
                errorFun(res,function(){
                    AjaxAccessToken(cfg);
                },thisErrFun);
            }
        }else{
            error = function (res) {
                errorFun(res,function(){
                    AjaxAccessToken(cfg);
                });
            }
        }

        var thisConfig =  $.extend(cfg, {'headers':headers,'error':error});
        DebugLog("AjaxAccessToken thisConfig");
        DebugLog(thisConfig);

        // 请求ajax
        ajaxBase(thisConfig);
    };

    var AjaxAuthToken = function (cfg) {
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


        // 错误处理机制
        var errorFun = MiddlewareErrorProcessor;

        var is_errfun_exist = typeof(cfg.error) === 'function' ?  true : false;
        DebugLog("AjaxAuthToken : is_errfun_exist(是否存在错误处理函数):");
        DebugLog(is_errfun_exist);
        var error;
        if(is_errfun_exist){
            var thisErrFun = cfg.error;
            error = function (res) {
                errorFun(res,function(){
                    AjaxAccessToken(cfg);
                },thisErrFun);
            }
        }else{
            error = function (res) {
                errorFun(res,function(){
                    AjaxAccessToken(cfg);
                });
            }
        }

        var thisConfig =  $.extend(cfg, {'headers':headers,'error':error});
        DebugLog("AjaxAccessToken thisConfig");
        DebugLog(thisConfig);

        // 请求ajax
        ajaxBase(thisConfig);
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

    //登录处理
    $.UserLogin = function (data,success,fail) {
        DebugLog("****UserLogin*****");console.log('****UserLogin*****');return false;
        var thisData =  $.extend(data,{});
        //基础成功处理函数
        var baseSuccessFun = function (res,callback) {
            DebugLog("***baseSuccessFun****");
            console.log(res);
            return false;
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
                if(typeof(callback)==='function'){
                    callback(res);
                }else{
                    //处理跳转
                    var thisLocationHref = getLocationHref();
                    //history.replaceState(state, title, thisLocationHref);
                    history.replaceState(null, '我的', AppUrl.Index);
                    window.location.href = thisLocationHref;
                }
            }else {
                //fail
                fail && fail(res);
                // layer.msg(res.result.msg);
                // $.toast(res.result.msg,"text");
            }

        };

        // 成功处理函数
        var is_successfun_exist = typeof(success) === 'function' ?  true : false;
        DebugLog("UserLogin : is_successfun_exist(是否存在成功处理函数):");
        DebugLog(is_successfun_exist);
        var successFun;
        if(is_successfun_exist){
            var thisSuccessFun = success;
            successFun = function (res) {
                baseSuccessFun(res,thisSuccessFun);
            }
        }else{
            successFun = function (res) {
                baseSuccessFun(res);
            }
        }

        var thisConfig = {
            url:ApiUrl.LoginApi,
            data:thisData,
            success:successFun,
            error:fail

        };
        DebugLog(thisConfig);
        AjaxAccessToken(thisConfig);
    };

    //密码登录
    $.pwdLogin = function (data,success) {
        DebugLog("****UserLogin*****");
        var thisData =  $.extend(data,{});



        //基础成功处理函数
        var baseSuccessFun = function (res,callback) {
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
                if(typeof(callback)==='function'){
                    callback(res);
                }else{
                    //处理跳转
                    var thisLocationHref = getLocationHref();
                    //history.replaceState(state, title, thisLocationHref);
                    history.replaceState(null, '我的', AppUrl.Mine);
                    window.location.href = thisLocationHref;
                }
            }else {
                //
                layer.msg(res.result.msg);
                // $.toast(res.result.msg,"text");
            }

        };

        // 成功处理函数
        var is_successfun_exist = typeof(success) === 'function' ?  true : false;
        DebugLog("UserLogin : is_successfun_exist(是否存在成功处理函数):");
        DebugLog(is_successfun_exist);
        var successFun;
        if(is_successfun_exist){
            var thisSuccessFun = success;
            successFun = function (res) {
                baseSuccessFun(res,thisSuccessFun);
            }
        }else{
            successFun = function (res) {
                baseSuccessFun(res);
            }
        }

        var thisConfig = {
            url:ApiUrl.pwdLoginApi,
            data:thisData,
            success:successFun,
        };
        DebugLog(thisConfig);
        AjaxAccessToken(thisConfig);
    };

    //微信登录处理
    $.wxLogin = function (data,success) {
        DebugLog("****wxLogin*****");
        var thisData =  $.extend(data,{});

        //基础成功处理函数
        var baseSuccessFun = function (res,callback) {
            DebugLog("***baseSuccessFun****");
            if(res.code == 1){
                //存储auth_token
                var auth_token_value = res.result.auth_token;
                var auth_token_key = Config.VLSAuthToken;
                localStorage.setItem(auth_token_key, auth_token_value);
                if(is_ios_client){
                    sessionStorage.setItem(auth_token_key, auth_token_value);
                }

                // 写入old机制的登录第一次
                localStorage.setItem('isLoginFirstPostMessage', '1'); //0
                if(is_ios_client){
                    sessionStorage.setItem('isLoginFirstPostMessage', '1');
                }

                //存储后的处理流程
                if(typeof(callback)==='function'){
                    callback(res);
                }else{
                    // console.log("处理跳转");
                    // console.log(getLocationHref());
                    // console.log(localStorage.getItem(auth_token_key, auth_token_value));
                    //处理跳转
                    var thisLocationHref = getLocationHref();
                    history.replaceState(null, '我的', AppUrl.Mine);
                    window.location.href = thisLocationHref;

                }
            }else {
                //
                layer.msg(res.result.msg);
                // $.toast(res.result.msg,"text");
            }

        };

        // 成功处理函数
        var is_successfun_exist = typeof(success) === 'function' ?  true : false;
        DebugLog("wxLogin : is_successfun_exist(是否存在成功处理函数):");
        DebugLog(is_successfun_exist);
        var successFun;
        if(is_successfun_exist){
            var thisSuccessFun = success;
            successFun = function (res) {
                baseSuccessFun(res,thisSuccessFun);
            }
        }else{
            successFun = function (res) {
                baseSuccessFun(res);
            }
        }


        var thisConfig = {
            url:ApiUrl.wxLoginApi,
            data:thisData,
            success:successFun,
        };
        DebugLog(thisConfig);
        AjaxAccessToken(thisConfig);
    };

    //微信登录绑定手机
    $.mobileBind = function (data,success) {
        DebugLog("****mobileBind*****");
        var thisData =  $.extend(data,{});



        //基础成功处理函数
        var baseSuccessFun = function (res,callback) {
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
                if(typeof(callback)==='function'){
                    callback(res);
                }else{
                    //处理跳转
                    var thisLocationHref = getLocationHref();
                    //history.replaceState(state, title, thisLocationHref);
                    history.replaceState(null, '我的', AppUrl.Mine);
                    window.location.href = thisLocationHref;
                }
            }else {
                //
                layer.msg(res.result.msg);
                // $.toast(res.result.msg,"text");
            }

        };

        // 成功处理函数
        var is_successfun_exist = typeof(success) === 'function' ?  true : false;
        DebugLog("UserLogin : is_successfun_exist(是否存在成功处理函数):");
        DebugLog(is_successfun_exist);
        var successFun;
        if(is_successfun_exist){
            var thisSuccessFun = success;
            successFun = function (res) {
                baseSuccessFun(res,thisSuccessFun);
            }
        }else{
            successFun = function (res) {
                baseSuccessFun(res);
            }
        }

        var thisConfig = {
            url:ApiUrl.mobileBind,
            data:thisData,
            success:successFun,
        };
        DebugLog(thisConfig);
        AjaxAuthToken(thisConfig);
    };

    //手机登录绑定微信
    $.weixinBind = function (data,success) {
        DebugLog("****wxLogin*****");
        var thisData =  $.extend(data,{});

        //基础成功处理函数
        var baseSuccessFun = function (res,callback) {
            DebugLog("***baseSuccessFun****");
            if(res.code == 1){
                //绑定成功
                //存储后的处理流程
                if(typeof(callback)==='function'){
                    callback(res);
                }else{
                    //处理跳转
                    var thisLocationHref = getLocationHref();
                    //history.replaceState(state, title, thisLocationHref);
                    history.replaceState(null, '我的', AppUrl.Mine);
                    window.location.href = thisLocationHref;
                }
            }else {
                //
                layer.msg(res.result.msg);
                // $.toast(res.result.msg,"text");
            }

        };

        // 成功处理函数
        var is_successfun_exist = typeof(success) === 'function' ?  true : false;
        DebugLog("wxLogin : is_successfun_exist(是否存在成功处理函数):");
        DebugLog(is_successfun_exist);
        var successFun;
        if(is_successfun_exist){
            var thisSuccessFun = success;
            successFun = function (res) {
                baseSuccessFun(res,thisSuccessFun);
            }
        }else{
            successFun = function (res) {
                baseSuccessFun(res);
            }
        }


        var thisConfig = {
            url:ApiUrl.weixinBind,
            data:thisData,
            success:successFun,
        };
        DebugLog(thisConfig);
        AjaxAuthToken(thisConfig);
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
                AjaxAuthToken(cfg);
                //RunAjaxAuthToken(cfg);
            }else {
                AjaxAccessToken(cfg);
                //RunAjaxAccessToken(cfg);
            }
        }else if (is_login == true){
            AjaxAuthToken(cfg);
            //RunAjaxAuthToken(cfg);
        }else {
            AjaxAccessToken(cfg);
            //RunAjaxAccessToken(cfg);
        }

    };


})(jQuery,window,document);