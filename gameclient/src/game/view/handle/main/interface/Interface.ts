
export interface IMainUpdate {
    UpdateGold();
    UpdateExp();
    UpdateBattle();
    UpdateMoney();
    UpdateEquip();
    UpdateBoxCnt();
    UpdateBoxLv();
    UpdateMainAttr();
    isPlaying:boolean;
    gear:boolean;//设置齿轮动画
    UpdateSmallIcon();
    playLevelUp();
    /**设置箱子升级的红点 */
    lvdot:boolean;
}
export interface IHelpViewData
{
    title:string;
    desc:string;
}

// export interface IChestLv{
//     cur:Configs.t_BoxCD_dat;
//     next:Configs.t_BoxCD_dat;

//     curInfo:Configs.t_BoxGacha_dat;
//     nextInfo:Configs.t_BoxGacha_dat;
// }

export enum EChestLevelUp
{
    UseMoney = 1,//使用铜钱中
    Full = 2,//阶段满
    Time = 3,//记时中
    End = 4,//满级了
}
// export interface IChestPosResult{
//     /**下次需要升级使用的CD时间 */
//     cdTime:number;
//     /**
//      * 当前使用的升级配置
//      */
//     cfg:Configs.t_BoxCD_dat;
    
//     /**
//      * 当前进度
//      */
//     cur:number;
//     /**
//      * 当前最大进度
//      */
//     max:number;
    
//     /**宝箱升级状态 */
//     status:EChestLevelUp;
// }

export interface ISmallTips{
    /**
     * 内容
     */
    content:string;
    /**
     * 标题
     */
    title:string;
    /**
     * 目标
     */
    target:Laya.Sprite;

    algin:string;

    /**参数 */
    param:any;
}