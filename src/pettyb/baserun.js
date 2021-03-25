/**
 * Created by jiefan on 2018/8/25.
 */
$(function () {
    //titile
    //var title = $.Ajax({},{},{});
    //$("title").html(title);

    //NotRunMBCoreInitialize

    if(typeof(NotRunMBCoreInitialize)=="undefined" || NotRunMBCoreInitialize==false){

        // 初始化access_token
        if (!$.isAccessTokenExist()){
            $.getAccessToken(function () {
                $.DebugLog("初始化access_token成功！");
            });
        }

        // 设置当前访问的路径
        $.setLocationHref();
    }

});