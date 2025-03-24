import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Treasure_Extract_Rate extends BaseCfg{
    private static _ins:t_Treasure_Extract_Rate;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Treasure_Extract_Rate();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Treasure_Extract_Rate";
    }

}