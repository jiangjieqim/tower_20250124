import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Fund_Reward extends BaseCfg{
    private static _ins:t_Fund_Reward;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Fund_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Fund_Reward";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let f_fund_type = this.List[i].f_fund_type;
            if(!this._map[f_fund_type]){
               this._map[f_fund_type] = [];
            }
            this._map[f_fund_type].push(this.List[i]);
        }
    }

    public getListByType(id:number){
        return this._map[id];
    }
}