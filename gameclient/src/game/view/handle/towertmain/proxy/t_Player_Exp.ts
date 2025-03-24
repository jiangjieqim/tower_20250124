import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Player_Exp extends BaseCfg{
    private static _ins:t_Player_Exp;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Player_Exp();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Player_Exp";
    }

    public getCfgByLv(lv:number):Configs.t_Player_Exp_dat{
        return this.List.find(ele => ele.f_lv == lv);
    }
}