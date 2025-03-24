import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Douyin extends BaseCfg{
    public GetTabelName(): string {
        return "t_Douyin";
    }

    private static _ins: t_Douyin;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Douyin();
        }
        return this._ins;
    }

    getValStr(id:number):string{
        // let cfg:Configs.t_Douyin_dat = this.GetDataById(id);
        // return cfg.f_val;
        return id + "";
    }
}