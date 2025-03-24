import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Daily_Task_Reward extends BaseCfg{
    private static _ins:t_Daily_Task_Reward;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Daily_Task_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Daily_Task_Reward";
    }
}