import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Lottery_Reward_Rate extends BaseCfg{
    private static _ins:t_Lottery_Reward_Rate;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Lottery_Reward_Rate();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Lottery_Reward_Rate";
    }
}