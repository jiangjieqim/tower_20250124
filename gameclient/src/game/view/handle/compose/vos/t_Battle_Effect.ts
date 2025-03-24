import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Battle_Effect extends BaseCfg {
    public GetTabelName(): string {
        return "t_Battle_Effect";
    }
    private static _ins: t_Battle_Effect;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Battle_Effect();
        }
        return this._ins;
    }

    getByEffectId(id:number){
        let l:Configs.t_Battle_Effect_dat[] = this.List;
        return l.find(o=>o.f_effect_id == id);
    }
}

export enum EBattleEffectConfig{
    /**冰块特效配置ID */
    ICE = 8,
}

export enum EClientEffectUID {
    /**  冰块流水号 */
    ICE_UID = -1
}