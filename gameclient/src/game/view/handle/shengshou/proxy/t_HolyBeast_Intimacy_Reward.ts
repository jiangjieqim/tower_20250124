import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_HolyBeast_Intimacy_Reward extends BaseCfg{
    private static _ins:t_HolyBeast_Intimacy_Reward;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_HolyBeast_Intimacy_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_HolyBeast_Intimacy_Reward";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let f_activity_id = this.List[i].f_activity_id;
            if(!this._map[f_activity_id]){
               this._map[f_activity_id] = [];
            }
            this._map[f_activity_id].push(this.List[i]);
        }
    }

    public getListById(id:number){
        return this._map[id];
    }
}