import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { HolyBeastExchange_revc, HolyBeastExtractReward_revc, HolyBeastExtract_revc, HolyBeastInitOrFresh_revc, HolyBeastLog_revc, HolyBeastRank_revc, HolyBeastTask_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { ActivityModel } from "../activity/ActivityModel";
import { t_Activity } from "../activity/t_Activity";
import { FunctionModel } from "../funs/FunctionModel";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";
import { ShengShouModel } from "./model/ShengShouModel";
import { ShengShouLBView } from "./view/ShengShouLBView";
import { ShengShouRankView } from "./view/ShengShouRankView";
import { ShengShouRankView1 } from "./view/ShengShouRankView1";
import { ShengShouShopView } from "./view/ShengShouShopView";
import { ShengShouTaskView } from "./view/ShengShouTaskView";
import { ShengShouView } from "./view/ShengShouView";
import { ShengShouView1 } from "./view/ShengShouView1";
import { ShengShouView2 } from "./view/ShengShouView2";
import { ShengShouView3 } from "./view/ShengShouView3";

export class ShengShouModule extends BaseModel{
    private static _ins:ShengShouModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new ShengShouModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{
        ShengShouModel.Ins.initData();
    }

    public initMsg(){
        this.Reg(new ShengShouView(EViewType.ShengShouView));
        this.Reg(new ShengShouView1(EViewType.ShengShouView1));
        this.Reg(new ShengShouView2(EViewType.ShengShouView2));
        this.Reg(new ShengShouLBView(EViewType.ShengShouLBView));
        this.Reg(new ShengShouRankView(EViewType.ShengShouRankView));
        this.Reg(new ShengShouRankView1(EViewType.ShengShouRankView1));
        this.Reg(new ShengShouTaskView(EViewType.ShengShouTaskView));
        this.Reg(new ShengShouShopView(EViewType.ShengShouShopView));
        this.Reg(new ShengShouView3(EViewType.ShengShouView3));

        TowerMainModel.Ins.on(TowerMainEvent.MainViewInit,this,this.onMainViewInit);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onMainViewInit);

        E.MsgMgr.AddMsg(SERVER_MSGID.HolyBeastInitOrFresh,this.HolyBeastInitOrFresh,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HolyBeastExtract,this.HolyBeastExtract,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HolyBeastExtractReward,this.HolyBeastExtractReward,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HolyBeastTask,this.HolyBeastTask,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HolyBeastExchange,this.HolyBeastExchange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HolyBeastLog,this.HolyBeastLog,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HolyBeastRank,this.HolyBeastRank,this);
    }

    private onMainViewInit(){
        Laya.timer.callLater(this,this.setDot);
    }

    private setDot(){   
        let arr = t_Activity.Ins.getListByGroup(1);
        for(let i:number=0;i<arr.length;i++){
            if(FunctionModel.Ins.isOpenByFuncId(arr[i].f_func_id,false)){
                if(ShengShouModel.Ins.isRedTip(arr[i].f_activity_id)){
                    FunctionModel.Ins.funcSetRed(arr[i].f_func_id, true);
                }else{
                    FunctionModel.Ins.funcSetRed(arr[i].f_func_id, false);
                }
            }
        }
    }

    private HolyBeastInitOrFresh(value:HolyBeastInitOrFresh_revc){
        ShengShouModel.Ins.rankTimeList = value.rankTimeList;
        ShengShouModel.Ins.beastList = value.datalist;
        ShengShouModel.Ins.rewardList = value.dataRewardList;
        ShengShouModel.Ins.taskList = value.taskList;
        ShengShouModel.Ins.exchangeList = value.exchangeList;
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_VIEW);
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_SHOP);
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_TASK);
        this.onMainViewInit();
    }

    private HolyBeastExtract(value:HolyBeastExtract_revc){
        ShengShouModel.Ins.beastList = value.datalist;
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_CHOUQU,value);
    }

    private HolyBeastExtractReward(value:HolyBeastExtractReward_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let data = ShengShouModel.Ins.getRewardData(value.datalist[i].activityId);
            let arr = value.datalist[i].datalist;
            for(let j:number=0;j<arr.length;j++){
                let index = data.datalist.findIndex(ele => ele.id === arr[j].id);
                if(index != -1){
                    data.datalist[index] = arr[j];
                }
            }
        }
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_VIEW);
        this.onMainViewInit();
    }

    private HolyBeastTask(value:HolyBeastTask_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let data = ShengShouModel.Ins.getTaskData(value.datalist[i].activityId);
            let arr = value.datalist[i].datalist;
            for(let j:number=0;j<arr.length;j++){
                let index = data.datalist.findIndex(ele => ele.id === arr[j].id);
                if(index != -1){
                    data.datalist[index] = arr[j];
                }
            }
        }
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_TASK);
        this.onMainViewInit();
    }

    private HolyBeastExchange(value:HolyBeastExchange_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let data = ShengShouModel.Ins.getExchangeData(value.datalist[i].activityId);
            let arr = value.datalist[i].datalist;
            for(let j:number=0;j<arr.length;j++){
                let index = data.datalist.findIndex(ele => ele.id === arr[j].id);
                if(index != -1){
                    data.datalist[index] = arr[j];
                }
            }
        }
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_SHOP);
    }

    private HolyBeastLog(value:HolyBeastLog_revc){
        if(value.flag == 0){
            ShengShouModel.Ins.logMyList = value.datalist[0].datalist;
        }else{
            if(ShengShouModel.Ins.logAllList.length == 0){
                ShengShouModel.Ins.logAllList = value.datalist[0].datalist;
            }else{
                for(let i:number=0;i<value.datalist[0].datalist.length;i++){
                    ShengShouModel.Ins.logAllList.push(value.datalist[0].datalist[i]);
                }
            }
        }
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_LOG,value.flag);
    }

    private HolyBeastRank(value:HolyBeastRank_revc){
        ShengShouModel.Ins.rankList = value.datalist;
        ShengShouModel.Ins.event(ShengShouModel.UPDATE_RANK);
    }
}