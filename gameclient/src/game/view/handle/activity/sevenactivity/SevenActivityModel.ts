import { stSevenDayBigReward, stSevenDayTaskDetail } from "../../../../network/protocols/BaseProto";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { EActivityStatus } from "../ActivityEnum";
import { t_Sevenday_Task } from "./t_Sevenday_Task";
import { t_Sevenday_Task_Config } from "./t_Sevenday_Task_Config";

export class SevenActivityModel extends Laya.EventDispatcher{
    private static _ins: SevenActivityModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new SevenActivityModel();
        }
        return this._ins;
    } 

    public static UPDATE_DATA:string = "UPDATE_DATA";

    public dayId:number;
    public bigRewardList:stSevenDayBigReward[];
    public taskList:stSevenDayTaskDetail[];

    constructor(){
        super();
    }

    public setRedTip(){
        if (this.isRedTip()) {
            FunctionModel.Ins.funcSetRed(EFuncDef.SevenAct, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.SevenAct, false);
        }
    }

    public isRedTip(){
        let arr = t_Sevenday_Task_Config.Ins.List;
        for(let i:number=0;i<arr.length;i++){
            if(this.isTabRedTip(arr[i])){
                return true;
            }
        }
        return false;
    }

    public isTabRedTip(value:Configs.t_Sevenday_Task_Config_dat){
        if(!this.bigRewardList)return false;
        if(!this.taskList)return false;
        let status = this.bigRewardList.find(ele=>ele.id == value.f_id).state;
        if(status == EActivityStatus.Claimable){
            return true;
        }

        let arr = t_Sevenday_Task.Ins.List;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_task_day == value.f_day){
                let state = this.taskList.find(ele => ele.id == arr[i].f_id).state;
                if (state == EActivityStatus.Claimable) {
                    return true;
                }
            }
        }
        return false;
    }

    public getNum(arr){
        if(!this.taskList)return 0;
        let num = 0;
        for(let i:number=0;i<arr.length;i++){
            let state = this.taskList.find(ele => ele.id == arr[i].f_id).state;
            if (state == EActivityStatus.Claimed) {
                num++;
            }
        }
        return num;
    }
}