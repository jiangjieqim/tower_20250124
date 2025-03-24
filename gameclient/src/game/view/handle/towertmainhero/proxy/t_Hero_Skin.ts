import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Hero_Skin extends BaseCfg{
    private static _ins:t_Hero_Skin;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Hero_Skin();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Hero_Skin";
    }

    constructor(){
        super();
    }

    public getCfgById(id:number):Configs.t_Hero_Skin_dat{
        return this.List.find(item => item.f_skinid == id );
    }
}