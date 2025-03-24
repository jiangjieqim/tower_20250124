import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Treasure_Upgrade extends BaseCfg{
    private static _ins:t_Treasure_Upgrade;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Treasure_Upgrade();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Treasure_Upgrade";
    }

    constructor(){
        super();
    }

    public getCfgByIdAndLv(id:number,lv:number):Configs.t_Treasure_Upgrade_dat{
        return this.List.find(item => item.f_treasureid == id && item.f_treasure_level == lv);
    }

    public getNextCfgByIdAndLv(id:number,lv:number):Configs.t_Treasure_Upgrade_dat{
        return this.List.find(item => item.f_treasureid == id && item.f_treasure_level == (lv + 1));
    }
}