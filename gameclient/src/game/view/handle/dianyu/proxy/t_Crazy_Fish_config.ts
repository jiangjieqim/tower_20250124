import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Crazy_Fish_config extends BaseCfg{
    private static _ins:t_Crazy_Fish_config;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Crazy_Fish_config();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Crazy_Fish_config";
    }
}