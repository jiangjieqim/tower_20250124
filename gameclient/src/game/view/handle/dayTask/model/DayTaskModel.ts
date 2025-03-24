import { SocketMgr } from "../../../../network/SocketMgr";
import { TaskOutReward_req, stTaskOut, stTaskOutActivation } from "../../../../network/protocols/BaseProto";

export class DayTaskModel extends Laya.EventDispatcher{
    private static _ins: DayTaskModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new DayTaskModel();
        }
        return this._ins;
    } 

    public static UPDATE_TASK:string = "UPDATE_TASK";

    public activation:number;
    public activationRewards:stTaskOutActivation[];
    public dailyTasks:stTaskOut[];//每日任务详情
    public achieveTasks:stTaskOut[];

    constructor(){
        super();
        this.activationRewards = [];
        this.dailyTasks =[];
        this.achieveTasks = [];
    }

    public isRedTip(){
        if(this.isTabRedTip1() || this.isTabRedTip2()){
            return true;
        }
        return false;
    }

    public isTabRedTip1(){
        for(let i:number=0;i<this.activationRewards.length;i++){
            if(this.activationRewards[i].status == 1){
                return true;
            }
        }
        for(let i:number=0;i<this.dailyTasks.length;i++){
            if(this.dailyTasks[i].status == 1){
                return true;
            }
        }
        return false;
    }

    public isTabRedTip2(){
        for(let i:number=0;i<this.achieveTasks.length;i++){
            if(this.achieveTasks[i].status == 1){
                return true;
            }
        }
        return false;
    }

    public sendCmd(flag:number,id:number){
        let req = new TaskOutReward_req;
        req.flag = flag;
        req.id = id;
        SocketMgr.Ins.SendMessageBin(req);
    }
}