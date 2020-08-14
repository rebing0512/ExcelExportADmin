/**
 * Created by Jenson on 2020/08/12.
 */
var baseUrl = domainConfig.baseUrlApi;
var pmCore = domainConfig.pmCore;
var TplDefaults = domainConfig.baseUrlClient + 'PartnerAdmin/';
var api = {
    menuIndex:baseUrl+'admin/partner/menu', // 后台菜单
    adminLogout:baseUrl+'admin/partner/logout', // 退出登录
    changePassword:baseUrl+'admin/partner/changePassword', // 修改密码
    adminList:baseUrl+'admin/partner/adminList',//管理员列表
    adminShow:baseUrl+'admin/partner/adminDetail',//管理员详情
    adminEdit:baseUrl+'admin/partner/adminEdit',//管理员编辑
    adminFrozen:baseUrl+'admin/partner/adminFrozen',//管理员冻结
    adminAdd:baseUrl+'admin/partner/adminAdd',//新增管理员
    adminLog:baseUrl+'admin/partner/adminLog',//管理员操作列表
    adminLogDel:baseUrl+'admin/partner/adminLogDelete',//操作日志删除
    overviewIndex:baseUrl+'admin/partner/overview',//概况

    partnerList:baseUrl+'admin/partner/partnerLists',//城市合伙人列表
    inviteSearch:baseUrl+'admin/partner/inviteSearch',//邀请搜索
    partnerInvite:baseUrl+'admin/partner/invite',//邀请用户

    financeList:baseUrl+'admin/partner/finance/financeLists',//财务列表
    financeAgree:baseUrl+'admin/partner/finance/agree',//提现申请同意
    financeRefuse:baseUrl+'admin/partner/finance/refuse',//提现申请拒绝

    userData:baseUrl+'admin/partner/statistics/userData',//统计 按用户
    platformData:baseUrl+'admin/partner/statistics/platformData',//统计 全平台

    articleLists:baseUrl + 'admin/partner/article/articleLists',//文章列表
    articleInfo: baseUrl + 'admin/partner/article/articleInfo/',//文章单条信息
    articleAdd: baseUrl + 'admin/partner/article/articleAdd',//文章增加
    articleEdit: baseUrl + 'admin/partner/article/articleEdit',//文章编辑
    articleDelete: baseUrl + 'admin/partner/article/articleDelete/',//删除文章
    articleCategoryLists: baseUrl + 'admin/partner/article/category/articleCategoryLists',//文章分类
    articleCategoryInfo: baseUrl + 'admin/partner/article/category/articleCategoryInfo/',// 获取文章单条信息
    articleCategoryAdd: baseUrl + 'admin/partner/article/category/articleCategoryAdd',//文章分类增加
    articleCategoryEdit: baseUrl + 'admin/partner/article/category/articleCategoryEdit',//文章分类编辑
    articleCategoryDelete: baseUrl + 'admin/partner/article/category/articleCategoryDelete/',//文章分类删除

    advertCategoryLists: baseUrl + 'admin/partner/advert/category/advertCategoryLists',//广告分类
    advertCategoryAdd: baseUrl + 'admin/partner/advert/category/advertCategoryAdd',//广告分类增加
    advertCategoryEdit: baseUrl + 'admin/partner/advert/category/advertCategoryEdit',//广告分类编辑
    advertCategoryInfo: baseUrl + 'admin/partner/advert/category/advertCategoryInfo/',//广告分类单条信息
    advertCategoryDelete: baseUrl + 'admin/partner/advert/category/advertCategoryDelete/',//广告分类删除
    advertCategoryStatusChange: baseUrl + 'admin/partner/advert/category/advertCategoryStatusChange',//更改状态广告分类
    advertLists: baseUrl + 'admin/partner/advert/advertLists',//广告列表
    advertAdd: baseUrl + 'admin/partner/advert/advertAdd',//广告增加
    advertEdit: baseUrl + 'admin/partner/advert/advertEdit',//广告编辑
    advertInfo: baseUrl + 'admin/partner/advert/advertInfo/',//获取单条广告信息
    advertDelete: baseUrl + 'admin/partner/advert/advertDelete/',//删除广告
    advertTypeLists: baseUrl + 'admin/partner/advert/type/advertTypeLists',//广告类型
};