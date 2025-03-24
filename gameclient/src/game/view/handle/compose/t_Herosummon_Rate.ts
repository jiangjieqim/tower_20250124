import { BaseCfg } from "../../../static/json/data/BaseCfg";
import { EFightMode } from "./vos/EFightEnum";

export class t_Herosummon_Rate extends BaseCfg{
    public GetTabelName(): string {
        return "t_Herosummon_Rate";
    }
    private static _ins: t_Herosummon_Rate;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Herosummon_Rate();
        }
        return this._ins;
    }

    public getCfgByLv(lv:number){
        return this.List.find(o=>o.f_waves == lv);;
    }

    getCfgByWave(wave: number, mode: EFightMode): Configs.t_Herosummon_Rate_dat {
        wave = wave || 1;
        let _list = this.List;
        let reslist: Configs.t_Herosummon_Rate_dat [] = [];
        for (let i = 0; i < _list.length; i++) {
            let cfg: Configs.t_Herosummon_Rate_dat = _list[i];
            if (cfg.f_battle_type == mode) {
                reslist.push(cfg);
            }
        }
        //================================================================
        for(let i = 0;i < reslist.length;i++){
            let cfg: Configs.t_Herosummon_Rate_dat = reslist[i];
            let arr = cfg.f_minwaves.split("-");
            let min: number = parseInt(arr[0]);
            let max: number = parseInt(arr[1]);
            if (wave >= min && wave <= max) {
                return cfg;
            }
        }

        return reslist[reslist.length - 1];
    }
}