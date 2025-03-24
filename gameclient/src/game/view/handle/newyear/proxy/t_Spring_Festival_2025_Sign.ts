import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Spring_Festival_2025_Sign extends BaseCfg{
    private static _ins:t_Spring_Festival_2025_Sign;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Spring_Festival_2025_Sign();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Spring_Festival_2025_Sign";
    }
}