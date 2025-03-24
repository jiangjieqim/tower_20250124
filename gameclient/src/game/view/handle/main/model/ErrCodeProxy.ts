import { BaseCfg } from "../../../../static/json/data/BaseCfg";
import { MainBaseVo } from "../vos/MainBaseVo";

export class ErrCodeProxy extends BaseCfg{
    public GetTabelName():string{
        return "t_Err";
    }
    private static _ins:ErrCodeProxy;

    public static get Ins(){
        if(!this._ins){
            this._ins = new ErrCodeProxy();
        }
        return this._ins;
    }
}

export class SuccessCodeProxy extends BaseCfg{
    public GetTabelName():string{
        return "t_Err_Sucess";
    }
    private static _ins:SuccessCodeProxy;

    public static get Ins(){
        if(!this._ins){
            this._ins = new SuccessCodeProxy();
        }
        return this._ins;
    }
}