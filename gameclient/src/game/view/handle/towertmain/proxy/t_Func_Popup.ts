import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Func_Popup extends BaseCfg{
    private static _ins:t_Func_Popup;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Func_Popup();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Func_Popup";
    }

    public getCfgByViewId(id:number){
        return this.List.find(ele => ele.f_viewtype == id);
    }
}