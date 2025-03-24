import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Tips extends BaseCfg{
    private static _ins:t_Tips;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Tips();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Tips";
    }
}