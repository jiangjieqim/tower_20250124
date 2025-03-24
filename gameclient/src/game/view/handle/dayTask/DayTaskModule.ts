import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { TaskOutActivationReward_revc, TaskOutActivation_revc, TaskOutChange_revc, TaskOutInit_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { FunctionModel } from "../funs/FunctionModel";
import { EFuncDef } from "../main/model/EFuncDef";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";
import { DayTaskModel } from "./model/DayTaskModel";
import { t_Achieve_Task } from "./proxy/t_Achieve_Task";
import { DayTaskView } from "./view/DayTaskView";

export class DayTaskModule extends BaseModel{
    private static _ins:DayTaskModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new DayTaskModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new DayTaskView(EViewType.DayTaskView));

        TowerMainModel.Ins.on(TowerMainEvent.MainViewInit,this,this.onMainViewInit);

        E.MsgMgr.AddMsg(SERVER_MSGID.TaskOutInit, this.TaskOutInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TaskOutActivation, this.TaskOutActivation,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TaskOutChange, this.TaskOutChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TaskOutActivationReward, this.TaskOutActivationReward,this);
    }

    private onMainViewInit(){
        Laya.timer.callLater(this,this.setDot);
    }

    private setDot(){   
        if (DayTaskModel.Ins.isRedTip()) {
            FunctionModel.Ins.funcSetRed(EFuncDef.DayTask, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.DayTask, false);
        }
    }

    private TaskOutInit(value:TaskOutInit_revc){
        DayTaskModel.Ins.activation = value.activation;
        DayTaskModel.Ins.achieveTasks = value.achieveTasks;
        DayTaskModel.Ins.activationRewards = value.activationRewards;
        DayTaskModel.Ins.dailyTasks = value.dailyTasks;
    }

    private TaskOutActivation(value:TaskOutActivation_revc){
        DayTaskModel.Ins.activation = value.activation;
        DayTaskModel.Ins.event(DayTaskModel.UPDATE_TASK);
    }

    private TaskOutChange(value:TaskOutChange_revc){
        if(value.flag == 0){
            for(let i:number=0;i<value.tasks.length;i++){
                let index = DayTaskModel.Ins.dailyTasks.findIndex(ele => ele.id === value.tasks[i].id);
                if(index !=- 1){
                    DayTaskModel.Ins.dailyTasks[index] = value.tasks[i];
                }
            }
        }else{
            for(let i:number=0;i<value.tasks.length;i++){
                let type = t_Achieve_Task.Ins.GetDataById(value.tasks[i].id).f_task_type;
                let index = DayTaskModel.Ins.achieveTasks.findIndex(ele => t_Achieve_Task.Ins.GetDataById(ele.id).f_task_type === type);
                if(index !=- 1){
                    DayTaskModel.Ins.achieveTasks[index] = value.tasks[i];
                }
            }
        }
        DayTaskModel.Ins.event(DayTaskModel.UPDATE_TASK);
        this.onMainViewInit();
    }

    private TaskOutActivationReward(value:TaskOutActivationReward_revc){
        for(let i:number=0;i<value.rewards.length;i++){
            let index = DayTaskModel.Ins.activationRewards.findIndex(ele => ele.id === value.rewards[i].id);
            if(index !=- 1){
                DayTaskModel.Ins.activationRewards[index] = value.rewards[i];
            }
        }
        DayTaskModel.Ins.event(DayTaskModel.UPDATE_TASK);
        this.onMainViewInit();
    }
}