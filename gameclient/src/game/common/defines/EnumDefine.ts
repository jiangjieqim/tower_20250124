
/**交互ui枚举*/
export enum EViewType {
    None = 0,//未定义
    //----------------------Login
    MsgBox = 1,//消息窗
    MidLabel = 2,//文本提示
    Loading = 3,//加载页面
    //----------------------------------------
    Main = 4,//主界面
    LoginNew = 5,//登录
    HelpView = 6,//说明界面
    SmallTips = 7,//小tips View
    LoginQuFu = 8,//登录选服
    Wait = 9,//等待UI
    // GetReward = 10,//获取奖励弹出

    /**局内战斗主界面 */
    ComposeMain = 11,

    BagView = 12,
    ItemTip = 13,
    HeroTip = 14,
    HeroTip1 = 15,
    SkillTip = 16,
    // StrengthenView = 17,
    FightBossTips = 18,
    KaPaiView = 19,
    TowertMainLinbaoTip = 20,
    FightTask = 21,
    FightPossess = 22,//局内统计
    FightResult = 23,//战斗结算
    Gamble = 24,//赌博,祈愿
    Mythos = 25,//神话
    YinSiView = 26,
    // FuncCard = 27,//旧功能卡
    DHMView = 28,
    FuncCardShow = 29,//显示功能卡信息
    TowertMainCardView1 = 30,
    TowertMainCardTip1 = 31,
    TowertMainCardTip = 32,
    TowertMainCardView2 = 33,
    YinDaoView = 34,//全屏引导
    BoxView = 35,
    BoxView1 = 36,
    BoxView2 = 37,
    BoxView3 = 38,
    CompSell = 39,//售卖
    RoleInfoView = 40,
    RoleInfoView1 = 41,
    RoleInfoView2 = 42,
    GuideHitUView = 43,//引导遮挡,
    FuncOpenView = 44,//功能开启
    DayTaskView = 45,
    RewardTip = 46,
    RewardView = 47,
    JjcView = 48,
    CardShow = 49,//卡牌展示特效
    FriendFightView = 50,
    FriendFightView1 = 51,
    Epic = 52,
    WaveTips = 53,//波次提示
    ErrTips = 54,
    RedTips = 55,//红色警告
    FightDebugView = 56,//调试界面
    MailView = 57,
    MailView1 = 58,
    MailView2 = 59,
    RankView = 60,
    RankView1 = 61,
    LinBaoCQView = 62,
    CardCQView = 63,
    FuncCard2 = 64,//新功能卡2
    LinBaoCQView1 = 65,
    LinBaoCQView2 = 66,
    ProbabilityView = 67,//概率小tips
    CardCQView1 = 68,//卡牌展示界面
    ShopBuy = 69,
    CardCQView2 = 70,
    TaskPopView = 71,//任务气泡
    TopHeroTips = 72,//顶部英雄tips
    TrophyView = 73,
    FightResonView=74,//成功失败原因
    GetHeroView = 75,
    MsgBoxView = 76,
    ShouChongView = 77,
    FightVsView = 78,//对决
    TeQuanKaView = 79,
    CardMsgView = 80,//弹幕
    BoxTip = 81,
    KillBossBanner = 82,//boss横幅
    KillBossLimtTimeTips = 83,//击退妖王的紧急提示
    KillBossRedTips = 84,//红色警告
    SignView = 85,
    ZhanLinView = 86,
    ZhanLinView1 = 87,
    QuickGuide = 88,//引导脚手架
    XianShiLiBaoView = 89,
    HeroHuanZhuangView = 90,
    PossessBuffTips = 91,//局内统计的buff tips
    FightMsgHisShowView = 92,//弹幕记录
    ChengHaoView = 93,
    RankRewView = 94,
    YaoQingView = 95,
    GameQuanView = 96,
    SheZhiView = 97,
    KeFuView = 98,
    NoticePop = 99,
    FaceChatView = 100,
    FightHisView = 101,
    ChatView = 102,
    GQTapTapView = 103,
    KFTapTapView = 104,
    TapTapView = 105,
    FrientFightResultView = 106,//合作作战结算
    TrophyView1 = 107,
    GiftView = 108,
    TiLiView = 109,
    GiftViewPop = 110,
    YaoQingTapView = 111,
    YaoQingTapView1 = 112,
    FuLiView = 113,
    ShengShouView = 114,
    ShengShouView1 = 115,
    ShengShouView2 = 116,
    ShengShouLBView = 117,
    PveTaskGuide = 118,
    ShengShouRankView = 119,
    ShengShouRankView1 = 120,
    ShengShouTaskView = 121,
    GuideHeroShow = 122,//英雄获取引导展示
    GuideRewardView = 123,//结算面板
    ShengShouShopView = 124,
    CardTipsGuide = 125,//新手引导卡牌预览
    MeiRiChongZhiView = 126,
    SevenActivityView = 127,
    SHZXView = 128,
    SHZXView1 = 129,
    LevelView = 130,
    TrophyNewView = 131,
    TipView = 132,
    PvpLockView = 133,
    DWTSView = 134,
    TWZView = 135,
    TWZView1 = 136,
    SpineGPU_Test = 137,
    MainActivityView = 138,
    GaiLvView = 139,
    FriendView = 140,
    FriendView1 = 141,
    PvpRoundView = 142,//PVP回合制
    FriendView2 = 143,
    FriendView4 = 144,
    PvpRoundReady = 145,//PVP回合制状态提醒栏
    PvpRoundCard = 146,//PVP回合肉鸽制卡牌
    PvproundResult = 147,//pvp回合制结算
    PvpRoundTipsView = 148,//Pvp回合制英雄tips
    PvpRoundFightView = 149,//Pvp回合制下方小边栏
    JiJinView = 150,
    PvpRoundCardPop = 151,//肉鸽选项
    PvpRoundReward = 152,//pvp回合制结算
    DianYuView = 153,
    AttrLevelView = 154,
    MsgBoxNormal = 155,
    PlayerInfoView = 156,//个人信息
    HeroSkinView = 157,
    ShengShouView3 = 158,
    RankView2 = 159,
    TaoDae = 160,//套大鹅tab主界面
    TaoDaeView = 161,//套大鹅界面
    TaoDaePackageView = 162,//套大鹅礼包
    NewYearView = 163,
    TaoDaeSelReward = 164,//套大鹅奖励选择
    NewYearView1 = 165
}

//页面类型
export enum EPageType {
    None = 0,//无特效
    CloseBigToSmall,//小变大关闭窗口
}
/**消息窗类型*/
export enum EMsgBoxType {
    OkOrCancel,
    OnlyOk,
}