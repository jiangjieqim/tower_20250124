import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Recharge extends BaseCfg{
    private static _ins:t_Recharge;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Recharge();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Recharge";
    }

    public getCfgById(id:number):Configs.t_Recharge_dat{
        return this.List.find(item => item.f_recharge_id == id);
    }

}