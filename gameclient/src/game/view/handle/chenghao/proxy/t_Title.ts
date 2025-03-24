import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Title extends BaseCfg{
    private static _ins:t_Title;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Title();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Title";
    }

    public getCfgById(id:number):Configs.t_Title_dat{
        return this.List.find(ele => id == ele.f_title_id);
    }

    public getSkinById(id:number){
        return `o/title/${id}.png`;
    } 
}