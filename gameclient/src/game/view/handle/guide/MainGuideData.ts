import { ERedEnum } from "../main/model/ERedEnum";
import { MainModel } from "../main/model/MainModel";
import { GuideModel } from "./GuideModel";

export class MainGuideData{
    maxTaskId:number;
    taskId: number;
    private get model(){
        return MainModel.Ins;
    }
    dispose(){
        
    }

    private getTaskId(){

        if(Laya.Utils.getQueryString("guide_task_id")){
            return parseInt(Laya.Utils.getQueryString("guide_task_id"));
        }

        let curTaskId:number = this.model.red.getValByID(ERedEnum.PVE_MAIN_GUIDE);
        if(curTaskId == undefined){
            return 0;
        }
        else if(curTaskId < this.maxTaskId){
            return curTaskId + 1;
        }
        LogSys.Error(`主线任务TaskId异常`);
        return -1;
    }

    init(){
        this.taskId = this.getTaskId();
        GuideModel.Ins.taskId = this.taskId;
    }
}