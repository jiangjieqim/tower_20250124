import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class t_Hero_Synthesis_Weight extends BaseCfg {
    public GetTabelName(): string {
        return "t_Hero_Synthesis_Weight";
    }
    private static _ins: t_Hero_Synthesis_Weight;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Hero_Synthesis_Weight();
        }
        return this._ins;
    }
    /**获取权重 */
    getWeight(qua:number){
        let l:Configs.t_Hero_Synthesis_Weight_dat[] = this.List;
        let cfg = l.find(o=>o.f_heroid == qua);
        return parseInt(cfg.f_hero);
    }
}