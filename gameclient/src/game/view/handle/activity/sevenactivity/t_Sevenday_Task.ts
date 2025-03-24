import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Sevenday_Task extends BaseCfg{
    private static _ins:t_Sevenday_Task;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Sevenday_Task();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Sevenday_Task";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let f_task_day = this.List[i].f_task_day;
            if(!this._map[f_task_day]){
               this._map[f_task_day] = [];
            }
            this._map[f_task_day].push(this.List[i]);
        }
    }

    public getListById(id:number){
        return this._map[id];
    }
}