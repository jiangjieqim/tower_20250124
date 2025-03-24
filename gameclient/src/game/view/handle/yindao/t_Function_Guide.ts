import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class t_Function_Guide extends BaseCfg{
    private static _ins:t_Function_Guide;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Function_Guide();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Function_Guide";
    }

    constructor(){
        super();
    }

    public getCfgById(groupid:number,orderid:number):Configs.t_Function_Guide_dat{
        return this.List.find(item => item.f_groupid == groupid && item.f_orderid == orderid);
    }
}