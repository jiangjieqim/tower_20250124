
/**剧情管理器*/
export class PlotMgr {
    //#region 静态变量

    //public=============================

    public static get Ins() {
        if (!this._ins) this._ins = new PlotMgr();
        return this._ins;
    }
    //protected==========================
    private static _ins: PlotMgr;

    //private============================

    //#endregion

    //#region 实例变量

    //public=============================

    //protected==========================

    //private============================

    //#endregion


    //#region 静态方法

    //public=============================

    //protected==========================

    //private============================

    //#endregion

    //#region 实例方法

    constructor() {
    }
    //public=============================

    //protected==========================

    //private============================

    //#endregion

}