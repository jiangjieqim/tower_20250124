import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_HolyBeast_Pack extends BaseCfg{
    private static _ins:t_HolyBeast_Pack;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_HolyBeast_Pack();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_HolyBeast_Pack";
    }

    public getListByIdAT(id:number,type:number):Configs.t_HolyBeast_Pack_dat[]{
        let arr = [];
        for(let i:number=0;i<this.List.length;i++){
            if(this.List[i].f_activity_id == id && this.List[i].f_pack_type == type){
                arr.push(this.List[i]);
            }
        }
        arr.sort(this.onSort);
        return arr;
    }

    private onSort(a:Configs.t_HolyBeast_Pack_dat,b:Configs.t_HolyBeast_Pack_dat){
        return a.f_sort - b.f_sort;
    }
}