import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Achieve_Task extends BaseCfg{
    private static _ins:t_Achieve_Task;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Achieve_Task();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Achieve_Task";
    }
}