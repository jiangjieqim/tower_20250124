import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Invite_Reward_Daily extends BaseCfg{
    private static _ins:t_Invite_Reward_Daily;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Invite_Reward_Daily();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Invite_Reward_Daily";
    }
}