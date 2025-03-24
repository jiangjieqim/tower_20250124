import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Spring_Festival_2025_Shop extends BaseCfg{
    private static _ins:t_Spring_Festival_2025_Shop;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Spring_Festival_2025_Shop();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Spring_Festival_2025_Shop";
    }
}