import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Box_Falling_Rate extends BaseCfg{
    private static _ins:t_Box_Falling_Rate;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Box_Falling_Rate();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Box_Falling_Rate";
    }

    public getCfgByQua(qua:number):Configs.t_Box_Falling_Rate_dat{
        return this.List.find(ele => ele.f_box_type == qua);
    }
}