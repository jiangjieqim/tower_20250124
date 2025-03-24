export enum ComposeEvent{
    /**刷新更新 */
    // ComposeRefreshUpdate = "ComposeRefreshUpdate",
    /**地图更新 */
    // ComposeMapUpdate = "ComposeMapUpdate",
    /**创建怪物 */
    // CreateMonster = "CreateMonster",
    /**怪物移动 */
    MonsterMove = "MonsterMove",
    /**攻击事件 */
    // Atk = "Atk",
    /**移除怪物 */
    MonsterRemove = "MonsterRemove",
    /**掉血 */
    // SubBlood = "SubBlood",
    /**波次更新 */
    WaveUpdate = "WaveUpdate",
    /**英雄增加*/
    HeroAdd = "HeroAdd",
    /**更新 */
    HeroUpdate = "HeroUpdate",
    /**删除英雄 */
    HeroDelByUID = "HeroDel",
    StrengthenUpdate = "StrengthenUpdate",
    /**显示隐藏按钮 */
    ShowHideBossBtn = "ShowHideBossBtn",
    /**花费消耗 */
    CostUpdate = "CostUpdate",
    /**查看英雄属性 */
    WatchHero = "WatchHero",
    /**赌博结束 */
    GambleComplete = "GambleComplete",
    /**技能条更新 */
    // SkillBar = "SkillBar",
    /**移动牌 */
    MoveCard = "MoveCard",
    /**刷新手牌 */
    UpdateCards = "UpdateCards",
    /**局内统计数据 */
    BattleStatistic = "BattleStatistic",
    /**绘制扇形 */
    PlayPie = "PlayPie",
    /**终止波次更新 */
    // WaveStop = "WaveStop"
    /**战斗新手引导波次更新 */
    FightGuideWaveUpdate = "FightGuideWaveUpdate",
    /**暂停 */
    Pause = "Pause",
    /**播放 */
    Play = "Play",
    /**更新己方英雄的数量 */
    UpdateOwnerHeroCount = "UpdateOwnerHeroCount",
    /**赌博概率更新 */
    UpdateGambleProb = "UpdateGambleProb",
    /**技能CD更新 */
    SkillCdUpdate = "SkillCdUpdate",
    /**设置播放速率 */
    // PlaybackRate = "PlaybackRate",
    /**清理局内战斗资源 */
    FightResClear = "FightResClear",
    /**角色前层常驻特效 */
    AddFrontEffect = "AddFrontEffect",
    /**删除角色前层常驻特效 */
    // DelFrontEffect = "DelFrontEffect",
    /**地图冰块区域更新 */
    IceMap = "IceMap",
    /**删除流水号上的特效 */
    DelEffectCardUid = "DelEffectCardUid",
    /**播放一次特效 */
    PlayOnceEffect = "PlayOnceEffect",
    /**功能卡特效增加 */
    CardUiEffectAdd = "CardUiEffectAdd",
    /**锁定卡牌 */
    IceCards = "IceCards",
    /**召唤按钮的概率增加 */
    GailvUp = "GailvUp",
    /**卡牌加注 */
    CardPriceDoubles = "CardPriceDoubles",
    /**怪物数量更新 */
    // MonsterCountUpdate = "MonsterCountUpdate",
    /**祈愿按钮更新 */
    SupplicationBtnUpdate = "SupplicationBtnUpdate",
    /**卡牌使用增益减益效果更新 */
    GainBtnUpdate = "GainBtnUpdate",
    /**播放偷钱特效 */
    PlayStealEffect = "PlayStealEffect",
    /**其他英雄特效播放 */
    UpdateSurplusHeros = "UpdateSurplusHeros",
    /**创建表情 */
    CreateFace = "CreateFace",
    
    /**局外战报列表 */
    FightReport = "FightReport",

    /**添加手牌 */
    AddCard  = "AddCard",

    /**怪物数量更新 */
    MonsterNum = "MonsterNum",

    /**次数刷新 */
    SommonTimes = "SommonTimes",
    /**pvp引导完成 */
    NewPvpGuideComplete = "NewPvpGuideComplete",
    /**房间信息更新 */
    RoomInfoUpdate = "RoomInfoUpdate",

    /**Pvp战斗结算退出 */
    PvpFightResultExit = "PvpFightResultExit",

    /**进入主场景 */
    EnterMainScene = "EnterMainScene",

    /**隐藏pvp回合战的tips */
    HidePvpRoundTips = "HidePvpRoundTips",

    /**pvp回合制状态变化 */
    PvpRoundStatusChange = "PvpRoundStatusChange",

    /**血量更新 */
    PvpRoundHpUpdate = "PvpRoundHpUpdate",
    
    /**Buff List更新 */
    PvpTurnBasedBuffList = "PvpTurnBasedBuffList",

    /**肉鸽打开 */
    RougeOpen = "RougeOpen",

    /**肉鸽选择 */
    RougeSelect = "RougeSelect",

    /**PVP回合制波次结算 */
    PvproundResult = "PvproundResult",

    /**设置波次 */
    Wave = "Wave",

    /**战斗界面初始化到舞台 */
    FightViewOnShow = "FightViewOnShow",

    /**波次奖励 */
    WaveSettleReward = "WaveSettleReward",
    /**怪物数量更新 */
    PvpTurnBasedMonsterNum = "PvpTurnBasedMonsterNum",

    /**播放一次动作*/
    MonsterPlayOnceAnim = "PlayOnceAnim"
}