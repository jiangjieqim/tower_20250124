import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Function_Sound extends BaseCfg {

    public GetTabelName() {
        return "t_Function_Sound"
    }
    
    private static _ins: t_Function_Sound;

    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Function_Sound();
        }
        return this._ins;
    }

    constructor(){
        super();
    }

    public getCfgById(id: number): Configs.t_Function_Sound_dat {
        return this.List.find(ele => ele.f_ui_component === id);
    }
}