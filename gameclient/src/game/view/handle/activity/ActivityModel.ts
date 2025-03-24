import { SocketMgr } from "../../../network/SocketMgr";
import { ActivityAction_req, stActivity, stActivityStatus } from "../../../network/protocols/BaseProto";
import { EActivityID, EActivityStatus } from "./ActivityEnum";
import { XianShiLiBaoModel } from "./xianshilibao/XianShiLiBaoModel";

export class ActivityModel extends Laya.EventDispatcher{
    private static _ins: ActivityModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new ActivityModel();
        }
        return this._ins;
    } 

    public static UPDATE_DATA:string = "UPDATE_DATA";
    public static UPDATE_STATUS_DATA:string = "UPDATE_STATUS_DATA";
    public static UPDATE_TODAYFIRSTLOGIN:string = "UPDATE_TODAYFIRSTLOGIN";
    public static SHENHUAZIXUAN:string = "SHENHUAZIXUAN";

    public activityList:stActivity[];
    public activityStatusList:stActivityStatus[];

    constructor(){
        super();
        this.initData();
    }

    public initData(){
        this.activityList = [];
        this.activityStatusList = [];
        XianShiLiBaoModel.Ins.limitPackTimeList = [];
    }

    public getActivityData(id:EActivityID){
        return this.activityList.find(ele=>ele.activityId == id);
    }

    public getActivityStatusData(id:EActivityID){
        return this.activityStatusList.find(ele=>ele.activityId == id);
    }

    public sendCmd(activityId:number,id:number,extra:string = "0"){
        let req = new ActivityAction_req;
        req.activityId = activityId;
        req.id = id;
        req.extra = extra;
        SocketMgr.Ins.SendMessageBin(req);
    }

    public isRedTip(id:EActivityID){
        let data = ActivityModel.Ins.getActivityData(id);
        if(!data)return false;
        for(let i:number=0;i<data.datalist.length;i++){
            let status = data.datalist[i].param1;
            if(status == EActivityStatus.Claimable){
                return true;
            }
        }
        return false;
    }
}