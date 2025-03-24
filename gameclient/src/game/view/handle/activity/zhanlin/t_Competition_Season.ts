import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Competition_Season extends BaseCfg{
    private static _ins:t_Competition_Season;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Competition_Season();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Competition_Season";
    }

    constructor(){
        super();
    }

    public getCfgBySeason(season:number):Configs.t_Competition_Season_dat{
        return this.List.find(item => item.f_season == season);
    }
}