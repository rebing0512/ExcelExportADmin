/**
 * Created by wangjian on 2020/08/12.
 */
var baseUrl = domainConfig.baseUrl;
var pmCore = domainConfig.pmCore;
var TplDefaults = domainConfig.baseUrl + 'PartnerAdmin/';
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

    partnerList:baseUrl+'admin/partner/list',//城市合伙人列表
    inviteSearch:baseUrl+'admin/partner/inviteSearch',//邀请搜索
    partnerInvite:baseUrl+'admin/partner/invite',//邀请用户
    financeList:baseUrl+'admin/finance/list',//财务列表
    financeAgree:baseUrl+'admin/finance/agree',//提现申请同意
    financeRefuse:baseUrl+'admin/finance/refuse',//提现申请拒绝
    userData:baseUrl+'admin/statistics/userData',//统计 按用户
    platformData:baseUrl+'admin/statistics/platformData',//统计 全平台
    articleLists:baseUrl + 'admin/article/lists',//文章列表
    articleCategoryLists: baseUrl + 'admin/article/category/lists',//文章分类
    articleInfo: baseUrl + 'admin/article/info/',//文章单条信息
    articleAddEdit: baseUrl + 'admin/article/addEdit',//文章增加修改
    articleDelete: baseUrl + 'admin/article/delete/',//删除文章
    articleCategoryInfo: baseUrl + 'admin/article/category/info/',// 获取文章单条信息
    articleCategoryDelete: baseUrl + 'admin/article/category/delete/',//文章分类删除
    articleCategoryAddEdit: baseUrl + 'admin/article/category/addEdit',//文章分类增加修改
    advertCategoryLists: baseUrl + 'admin/advert/category/lists',//广告分类
    advertAddEdit: baseUrl + 'admin/advert/addEdit',//广告增加修改
    advertTypeLists: baseUrl + 'admin/advert/type/lists',//广告分类
    advertCategoryAddEdit: baseUrl + 'admin/advert/category/addEdit',//广告分类增加修改
    advertCategoryInfo: baseUrl + 'admin/advert/category/info/',//广告分类单条信息
    advertCategoryDelete: baseUrl + 'admin/advert/category/delete/',//广告分类删除
    advertLists: baseUrl + 'admin/advert/lists',//广告列表
    advertInfo: baseUrl + 'admin/advert/info/',//获取单条广告信息
    advertDelete: baseUrl + 'admin/advert/delete/',//删除广告
}