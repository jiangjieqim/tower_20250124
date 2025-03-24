import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Enemy_Wave extends BaseCfg {
    static NAME:string = "t_Enemy_Wave";
    public GetTabelName(): string {
        return t_Enemy_Wave.NAME;
    }
    // private static _ins: t_Enemy_Wave;
    // public static get Ins() {
    //     if (!this._ins) {
    //         this._ins = new t_Enemy_Wave();
    //     }
    //     return this._ins;
    // }
    waves:number[] = [];
    constructor(){
        super();
        let cfgList:Configs.t_Enemy_Wave_dat[] = this.List;
        for(let i = 0;i < cfgList.length;i++){
            let cfg:Configs.t_Enemy_Wave_dat = cfgList[i];
            if(cfg.f_boss_wave){
                this.waves.push(cfg.f_waves)
            }
        }
    }
}

export class  t_Enemy_Wave_Coop extends t_Enemy_Wave{
    static NAME:string = "t_Enemy_Wave_Coop";

    public GetTabelName(): string {
        return t_Enemy_Wave_Coop.NAME;
    }
}

export interface IEnemy_WaveCfg{
    List;
    waves:number[];
}