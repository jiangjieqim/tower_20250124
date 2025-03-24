import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Pvp_Unlock_Condition extends BaseCfg{
    private static _ins:t_Pvp_Unlock_Condition;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Pvp_Unlock_Condition();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Pvp_Unlock_Condition";
    }
}