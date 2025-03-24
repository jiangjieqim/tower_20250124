import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_HolyBeast_Draw_Rate extends BaseCfg{
    private static _ins:t_HolyBeast_Draw_Rate;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_HolyBeast_Draw_Rate();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_HolyBeast_Draw_Rate";
    }
}