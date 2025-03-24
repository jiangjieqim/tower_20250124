import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { EActivityID } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { t_Fund_Reward } from "./t_Fund_Reward";

export class JiJinModel extends Laya.EventDispatcher{
    private static _ins: JiJinModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new JiJinModel();
        }
        return this._ins;
    } 

    constructor(){
        super();
    }

    public setRedTip(){
        if(this.isRedTip1() || this.isRedTip2() || this.isRedTip3()){
            FunctionModel.Ins.funcSetRed(EFuncDef.JiJin, true);
        }else{
            FunctionModel.Ins.funcSetRed(EFuncDef.JiJin, false);
        }
    }

    public isRedTip1(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.JIJIN);
        if(!data)return false;
        let arr = t_Fund_Reward.Ins.getListByType(1);
        for(let i:number = 0;i<arr.length;i++){
            let status = data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
            if( status == 1 || status == 11 || status == 13){
                return true;
            }
        }
        return false;
    }

    public isRedTip2(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.JIJIN);
        if(!data)return false;
        let arr = t_Fund_Reward.Ins.getListByType(2);
        for(let i:number = 0;i<arr.length;i++){
            let status = data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
            if( status == 1 || status == 11 || status == 13){
                return true;
            }
        }
        return false;
    }

    public isRedTip3(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.JIJIN);
        if(!data)return false;
        let arr = t_Fund_Reward.Ins.getListByType(3);
        for(let i:number = 0;i<arr.length;i++){
            let status = data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
            if( status == 1 || status == 11 || status == 13){
                return true;
            }
        }
        return false;
    }

    public isChongZhi(type:number){
        let data = ActivityModel.Ins.getActivityData(EActivityID.JIJIN);
        if(!data)return false;
        let arr = t_Fund_Reward.Ins.getListByType(type);
        for(let i:number = 0;i<arr.length;i++){
            let status = data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
            if( status == 11 || status == 12 || status == 13){
                return true;
            }
        }
        return false;
    }
}