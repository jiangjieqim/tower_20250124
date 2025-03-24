import { stTaskOut } from "../../../../network/protocols/BaseProto";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { MainModel } from "../../main/model/MainModel";
import { EActivityID } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { t_Battle_Pass_Task } from "./t_Battle_Pass_Task";

export class ZhanLinModel extends Laya.EventDispatcher{
    private static _ins: ZhanLinModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new ZhanLinModel();
        }
        return this._ins;
    } 

    public lv:number;
    public exp:number;
    public taskList:stTaskOut[];

    public static UPDATE_DATA:string = "UPDATE_DATA";

    constructor(){
        super();
    }

    public setRedTip(){
        if(this.isRedTip1() || this.isRedTip2()){
            FunctionModel.Ins.funcSetRed(EFuncDef.ZhanLin, true);
        }else{
            FunctionModel.Ins.funcSetRed(EFuncDef.ZhanLin, false);
        }
    }

    public isRedTip1(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.ZhanLin);
        if(data){
            for(let i:number=0;i<data.datalist.length;i++){
                let status = data.datalist[i].param1;
                if( status == 1 || status == 11 || status == 13){
                    return true;
                }
            }
        }
        return false;
    }

    public isRedTip2(type:number = 0){
        if(!this.taskList)return false;
        for(let i:number=0;i<this.taskList.length;i++){
            let cfg = t_Battle_Pass_Task.Ins.getCfgById(this.taskList[i].id);
            if(type == 0 || cfg.f_task_type == type){
                let status = this.taskList[i].status;
                if( status == 1 ){
                    return true;
                }
            }
        }
        return false;
    }

    public isChongZhi(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.ZhanLin);
        if(data){
            for(let i:number=0;i<data.datalist.length;i++){
                let status = data.datalist[i].param1;
                if( status == 11 || status == 12 || status == 13){
                    return true;
                }
            }
        }
        return false;
    }
}