import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Cover_Big_Goose_config extends BaseCfg{
    static NAME:string = "t_Cover_Big_Goose_config";
    public GetTabelName(): string {
        return t_Cover_Big_Goose_config.NAME;
    }
    getByPos(pos:number){
        let l:Configs.t_Cover_Big_Goose_config_dat[] = this.List;
        let cfg = l.find(o=>o.f_pos == pos);
        return cfg;
    }
}