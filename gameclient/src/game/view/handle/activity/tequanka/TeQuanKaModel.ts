import { stCommonTimes } from "../../../../network/protocols/BaseProto";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { t_Month_Card } from "./t_Month_Card";

export class TeQuanKaModel extends Laya.EventDispatcher{
    private static _ins: TeQuanKaModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new TeQuanKaModel();
        }
        return this._ins;
    } 

    public static UPDATE_DATA:string = "UPDATE_DATA";

    public monthCardEndUnix:number;
    public statusList:stCommonTimes[];

    constructor(){
        super();
    }

    public setRedTip(){
        if(this.isRedTip()){
            FunctionModel.Ins.funcSetRed(EFuncDef.TeQuanKa, true);
        }else{
            FunctionModel.Ins.funcSetRed(EFuncDef.TeQuanKa, false);
        }
    }

    public isRedTip(){
        if(!this.statusList)return false;
        for(let i:number=0;i<this.statusList.length;i++){
            if(this.statusList[i].times == EActivityStatus.Claimable){
                return true;
            }
        }
        return false;
    }

    public isOpenYueKa(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.TeQuanKa);
        if(!data)return false;
        let status = data.datalist.find(ele=>ele.id == 1).param1;
        if(status){
            return true;
        }
        return false;
    }

    public isOpenZSK(){
        if(Laya.Utils.getQueryString("isOpenZSK")){
            return Laya.Utils.getQueryString("isOpenZSK");
        }
        let data = ActivityModel.Ins.getActivityData(EActivityID.TeQuanKa);
        if(!data)return false;
        let status = data.datalist.find(ele=>ele.id == 2).param1;
        if(status){
            return true;
        }
        return false;
    }

    public getTime(time:number){
        if(this.isOpenYueKa()){
            let ykCfg:Configs.t_Month_Card_dat = t_Month_Card.Ins.GetDataById(1);
            let num = (10000 - ykCfg.f_reduce_box_time) / 10000;
            return time * num;
        }
        return time;
    }

}