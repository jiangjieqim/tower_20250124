import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class QualitycolorProxy extends BaseCfg{

    public GetTabelName() {
        return "t_Qualitycolor"
    }
    private static _ins: QualitycolorProxy;

    public static get Ins() {
        if (!this._ins) {
            this._ins = new QualitycolorProxy();
        }
        return this._ins;
    }

    public getCfgByQua(qua:number):Configs.t_Qualitycolor_dat{
        return this.List.find(o=>o.f_qua == qua);
    }
}