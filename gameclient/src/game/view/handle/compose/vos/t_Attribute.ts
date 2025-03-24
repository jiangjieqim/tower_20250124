import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Attribute extends BaseCfg {
    public GetTabelName(): string {
        return "t_Attribute";
    }
    private static _ins: t_Attribute;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Attribute();
        }
        return this._ins;
    }
    getByAttributeId(f_attributeid: number) {
        let l: Configs.t_Attribute_dat[] = this.List;
        let cfg = l.find(o => o.f_attributeid == f_attributeid);
        if (cfg) {
            return cfg;
        }
        LogSys.Error(`${this.GetTabelName} 没有属性id:${f_attributeid}`);
        return l[0];
    }
}