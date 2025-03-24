import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class t_Activity extends BaseCfg{
    private static _ins:t_Activity;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Activity();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Activity";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let f_group = this.List[i].f_group;
            if(!this._map[f_group]){
               this._map[f_group] = [];
            }
            this._map[f_group].push(this.List[i]);
        }
    }

    public getListByGroup(group:number){
        return this._map[group];
    }
}