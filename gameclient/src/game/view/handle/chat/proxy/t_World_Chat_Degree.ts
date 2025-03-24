import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_World_Chat_Degree extends BaseCfg{
    private static _ins:t_World_Chat_Degree;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_World_Chat_Degree();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_World_Chat_Degree";
    }

    public getCfg(value:number){
        return this.List.find(ele => ele.f_low_score <= value && ele.f_top_score >= value);
    }
}