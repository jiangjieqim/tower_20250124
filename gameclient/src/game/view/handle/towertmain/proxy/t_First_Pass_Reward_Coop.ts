import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_First_Pass_Reward_Coop extends BaseCfg{
    private static _ins:t_First_Pass_Reward_Coop;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_First_Pass_Reward_Coop();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_First_Pass_Reward_Coop";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let f_difficulty = this.List[i].f_difficulty;
            if(!this._map[f_difficulty]){
               this._map[f_difficulty] = [];
            }
            this._map[f_difficulty].push(this.List[i]);
        }
    }

    public getListById(id:number){
        return this._map[id];
    }
}