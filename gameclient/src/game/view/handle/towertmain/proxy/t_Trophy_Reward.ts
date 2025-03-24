import { stCommonReward } from "../../../../network/protocols/BaseProto";
import { BaseCfg } from "../../../../static/json/data/BaseCfg";
import { TowerMainFightModel } from "../model/TowerMainFightModel";

export class t_Trophy_Reward extends BaseCfg{
    private static _ins:t_Trophy_Reward;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Trophy_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Trophy_Reward";
    }

    public getCfgByTrophy(trophy:number){
        for(let i:number=this.List.length - 1;i>=0;i--){
            if(trophy >= this.List[i].f_trophy){
                return this.List[i];
            }
        }
    }
    
    public getCfgByTrophyFront(trophy:number){
        for(let i:number=this.List.length - 1;i>=0;i--){
            let cfg:Configs.t_Trophy_Reward_dat = this.List[i];
            if(trophy >= cfg.f_trophy)
            {
                if(StringUtil.IsNullOrEmpty(cfg.f_stage)){
                    for(let n = i;n >= 0;n--){
                        let cfg1:Configs.t_Trophy_Reward_dat = this.List[n];
                        if(!StringUtil.IsNullOrEmpty(cfg1.f_stage)){
                            return cfg1;
                        }
                    }
                }
                return cfg;
            }
        }
    }

    public getBigRewardCfg():Configs.t_Trophy_Reward_dat{
        for(let i:number=0;i<this.List.length;i++){
            let cfg:Configs.t_Trophy_Reward_dat = this.List[i];
            if(cfg.f_big_prize){
                let vo: stCommonReward = TowerMainFightModel.Ins.trophyRewardList.find(ele => ele.id == cfg.f_id);
                if(!vo){
                    return cfg;
                }else{
                    if(vo.state == 1){
                        return cfg;
                    }
                }
            }
        }
        return null;
    }

}