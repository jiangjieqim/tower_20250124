import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Trophy_Rank_Reward extends BaseCfg{
    private static _ins:t_Trophy_Rank_Reward;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Trophy_Rank_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Trophy_Rank_Reward";
    }
}