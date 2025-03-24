import { E } from "../../../../G";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { t_First_Recharge } from "./t_First_Recharge";


export class ShouChongModel extends Laya.EventDispatcher{
    private static _ins: ShouChongModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new ShouChongModel();
        }
        return this._ins;
    } 

    constructor(){
        super();
    }

    public setRedTip(){
        if (this.isRedTip()) {
            FunctionModel.Ins.funcSetRed(EFuncDef.ShouChong, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.ShouChong, false);
        }
    }

    public isRedTip(type:number=0){
        let data = ActivityModel.Ins.getActivityData(EActivityID.ShouChong);
        if(!data)return false;
        let arr = t_First_Recharge.Ins.List;
        for(let i:number=0;i<arr.length;i++){
            if(type == 0 || arr[i].f_tab == type){
                let status = data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
                if(status == EActivityStatus.Claimable){
                    return true;
                }
            }
        }
        return false;
    }        
}