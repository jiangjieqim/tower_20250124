export enum ESystemRefreshTime {
    // /**上方前几个按钮显示,可以序号小的按钮在前面 右侧最多的按钮数量 */
    RightMaxBtnCount = 9997,//5,
    // /**SDK平台不修改昵称*/
    NotModfityNickName = 9998,//103,
    // /**是否去掉折扣图标 1:去掉 0:不去掉*/
    DiscountImgVisible = 9999,

    /**合成背包开放区域 */
    ComposeOpened = 7,

    /** 合成区域宽高*/
    ComposeSize = 8,

    /**新手道具奖励 */
    GUIDE_ITEM = 15,
    /**新手宝箱id奖励 */
    GUIDE_CHEST = 16,
    /**奖杯数 */
    GUIDE_TROPHY = 17,
    /**战斗结算英雄ids */
    FIGHT_RESULT_HEROS = 18,
    /**血量掉落飘字需要的时间 */
    FIGHT_SUB_BLOOD_MS = 19,
    /**屏蔽新手引导 */
    FIGHT_GUIDE_DISABLE = 28,
    /* 隐藏范围小圈*/
    FIGHT_HIDE_CIRLE = 29,
    /**任务气泡弹出的时间 */
    TASK_POP_DELAY_MS = 33,
    /**出牌时间 */
    CARD_SHOW_TIME = 35,

    /**减速时间 */
    SLOWTIME = 38,

    /**消息驻留时间 */
    MsgWaitTime = 40,

    /**  妖王波次的提醒时间*/
    BossTipsTime = 42,
    /**不上报的事件名*/
    DisableTTEventUpLoad = 58,

    /*PVE:BUFF选择完成双方显示时长（毫秒）*/
    PveBuffTime = 69,

    /**Pve结算关闭时间秒 */
    PveCloseTime = 70,

    /**不使用Spine对象池 */
    DisableSpineCache = 77,

    /**主线引导最大的任务数量 */
    MAIN_GUIDE_MAX_TASKID = 87,
}