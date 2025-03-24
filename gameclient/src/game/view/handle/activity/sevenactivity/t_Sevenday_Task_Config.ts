import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Sevenday_Task_Config extends BaseCfg{
    private static _ins:t_Sevenday_Task_Config;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Sevenday_Task_Config();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Sevenday_Task_Config";
    }
}