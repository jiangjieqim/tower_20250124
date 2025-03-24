import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Spring_Festival_2025_Config extends BaseCfg{
    private static _ins:t_Spring_Festival_2025_Config;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Spring_Festival_2025_Config();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Spring_Festival_2025_Config";
    }

    public getValueById(id:number){
        return this.List.find(ele => ele.f_id == id).f_config;
    }
}