import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Mythical_Choice extends BaseCfg{
    private static _ins:t_Mythical_Choice;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Mythical_Choice();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Mythical_Choice";
    }
}