import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_God_Road extends BaseCfg{
    private static _ins:t_God_Road;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_God_Road();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_God_Road";
    }

    public getCfgBySean(sean:number):Configs.t_God_Road_dat{
        return this.List.find(ele => ele.f_season == sean);
    }
}