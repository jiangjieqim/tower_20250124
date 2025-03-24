import { System_RefreshTimeProxy } from "../ctl/System_RefreshTimeProxy";
export class GameCfgData {
    /**服务器每日刷新的时间3:00:00转化为(秒)*/
    public get refreshSec(): number {
        return TimeUtil.toSecond(this.getSysVal(1));
    }
    /**资源中当前存在的最大装备套数 */
    public get maxEquipStyle(): number {
        return parseInt(this.getSysVal(2));
    }
    /**最大翅膀样式 */
    public get maxWing(): number {
        return parseInt(this.getSysVal(3));
    }

    /**坐骑洗髓的最大等级 */
    public get maxRide(): number {
        return parseInt(this.getSysVal(4));
    }
    /**坐骑最大可以洗髓的等级 */
    public get mountWashMaxLv(){
        return parseInt(this.getSysVal(24));
    }

    // /**最多可以锁定的数量 */
    // public get washLockCount(){
    //     return parseInt(this.getSysVal(25));
    // }

    private get sysProxy() {
        return System_RefreshTimeProxy.Ins;
    }
    constructor() {
        // let _sysProxy: System_RefreshTimeProxy = 
        // this._sysProxy = _sysProxy;
        // this.refreshSec = 
        // this.maxEquipStyle = 
        // this.maxWing = 
        // this.maxRide = 
        // _sysProxy.dispose();
        // delete this._sysProxy;
    }

    private getSysVal(id: number): string {
        let cfg = (this.sysProxy.GetDataById(id) as Configs.t_System_RefreshTime_dat);
        return System_RefreshTimeProxy.Ins.f_SystemConfig(cfg);
        // return (this.sysProxy.GetDataById(id) as Configs.t_System_RefreshTime_dat).f_SystemConfig;
    }

}