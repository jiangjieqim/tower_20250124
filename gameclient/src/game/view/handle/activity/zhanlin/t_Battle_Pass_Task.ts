import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Battle_Pass_Task extends BaseCfg{
    private static _ins:t_Battle_Pass_Task;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Battle_Pass_Task();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Battle_Pass_Task";
    }

    constructor(){
        super();
    }

    public getCfgById(id:number){
        return this.List.find(item => item.f_id == id);
    }
}