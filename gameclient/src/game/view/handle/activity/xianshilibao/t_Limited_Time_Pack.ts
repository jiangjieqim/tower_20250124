import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Limited_Time_Pack extends BaseCfg{
    private static _ins:t_Limited_Time_Pack;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Limited_Time_Pack();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Limited_Time_Pack";
    }
}