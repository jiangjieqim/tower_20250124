import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Battle_Pass extends BaseCfg{
    private static _ins:t_Battle_Pass;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Battle_Pass();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Battle_Pass";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let season = this.List[i].f_season;
            if(!this._map[season]){
               this._map[season] = [];
            }
            this._map[season].push(this.List[i]);
        }
    }

    public getCfgById(id:number){
        return this.List.find(item => item.f_id == id);
    }

    public getCfgBySeason(season:number,lv:number){
        let arr = this._map[season];
        return arr.find(item => item.f_level == lv);
    }

    public getListBySeason(season:number){
        return this._map[season];
    }

    public getMaxBySeason(season:number){
        let arr = this._map[season];
        return arr[arr.length - 1].f_level;
    }
}