export enum EQuickMsg{
    NULL = 0,
    /**竞技场购买 */
    JJC= 1,
    /**武馆任务刷新 */
    HeroHouseTask= 2,
    /**跑商购买通行证 */
    PaoShangBuy= 3,
    /**跑商删除标记 */
    PaoShangDel= 4,
    /**福源转化 */
    FuYuanZH= 5,
    /**宝石重铸 */
    BaoShiCZ= 6,
    /**宝石变质 */
    BaoShiBZ= 7,
    /**法阵更换 */
    FaZhengGH= 8,
    /**神兵升级 */
    ShenBinLv= 9,
    /**星星争夺战刷新对手 */
    XXZDZ = 10,
    /**神魂已达上限 */
    ShenHun1 = 11,
    /**神魂已满 */
    ShenHun2 = 12,
    /**核心神魂已达上限 */
    ShenHun3 = 13,
    /**核心神魂已满 */
    ShenHun4 = 14,
    /**青铜币已满 */
    ShenHun5 = 15
}

export class  QuickMsgVo {
    public type:EQuickMsg;
    public selected:boolean;
}