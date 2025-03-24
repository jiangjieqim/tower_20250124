import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Battle_Statistics_TypeProxy extends BaseCfg{
    public GetTabelName(): string {
        // return "t_Battle_Statistics";
        return "t_Battle_Statistics_Type";
    }
    private static _ins: t_Battle_Statistics_TypeProxy;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Battle_Statistics_TypeProxy();
        }
        return this._ins;
    }
}

export class t_Battle_StatisticsProxy extends BaseCfg{
    public GetTabelName(): string {
        // return "t_Battle_Statistics_Type";
        return "t_Battle_Statistics";
    }
    private static _ins: t_Battle_StatisticsProxy;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Battle_StatisticsProxy();
        }
        return this._ins;
    }

    getByType(type:number):Configs.t_Battle_Statistics_dat{
        let l:Configs.t_Battle_Statistics_dat[] = this.List;
        let o = l.find(o=>o.f_type == type);
        return o;
    }
}