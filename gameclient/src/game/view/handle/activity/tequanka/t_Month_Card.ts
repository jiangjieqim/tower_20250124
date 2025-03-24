import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Month_Card extends BaseCfg{
    private static _ins:t_Month_Card;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Month_Card();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Month_Card";
    }
}