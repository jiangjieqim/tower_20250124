export class ComposeConfig{
    /**分割比 */
    static readonly Div:number = 3;
    /**当个区块格子的宽度 */
    static readonly cellW:number = 90;
    /**当个区块格子的高度 */
    static readonly cellH:number = 80;
    static mapW:number;//横向格子数
    static mapH:number;//纵向格子数
    /**战斗地图区块宽度 */
    static readonly MapCellW:number = 30;
    /**战斗地图区块高度 */
    static readonly MapCellH:number = ComposeConfig.cellH/ComposeConfig.Div;
    /**小格子对象池 */
    static readonly ComposeDragItemItemSkin:string = "ComposeDragItem";

    static readonly EmptyPoolName:string = "EmptyPoolName";

    /**选择区域的Y坐标 */
    static readonly mapSelStartY:number = 100;
}

export enum EGridType{
    /**空格子类型的组件 */
    GridComponent = 0
}

export enum EGridMergeClientType{
    /**普通操作的动物格子 */
    NormalGrid = 0,
    /**合并格子操作的的大区块格子,这是一整块格子*/
    MergeGrid = 1,
}

//刷新类型
export enum EComposeRefreshType{
    /**
     * 1每回合系统刷新
     */
    Sys = 1,
    /**
     * 2银币刷新
     */
    Money = 2,
    /**
     * 3广告刷新
     */
    Advert= 3
}


/*1放置，2升级，3解锁地图格子*/
export enum EComposeOpt{
    /**1放置 */
    PutDown = 1,
    /**2升级 */
    LvUp = 2,
    /**3解锁地图格子 */
    Unlock = 3,
}

export enum EComposeMoveOpt{
    Compose = 0,
    /**水果往下拉的时候传 1*/
    Move = 1,
}