import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Daily_Recharge extends BaseCfg{
    private static _ins:t_Daily_Recharge;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Daily_Recharge();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Daily_Recharge";
    }
}