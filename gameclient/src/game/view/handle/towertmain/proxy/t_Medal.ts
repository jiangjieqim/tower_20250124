import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Medal extends BaseCfg{
    private static _ins:t_Medal;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Medal();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Medal";
    }

    public getCfgByTr(trophy:number):Configs.t_Medal_dat{
        return this.List.find(ele => ele.f_min_score <= trophy && trophy <= ele.f_max_score);
    }

    public getNextCfgByTr(trophy:number):Configs.t_Medal_dat{
        let cfg = this.getCfgByTr(trophy);
        return this.GetDataById(cfg.f_id + 1);
    }
}