import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Shop extends BaseCfg{
    private static _ins:t_Shop;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Shop();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Shop";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let page = this.List[i].f_Page;
            if(!this._map[page]){
               this._map[page] = [];
            }
            this._map[page].push(this.List[i]);
        }
    }

    public getListByPage(page:number):Configs.t_Shop_dat[]{
        let arr = this._map[page];
        arr.sort(this.onSort);
        return arr;
    }

    //从小到大
    private onSort(a:Configs.t_Shop_dat,b:Configs.t_Shop_dat){
        return a.f_sort - b.f_sort;
    }
}