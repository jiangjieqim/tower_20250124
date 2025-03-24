import { BaseCfg } from "../../../../static/json/data/BaseCfg";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { EFightMode } from "../vos/EFightEnum";

export class t_Wave extends BaseCfg{
    static NAME:string = "t_Wave";
    public GetTabelName(): string {
        return t_Wave.NAME;
    }

    /**总奖励 */
    getTotalWave(mode:EFightMode,wave:number){
        let arr:string[] = [];
        let l:Configs.t_Wave_dat[] = this.List;
        for(let i = 0;i < l.length;i++){
            let cfg = l[i];
            if(cfg.f_chapter == mode && cfg.f_waves <= wave){
                arr.push(cfg.f_base_currency);
            }
        }
        let s = ItemViewFactory.mergeItems(arr);
        return s;
    }

    /**本波奖励 */
    getCurWave(mode:EFightMode,wave:number){
        let l:Configs.t_Wave_dat[] = this.List;
        let cfg = l.find(o=>o.f_chapter == mode && o.f_waves == wave);
        if(cfg){
            return cfg;
        }
    }
}