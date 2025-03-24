import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Fund_Config extends BaseCfg{
    private static _ins:t_Fund_Config;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Fund_Config();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Fund_Config";
    }

    public getCfgByType(type:number):Configs.t_Fund_Config_dat{
        return this.List.find(ele => ele.f_fund_type == type);
    }
}