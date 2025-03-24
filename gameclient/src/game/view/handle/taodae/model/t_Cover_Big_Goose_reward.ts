import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Cover_Big_Goose_reward extends BaseCfg{
    static NAME:string = "t_Cover_Big_Goose_reward";
    private _selfList:Configs.t_Cover_Big_Goose_reward_dat[];
    public GetTabelName(): string {
        // throw new Error("Method not implemented.");
        return t_Cover_Big_Goose_reward.NAME;
    }

    getSelfList():Configs.t_Cover_Big_Goose_reward_dat[]{
        if(this._selfList){
            return this._selfList;
        }
        let l:Configs.t_Cover_Big_Goose_reward_dat[] = [];
        let list:Configs.t_Cover_Big_Goose_reward_dat[] = this.List;
        for(let i = 0;i < list.length;i++){
            let cfg = list[i];
            if(cfg.f_big_prize){
                l.push(cfg);
            }
        }
        this._selfList = l;
        return l;
    }
}