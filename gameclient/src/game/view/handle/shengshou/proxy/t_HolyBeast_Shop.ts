import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_HolyBeast_Shop extends BaseCfg{
    private static _ins:t_HolyBeast_Shop;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_HolyBeast_Shop();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_HolyBeast_Shop";
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

    public getListByIdAt(id:number,type:number){
        let array = [];
        let arr = this._map[id];
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_shop_type == type){
                array.push(arr[i]);
            }
        }
        return array;
    }
}