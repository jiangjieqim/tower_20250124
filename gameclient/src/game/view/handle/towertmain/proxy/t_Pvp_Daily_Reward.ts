import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Pvp_Daily_Reward extends BaseCfg{
    private static _ins:t_Pvp_Daily_Reward;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Pvp_Daily_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Pvp_Daily_Reward";
    }

    public getCfgById(id:number):Configs.t_Pvp_Daily_Reward_dat{
        return this.List.find(ele => ele.f_item_id == id);
    }
}