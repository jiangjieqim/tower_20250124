import { BaseCfg } from "../../../../static/json/data/BaseCfg";
export class t_Community extends BaseCfg{
    private static _ins:t_Community;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Community();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Community";
    }
}