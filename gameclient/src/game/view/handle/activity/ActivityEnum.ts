export enum EActivityID {
    ShouChong = 1,
    TeQuanKa = 2,
    Sign = 3,
    ZhanLin = 4,
    XianShiLiBao = 5,
    DLHaoLi = 6,
    ZXHaoLi = 7,
    PTShengYan = 8,
    XWFenLu = 9,
    MRChongZhi = 15,
    SevenAct = 16,
    SHZX = 17,
    JIJIN = 18,
    /**套大鹅 */
    TaoDae = 19,
    DianYu = 20,
    Newyear = 21
}

//0不可领取 1可领取 2已领取
export enum EActivityStatus {
    unclaimable = 0,
    Claimable = 1,
    Claimed = 2,
}