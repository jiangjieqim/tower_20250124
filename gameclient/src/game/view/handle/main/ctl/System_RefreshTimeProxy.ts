import { BaseCfg } from "../../../../static/json/data/BaseCfg";

/**服务器刷新时间 */
export class System_RefreshTimeProxy extends BaseCfg{
    private static _ins: System_RefreshTimeProxy;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new System_RefreshTimeProxy();
        }
        return this._ins;
    }
    public GetTabelName() {
        return "t_System_RefreshTime";
    }

    public getVal(id: number): string {
        if (this.isLoaded) {
            let cfg: Configs.t_System_RefreshTime_dat = this.GetDataById(id);
            if (cfg) {
                return this.f_SystemConfig(cfg);
            }
        }
        return "";
    }

    // public isEnable(id:ESystemRefreshTime){
    // let val = this.getNumberVal(id);
    // return val == "1";
    // }

    // public getNumberVal(id: number) {
    //     if (this.isLoaded) {
    //         let cfg: Configs.t_System_RefreshTime_dat = this.GetDataById(id);
    //         if (cfg) {
    //             return this.f_SystemConfig(cfg);
    //         }
    //     }
    //     return 0;
    // }

    public f_SystemConfig(cfg:Configs.t_System_RefreshTime_dat){
        let v = cfg[`f_SystemConfig${this.suffix}`];
        return v;
    }
    /**显示灵宠 */
    // public get showpet(){
    // return this.getNumberVal(95) == 1;
    // }
}