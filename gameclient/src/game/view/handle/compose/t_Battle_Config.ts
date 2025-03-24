import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class t_Battle_Config extends BaseCfg{
    public GetTabelName(): string {
        return "t_Battle_Config";
    }
    private static _ins: t_Battle_Config;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Battle_Config();
        }
        return this._ins;
    }

    public getValueById(id:number){
        let cfg = this.GetDataById(id);
        if(cfg){
            return cfg.f_battleconfig;
        }
        return "";
    }
}

export enum EBattle_Config {
    /**白色品质英雄出售价格，对应当前招募价格的万分比，向下取整 */
    BLUE_WHITE_SELL = 4,
    /**  5	7-1	蓝色品质英雄出售价格*/
    BLUE_HERO_SELL = 5,
    /**  6	7-2	紫色品质英雄出售价格*/
    PURPLE_HERO_SELL = 6,
    /**  7	7-5	橙色品质英雄出售价格*/
    ORANGE_SELL = 7,
    /**最高怪物数量 */
    MAX_MONSTER_COUNT = 15,
    
    STRNG_PRICE = 16,
    STRNG_COST = 17,
    STRNG_MAX_LIMT = 18,

    /**场上英雄基础上限数量 */
    MAX_HERO_COUNT = 25,
    /**限时boss击杀最大时长（秒） */
    KILLBOSS_MAX_TIME = 28,
    /**战斗开始前xx秒无法使用功能卡 */
    FuncCardSec = 30,

    /**召唤价格 */
    SommonMoneyOnce = 36,
    SommonMoney = 35,
    FirstKillBoss = 38,
    /**每10关的波次boss击杀时间（秒） */
    TenBossSec = 39,
    /**波次的tips的时间(毫秒) */
    WaveTipsMs = 40,

    PVP_MAX_TIPS = 41,
    /**祈愿成功英雄出现的延迟时间（毫秒） */
    SupplicationDelay = 43,
    /**局内聊天时间 */
    ChatLimitTime = 44,

    /**合作模式预警的时候最大怪物数 */
    FRIEND_MAX_TIPS = 46,

    /**每局游戏扣除体力值physical power */
    PVE_PHYSICAL_POWER = 47,
    /**PVE：手牌上限 */
    PVE_MAX_CARD = 48,
    /**pve快速击杀奖励 */
    PVE_FAST_REWARD = 50,
}
/**英雄品质 */
export enum EHeroQua{
    /**白的 */
    White = 1,
    /**蓝色 */
    Blue = 2,
    /**紫色 */
    Purple = 3,
    /**传说 */
    Orange = 4,
    /**神话品质 */
    Red = 5
}

export enum EMonsterType{
    /**1:小怪 */
    Monster = 1,
    /**2：关卡boss */
    Boss = 2,
    /**3：限时boss */
    LimitTimeBoss = 3,
}

