import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Spring_Festival_2025_Daily_Recharge_Reward extends BaseCfg{
    private static _ins:t_Spring_Festival_2025_Daily_Recharge_Reward;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Spring_Festival_2025_Daily_Recharge_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Spring_Festival_2025_Daily_Recharge_Reward";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let f_gear = this.List[i].f_gear;
            if(!this._map[f_gear]){
               this._map[f_gear] = [];
            }
            this._map[f_gear].push(this.List[i]);
        }
    }

    public getListByGear(gear:number){
        return this._map[gear];
    }
}