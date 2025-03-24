import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Shop_Hotsell extends BaseCfg{
    private static _ins:t_Shop_Hotsell;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Shop_Hotsell();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Shop_Hotsell";
    }

    public getCfgById(id:number):Configs.t_Shop_Hotsell_dat{
        return this.List.find(item => item.f_id == id);
    }

}