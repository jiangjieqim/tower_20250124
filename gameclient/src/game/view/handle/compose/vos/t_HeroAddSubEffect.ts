import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_HeroAddSubEffect extends BaseCfg{
    public GetTabelName(): string {
        return "t_HeroAddSubEffect";
    }
    private static _ins: t_HeroAddSubEffect;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_HeroAddSubEffect();
        }
        return this._ins;
    }
    getByCardId(cardid:number){
        let l:Configs.t_HeroAddSubEffect_dat[] = this.List;
        return l.find(o=>o.f_cardid == cardid);
    }
}