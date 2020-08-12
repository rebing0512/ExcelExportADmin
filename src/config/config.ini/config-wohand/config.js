/**
 * Created by fengquanju on 2019/10/5.
 */


var domainConfig = {
    pmCore:'http://gongxiang-core.hifgoods.com/',  //【*】
    pmStorage:'http://gongxiang-storage.hifgoods.com/',
    groupName:'pro_cpa_admin_',
    baseUrl:'http://gongxiang.hifgoods.com/'
};




//验证机制
var Config = {

    /*Var*/
    'VLSAccessToken':domainConfig.groupName+'access_token',  /* Var localStorage*/
    'VLSAuthToken':domainConfig.groupName+'auth_token',
    'VLSClient':domainConfig.groupName+'mbcore_client',  /* Var localStorage*/  //【*】

    'Mode':'development',/*默认是开发模式，如果是prodect即是产品模式*/

    /*Api*/
    'GrantTypeAccessToken':'client_credential',  //grant_type
    'AppAppid':'VlvvzywUmzMJK5byjfXCA2YFkZIm7185',  //appid
    'AppSecret':'qnctVSLiQnYbVC5Uo6fjKzFbuEKg4Zei', //secret
    'AppChannel':'pcadmin',  //channel
    'AppGroupId':'101' //group_id


};

var AppUrl = {
    Index:domainConfig.baseUrl + 'CityPartnersAdmin/index.html',
    Login:domainConfig.baseUrl+'CityPartnersAdmin/login.html',
}

//用户中心接口
var ApiUrl = {
    //   // 新接口
    'getAccessToken': domainConfig.pmCore +'core/oauth/getAccessToken',   //--------【 * ok】
    'refreshAccessToken': domainConfig.pmCore +'core/oauth/refreshAccessToken',  //--------【ok】
    'getImageUri':domainConfig.pmStorage +'getImageUri',
    'getUploadImageToken':domainConfig.pmStorage +'getUploadImageToken',
    LoginApi:domainConfig.baseUrl + 'CityPartnersApi/admin/login',//登录接口
};