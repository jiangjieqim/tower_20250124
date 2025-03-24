import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";

export class SignModel extends Laya.EventDispatcher{
    private static _ins: SignModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new SignModel();
        }
        return this._ins;
    } 

    constructor(){
        super();
    }

    public setRedTip(){
        if (this.isRedTip()) {
            FunctionModel.Ins.funcSetRed(EFuncDef.Sign, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.Sign, false);
        }
    }

    public isRedTip(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.Sign);
        if(!data)return false;
        for(let i:number=0;i<data.datalist.length;i++){
            if(data.datalist[i].param1 == EActivityStatus.Claimable){
                return true;
            }
        }
        return false;
    }        
}