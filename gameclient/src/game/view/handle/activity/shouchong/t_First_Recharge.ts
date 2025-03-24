import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_First_Recharge extends BaseCfg{
    private static _ins:t_First_Recharge;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_First_Recharge();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_First_Recharge";
    }

    public getCfgById(id:number):Configs.t_First_Recharge_dat{
        return this.List.find(ele => ele.f_id == id);
    }

    public getListByType(type:number):Configs.t_First_Recharge_dat[]{
        let arr = this.List;
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_tab == type){
                array.push(arr[i]);
            }
        }
        return array;
    }
}