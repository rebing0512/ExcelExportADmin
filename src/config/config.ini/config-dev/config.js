/**
 * Created by fengquanju on 2019/10/5.
 */


var domainConfig = {
    pmCore:'https://mbdev-pettyb.pettyb.com/',  //【*】
    pmStorage:'https://mbdev-pettyb-storage.pettyb.com/',
    groupName:'dev_cpa_pca_',
    baseUrl:'https://mbdev-wohand-partner-api.pettyb.com/'
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
    'AppAppid':'TfZ4wruPFDWZTEwPwqutxW1c7XsHK9H',  //appid
    'AppSecret':'6B7HQ2XSK4RLGHtRrFJNcR2dRIIDNrZa', //secret
    'AppChannel':'pcadmin',  //channel
    'AppGroupId':'14' //group_id


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
    LoginApi:domainConfig.baseUrl + 'admin/login',//登录接口
};