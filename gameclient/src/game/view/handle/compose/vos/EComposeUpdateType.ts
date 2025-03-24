export enum EComposeUpdateType{
    //0刷新 1合成 2移动 3售卖 4功能卡 5赌博 6变身 7分身 8分身过期（移除英雄）
    
    /*刷新 */
    Summon = 0,
    /**合成 */
    Compose = 1,
    /**移动 */
    Move = 2,
    /**功能卡 */
    FuncCard = 4,
    /**祈愿赌博 */
    Supplicatior = 5,
    /**分身 */
    DoubleBody = 7,

    /**英雄所在的格子显示一个冰块 */
    CreateIceGrid = 11,
    /**英雄所在的格子删除一个冰块 */
    DelIceGrid = 13,
}