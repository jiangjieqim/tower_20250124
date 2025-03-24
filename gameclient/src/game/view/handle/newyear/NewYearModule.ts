import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { SpringFestivalCommonTimes_revc, SpringFestivalDailyRecharge_revc, SpringFestivalInitOrFresh_revc, SpringFestivalRank_revc, SpringFestivalShop_revc, SpringFestivalSignIn_revc, SpringFestivalZan_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { ActivityModel } from "../activity/ActivityModel";
import { FunctionModel } from "../funs/FunctionModel";
import { EFuncDef } from "../main/model/EFuncDef";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";
import { NewYearModel } from "./model/NewYearModel";
import { NewYearView } from "./view/NewYearView";
import { NewYearView1 } from "./view/NewYearView1";

export class NewYearModule extends BaseModel{
    private static _ins:NewYearModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new NewYearModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new NewYearView(EViewType.NewYearView));
        this.Reg(new NewYearView1(EViewType.NewYearView1));

        TowerMainModel.Ins.on(TowerMainEvent.MainViewInit,this,this.onMainViewInit);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onMainViewInit);

        E.MsgMgr.AddMsg(SERVER_MSGID.SpringFestivalInitOrFresh,this.SpringFestivalInitOrFresh,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SpringFestivalSignIn,this.SpringFestivalSignIn,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SpringFestivalCommonTimes,this.SpringFestivalCommonTimes,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SpringFestivalRank,this.SpringFestivalRank,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SpringFestivalDailyRecharge,this.SpringFestivalDailyRecharge,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SpringFestivalZan,this.SpringFestivalZan,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SpringFestivalShop,this.SpringFestivalShop,this);
    }

    private onMainViewInit(){
        Laya.timer.callLater(this,this.setDot);
    }

    private setDot(){   
        if (NewYearModel.Ins.isRedTip()) {
            FunctionModel.Ins.funcSetRed(EFuncDef.Newyear, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.Newyear, false);
        }
    }

    private SpringFestivalInitOrFresh(value:SpringFestivalInitOrFresh_revc){
        NewYearModel.Ins.rankTime = value.rankTime;
        NewYearModel.Ins.signInList = value.signInList;
        NewYearModel.Ins.timeList = value.timeList;
        NewYearModel.Ins.dailyRechargeList = value.dailyRecharge;
        NewYearModel.Ins.dailyRechargeSumList = value.dailyRechargeSum;
        NewYearModel.Ins.shoplist = value.datalist;
        NewYearModel.Ins.event(NewYearModel.UPDATE_VIEW);
        NewYearModel.Ins.event(NewYearModel.UPDATE_SIGN);
        NewYearModel.Ins.event(NewYearModel.UPDATE_RECHARGE);
        NewYearModel.Ins.event(NewYearModel.UPDATE_RANK);
        NewYearModel.Ins.event(NewYearModel.UPDATE_SHOP);
        this.onMainViewInit();
    }

    private SpringFestivalSignIn(value:SpringFestivalSignIn_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = NewYearModel.Ins.signInList.findIndex(ele => ele.id === value.datalist[i].id);
            if(index != -1){
                NewYearModel.Ins.signInList[index] = value.datalist[i];
            }
        }
        NewYearModel.Ins.event(NewYearModel.UPDATE_SIGN);
        this.onMainViewInit();
    }

    private SpringFestivalCommonTimes(value:SpringFestivalCommonTimes_revc){
        for(let i:number=0;i<value.timeList.length;i++){
            let index = NewYearModel.Ins.timeList.findIndex(ele => ele.category === value.timeList[i].category);
            if(index != -1){
                NewYearModel.Ins.timeList[index] = value.timeList[i];
            }
        }
        NewYearModel.Ins.event(NewYearModel.UPDATE_VIEW);
        this.onMainViewInit();
    }

    private SpringFestivalRank(value:SpringFestivalRank_revc){
        NewYearModel.Ins.rankList = value.datalist;
        NewYearModel.Ins.event(NewYearModel.UPDATE_RANK);
    }

    private SpringFestivalDailyRecharge(value:SpringFestivalDailyRecharge_revc){
        if(value.flag == 0){
            for(let i:number=0;i<value.datalist.length;i++){
                let index = NewYearModel.Ins.dailyRechargeList.findIndex(ele => ele.id === value.datalist[i].id);
                if(index != -1){
                    NewYearModel.Ins.dailyRechargeList[index] = value.datalist[i];
                }
            }
        }else{
            for(let i:number=0;i<value.datalist.length;i++){
                let index = NewYearModel.Ins.dailyRechargeSumList.findIndex(ele => ele.id === value.datalist[i].id);
                if(index != -1){
                    NewYearModel.Ins.dailyRechargeSumList[index] = value.datalist[i];
                }
            }
        }
        NewYearModel.Ins.event(NewYearModel.UPDATE_RECHARGE);
        this.onMainViewInit();
    }

    private SpringFestivalZan(value:SpringFestivalZan_revc){
        let index = NewYearModel.Ins.rankList.findIndex(ele => ele.uqSign === value.uqSign);
        if(index != -1){
            NewYearModel.Ins.rankList[index].zan = value.zan;
            NewYearModel.Ins.rankList[index].zanExist = value.zanExist;
        }
        NewYearModel.Ins.event(NewYearModel.UPDATE_RANK);
    }

    private SpringFestivalShop(value:SpringFestivalShop_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = NewYearModel.Ins.shoplist.findIndex(ele => ele.fid === value.datalist[i].fid);
            if(index != -1){
                NewYearModel.Ins.shoplist[index] = value.datalist[i];
            }
        }
        NewYearModel.Ins.event(NewYearModel.UPDATE_SHOP);
    }
}