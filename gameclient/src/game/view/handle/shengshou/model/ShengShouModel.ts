import { E } from "../../../../G";
import { stHolyBeastData, stHolyBeastDataReward, stHolyBeastExchange, stHolyBeastLog, stHolyBeastLogDetail, stHolyBeastRank, stHolyBeastRankTime, stHolyBeastTask } from "../../../../network/protocols/BaseProto";
import { ActivityModel } from "../../activity/ActivityModel";
import { t_HolyBeast_Pack } from "../proxy/t_HolyBeast_Pack";

export class ShengShouModel extends Laya.EventDispatcher{
    private static _ins: ShengShouModel;

    public static UPDATE_VIEW:string = "UPDATE_VIEW";
    public static UPDATE_LOG:string = "UPDATE_LOG";
    public static UPDATE_RANK:string = "UPDATE_RANK";
    public static UPDATE_CHOUQU:string = "UPDATE_CHOUQU";
    public static UPDATE_TASK:string = "UPDATE_TASK";
    public static UPDATE_SHOP:string = "UPDATE_SHOP";

    public actID:number;
    public rankTimeList:stHolyBeastRankTime[];
    public beastList:stHolyBeastData[];
    public rewardList:stHolyBeastDataReward[];
    public taskList:stHolyBeastTask[];
    public exchangeList:stHolyBeastExchange[];

    public logAllList:stHolyBeastLogDetail[];
    public logMyList:stHolyBeastLogDetail[];
    public rankList:stHolyBeastRank[];

    public static get Ins() {
        if (!this._ins) {
            this._ins = new ShengShouModel();
        }
        return this._ins;
    } 

    constructor(){
        super();
        this.initData();
    }

    public initData(){
        this.rankTimeList = [];
        this.beastList = [];
        this.rewardList = [];
        this.taskList = [];
        this.exchangeList = [];
        this.logAllList = [];
        this.logMyList = [];
        this.rankList = [];
    }

    public isRedTip(id:number){
        if(this.isRewardRedTip(id) || this.isLBRedTip(id) || this.isTaskRedTip(id)){
            return true;
        }
        return false;
    }

    public isRewardRedTip(id:number){
        let data = this.getRewardData(id);
        if(!data)return false;
        for(let i:number=0;i<data.datalist.length;i++){
            if(data.datalist[i].state == 1){
                return true;
            }
        }
        return false;
    }

    public isLBRedTip(id:number){
        if(!this.isOpen(id))return false;
        let data = ActivityModel.Ins.getActivityData(id);
        if(!data)return false;
        let arr = t_HolyBeast_Pack.Ins.getListByIdAT(id,1);
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_recharge_id == 0){
                let num = data.datalist.find(ele => ele.id === arr[i].f_id).param1;
                if(num < arr[i].f_limited_amount){
                    return true;
                }
            }
        }
        return false;
    }

    public isTaskRedTip(id:number){
        if(!this.isOpen(id))return false;
        let data = this.getTaskData(id);
        if(!data)return false;
        for(let i:number=0;i<data.datalist.length;i++){
            if(data.datalist[i].state == 1){
                return true;
            }
        }
        return false;
    }

    //********************************************************************************* */
    public getRankTimeData(id:number):stHolyBeastRankTime{
        return this.rankTimeList.find(ele => ele.activityId === id);
    }

    public getBeastData(id:number):stHolyBeastData{
        return this.beastList.find(ele => ele.activityId === id);
    }

    public getRewardData(id:number):stHolyBeastDataReward{
        return this.rewardList.find(ele => ele.activityId === id);
    }

    public getTaskData(id:number):stHolyBeastTask{
        return this.taskList.find(ele => ele.activityId === id);
    }

    public getExchangeData(id:number):stHolyBeastExchange{
        return this.exchangeList.find(ele => ele.activityId === id);
    }
    //********************************************************************************* */
    public isOpen(id:number,flag:boolean = false){
        let data = this.getRankTimeData(id);
        if(!data){
            if(flag)E.ViewMgr.ShowMidError("活动已结束");
            return false;
        }
        if(TimeUtil.serverTime > data.end){
            if(flag)E.ViewMgr.ShowMidError("活动已结束");
            return false;
        }
        return true;
    }
}