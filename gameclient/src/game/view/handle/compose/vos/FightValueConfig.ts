export class FightValueConfig{
    /**序列帧动画缩放 */
    static readonly frameScale:number = 1.0;

    /**减血飘字的偏移 */
    static readonly SubBloodY:number = -100;

    /**血条偏移 */
    static readonly OffsetBloodY:number = -70;
    /**Boss血条偏移 */
    static readonly OffsetBossBloodY:number = -100;
    /**倒计时偏移 */
    static readonly OffsetCutDownY:number = -140;
    //血字Y偏移
    static readonly OffsetBloodTxtY:number = -120;

    /**合成需要英雄的数量 */
    static readonly ComposeHeroCount:number = 3;

    /**行走同步更新协议间隔的时间 */
    static readonly TIME_SPNE_MS:number = 1000;

    /**单个格子的分割数量 */
    static readonly DEV_COUNT:number = 100;

    /**子弹飞行时间 */
    static readonly FLY_TIME:number = 200;

    /**移动单位区块距离需要的时间毫秒 */
    // static readonly MOVE_TIME:number = 100;

    /**拖拽移动一个单元格子需要的时长 */
    static readonly MOVE_GRID_TIME:number = 100;//100

    /*光圈的特效 */
    // static readonly HALO_SKEL:string = `o/spine/halo/halo1/halo1.skel`;
    // static readonly HALO_SKEL_SCALE:number = 0.3;

    /**品质 */
    static readonly MAX_QUA:number = 5;

    /**是否开启老的拖拽 */
    static readonly EnableDrag:boolean = false;

    /**子弹id */
    // static readonly shootId:number = 48;

    static readonly cardOffsetX:number = 0;//184;
    static readonly cardOffsetY:number = 0;//89;
    static readonly cardCellWidth:number = 140;//卡牌间隔
    static readonly cardMoveTime:number  = 500;

    /**战斗容器坐标 */
    static readonly fightViewX:number = 14;
    static fightViewY:number = 595;

    static readonly tabViewOffsetY:number = -70;

    /**功能卡2的高度 */
    static readonly FuncCardView2Height:number  = 352;

    static readonly cardFlyTime:number = 200;
    /**顶部小按钮Y偏移 */
    static readonly TopOffsetY:number = 162;

    /**怪物数量进度条总长度 */
    // static readonly BloodProgressWidth:number = 201;

    //=====================================================
    /**怪物血条宽 */
    // static readonly MonsterBloodWidth:number = 54;
    /**怪物血条高 */
    // static readonly MonsterBloodHeight:number = 6;
    static readonly MonsterBloodScale:number = 1.5;


    /**卡牌飞出的时间 */
    static cardShowTime:number = 100;
    static readonly CardPlay:string = `o/spine/scene/Card_play/Card_play`;

    //66;//1000/15=66.6666                 1000/(60/4)=66.66666666666667毫秒一次
    //83.3//1000/12
    //55.5555  //1000/18
    // private readonly delayMS:number = 66;
    
    /**一个帧需要的毫秒数 40 ---> 25 fps (1000/40)*/
    static readonly delayMS:number = 30;//40;//40;//66;

    /**测试用 */
    static debugDelayMS:number;

    /**播放速率 */
    static speedScale:number = 1;
    /**红点尺寸 */
    static readonly redNumSize:number = 37;

    /**怪物在地图上的y轴向下偏移 */
    static readonly MonsterOffsetY:number = 20;

    /**最大加速度 */
    static readonly MaxFastRate:number = 3;

    static readonly WaveSec:number = 60;
    /**弹幕隐藏的时间偏移 */
    static readonly MsgHideTimeOffsetMs:number = 500;

    /**客户端的最多的章节数 */
    static readonly MAX_CHAPTER:number = 3;

}
export enum EMonsterPos{
    Owner = 0,
    OtherPlayer = 1,
}

export enum EFightMatch{
    /*0匹配失败或超时 */
    Fail = 0,
    /**1匹配成功 */
    Succeed = 1
}
/**移动结构体 */
export class TowerMoveVo{
    /**像素坐标x */
    tx:number;
    /**像素坐标y */
    ty:number;
    /**移动到目的地需要的时间 */
    time:number;
}

export enum ESkillCd{
    /**技能可以使用 */
    Enable = 0,
    /**技能不可使用 */
    Disable = 1
}

export class SkillCdVo{
    status:ESkillCd;
    uid:number;
}