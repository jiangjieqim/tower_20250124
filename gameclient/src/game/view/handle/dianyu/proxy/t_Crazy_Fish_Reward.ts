import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Crazy_Fish_Reward extends BaseCfg{
    private static _ins:t_Crazy_Fish_Reward;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Crazy_Fish_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Crazy_Fish_Reward";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let f_type = this.List[i].f_type;
            if(!this._map[f_type]){
               this._map[f_type] = [];
            }
            this._map[f_type].push(this.List[i]);
        }
    }

    public getListByType(type:number){
        return this._map[type];
    }
}