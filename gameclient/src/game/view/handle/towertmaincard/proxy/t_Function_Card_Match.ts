import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Function_Card_Match extends BaseCfg{
    private static _ins:t_Function_Card_Match;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Function_Card_Match();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Function_Card_Match";
    }

    public getCfgById(id:number):Configs.t_Function_Card_Match_dat{
        return this.List.find(ele => ele.f_packageid == id);
    }

    public getIcon(id:number){
        return `static/icon_kb_${id}.png`;
    }

    public getIcon1(id:number){
        return `static/icon_kb_${id}${id}.png`;
    }
}