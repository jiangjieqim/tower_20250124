export enum ECellType {
    /**
     * 体力
     */
    TILI = 1,

    /**
     * 水晶
     */
    SHUIJING = 2,
    /**
     * 金币
     */
    JINBI = 3,

    HERO_SP = 5,//神话英雄升级碎片

    /**局内金币 */
    FIGHT_MONEY = 6,

    /**局内幸运石 */
    FIGHT_STONE = 7,

    CARD_DC = 87,
    JSQ = 88,
    HYD = 105,
    SSJP = 109,
    XJ = 127,
    ZSBZ = 174,
    /**套圈 */
    TaoQuan = 176,
    DianYu = 177,
    NianShou = 178,
    SHOPID = 180,
    /**
     * 战斗力
     */
    BATTLE = 411111,
}

/**
 * 装备类型
 */
export enum EEquipType {
    //未开放,裸装
    None = 0,

    /**
     * 护肩
     */
    Shoulder = 1,

    /**
     * 帽子 头盔
     */
    Casque = 2,

    /**
     * 项链
     */
    Necklace = 3,

    /**
     * 护腕
     */
    Wrister = 4,

    /**
     * 衣服,铠甲
     */
    Barde = 5,

    /**
     * 手套
     */
    Gloves = 6,

    /**
     * 腰带 
     */
    Waistband = 7,

    /*
     * 裤子
     */
    Trousers = 8,

    /**
     * 武器
     */
    Weapon = 9,

    /**
     * 饰品
     */
    Ornament = 10,

    /**
     * 靴子
     */
    Shoe = 11,

    /**
     * 盾牌
     */
    Shield = 12,

    /**
     * 翅膀
     */
    Wing = 13,

    /**坐骑 */
    ZuoQi = 14,
}

/*
*基础属性类型
*/
export enum EAttrType {
    /**
     * 速度
     */
    Speed = 10002,
    /**
     * 生命
     */
    Life = 10003,
    /**
     * 攻击
     */
    Attack = 10004,
    /**
     * 防御
     */
    Defense = 10005,


    //###################################################附属性
    /*

10006	吸血	100
10007	反击	100
10008	连击	100
10009	闪避	100
10010	暴击	100
10011	击晕	100
10012	忽视吸血	0
10013	忽视反击	0
10014	忽视连击	0
10015	忽视闪避	0
10016	忽视暴击	0
10017	忽视击晕	0
10018	仁爱	100
10019	禁疗	200
10020	暴虐	300
10021	回复	200
10022	泥泞	200
10023	欺凌	200
10024	掠财	700
10025	角斗士	1

*/

    /**
     *吸血
    */
    SuckBlood = 10006,
    /**
     * 反击
     */
    AefenseAttack = 10007,
}

export interface EEquipSkin {
    type: EEquipType;
    equipStyle: number;
}

export enum ERewardType {
    /**引导类型的奖励 */
    GUIDE = 2,

    /**pvp回合制奖励 */
    GUIDE_PVP_ROUND = 3,
    
    /**套大鹅 */
    Goose = 4,

    //5秒倒计时
    // Ticket = 11,
}