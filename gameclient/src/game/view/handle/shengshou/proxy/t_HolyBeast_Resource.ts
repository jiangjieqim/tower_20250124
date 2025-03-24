import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_HolyBeast_Resource extends BaseCfg{
    private static _ins:t_HolyBeast_Resource;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_HolyBeast_Resource();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_HolyBeast_Resource";
    }

    public getCfgById(id:number):Configs.t_HolyBeast_Resource_dat{
        return this.List.find(ele => ele.f_activity_id == id);
    }
}