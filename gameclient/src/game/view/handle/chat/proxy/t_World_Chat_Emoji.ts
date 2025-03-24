import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_World_Chat_Emoji extends BaseCfg{
    private static _ins:t_World_Chat_Emoji;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_World_Chat_Emoji();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_World_Chat_Emoji";
    }
}