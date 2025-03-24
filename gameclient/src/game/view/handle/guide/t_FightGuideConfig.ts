import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class t_FightGuideConfig extends BaseCfg{
    public GetTabelName(): string {
        return "t_FightGuideConfig"
    }
    private static _ins: t_FightGuideConfig;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_FightGuideConfig();
        }
        return this._ins;
    }
    public getValueById(id:number):string{
        let cfg = this.GetDataById(id);
        return cfg.f_val;
    }
}

export enum EFightGuide{
    /**功能卡 */
    // FuncCards = 1,
    /**己方初始化的钱 */
    SelfMoney = 2,

    /**敌方初始化的钱 */
    EnemyMoney = 3,

    /**召唤花费 */
    // SommonMoney = 4,

    /**己方召唤英雄的卡池 */
    HeroCards = 5,

    /**出怪间隔 */
    // BirthMonsterMS = 6,

    /**怪物波次数据 */
    Wave = 7,

    /**根据品质计算的英雄伤害 */
    // HurtQua = 9,

    /**基础系数 */
    // BaseHurtVal = 10,

    /**合成结果 */
    HeroUpgrade = 13,
    /**祈愿池子配置 */
    Gamble = 14,

    /**敌方英雄 */
    EnemyHeros = 15,

    /**终止时间配置 */
    // WaveStop = 16,

    /**神话英雄配置 */
    MythosHero = 17,

    /**神话召唤 */
    SummonHeroResult = 18,

    /**敌方积分 */
    EnemyTrophy = 19,

    /**前置占位牌id */
    PreEmptyCardId = 20,

    /**英雄伤害 */
    HerosHurtAi = 21,

    /**分身英雄配置 */
    CloneHero = 22,
}

// export enum ECardId{
    
    /**偷钱 */
    // StealMoney= 1001,
    /**火烧 */
    // Fire = 1002,
    /**同归于尽 */
    // KillAll = 1003,
    
    /**锁定卡牌取消 */
    // ICE_CARDS = 36,
    /**为对方召唤1个稀有英雄，并冻结这个英雄60秒 */
    // ICE_HEROS = 38,
    /**冰块整个区域 */
    // ICE_MAP = 40
// }

/**卡牌模板id */
export enum ETemplateCardId {
    /**
     * 下次召唤/祈愿成功额外获得1个相同的英雄
     */
    // SommonHero = 1,

    /**无效卡牌效果 */
    DiscardCard =  6 ,

    /** 卡牌翻倍*/
    DoublePriceCard = 7,
    /**窃取 */
    StealMoney = 9,

    /**集钱得钱 */
    GetMoney=12,

    /**获取敌方英雄 */
    GetEnemyHero = 13,

    /**锁定卡牌取消 */
    ICE_CARDS = 25,

    /**为对方召唤1个稀有英雄，并冻结这个英雄60秒 */
    ICE_HEROS = 26,

    /**冰块整个区域 */
    ICE_MAP = 28,

    /**降低对手/提高自己所有英雄的伤害10%，持续15秒 */
    Modify_Hero_Attr = 29,
    
    /**随机破坏我方1-3个英雄，所有英雄的伤害+破坏个数*10% */
    BreakMyHero = 30,
    /*
        丢失手上所有卡牌或者消灭已有的所有英雄和货币，消灭我方的BOSS
    */
    KillBoss = 33,
    /*
        随机消灭对手1个英雄
        献祭我方1个普通英雄，破坏对方1个稀有英雄
    */
    FireHero = 34,

    /**随机消灭对手1个橙色或橙色以下的英雄，并为自己召唤1个与消灭英雄相同品质的英雄，如果没有则不生效 */
    RandomKill = 35,

    /**交换我方的1个普通英雄和对方的1个稀有英雄 */
    SwitchMyHero = 55,
    /**冰块整个区域 */
    ICE_MAP_PVP_ROUND = 72,
}

export enum EFuncCardSpecialEffect {
    DisableCard = 0
}

export enum EFunccardEffectId{
    /**偷钱特效 */
    StealMoney = 25,

    /**集钱得钱 */
    MoneyShow = 26,
}

// export enum HeroId{
//     /**孙悟空 */
//     SunWuKong = 23,
// }

// export interface ITaskGuideCfg {
//     /*id*/
//     f_id: number;
//     /*任务id*/
//     f_TaskID: number;
//     /*引导位置*/
//     f_GuidePosition: string;
//     /*隐藏掉相关的image*/
//     f_hide_img: string;
//     /*显示相关的image*/
//     f_show_img: string;
//     /*功能开启目标image*/
//     f_func_img: string;
//     /*战斗引导中的功能卡*/
//     f_fight_cardId: string;
//     /*拖拽的地图区块位置*/
//     f_grid: string;
//     /*提示按钮XY偏移*/
//     f_XY: string;
//     /*小界面Y轴位置*/
//     f_sviewY: number;
//     /*是否显示小界面1点击区域无效 2 点击任意区域下一个引导*/
//     f_showsmallview: number;
//     /*是否是界面*/
//     f_isview: number;
//     /*描述*/
//     f_info: string;
//     /*语音*/
//     f_audio: string;
//     /*tip所在的位置:上(1)下(0)右偏移(2)*/
//     f_dir: number;
//     /*tips箭头偏移*/
//     f_arrow_offsetXY: string;
//     /*hand偏移*/
//     f_hand_offsetXY: string;
//     /*小手动画*/
//     f_anim: string;
//     /*是否遮挡强制*/
//     f_mask: number;
//     /*小箭头偏移*/
//     f_little_offsetX: number;
// }