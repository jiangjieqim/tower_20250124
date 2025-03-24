import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Arena extends BaseCfg{
    private static _ins:t_Arena;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Arena();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Arena";
    }

    public getCfgByTrophy(trophy:number):Configs.t_Arena_dat{
        return this.List.find(ele => trophy >= ele.f_trophy_min && trophy <= ele.f_trophy_max);
    }

    public getCfgById(id:number):Configs.t_Arena_dat{
        return this.List.find(ele => id == ele.f_arenaid);
    }
}