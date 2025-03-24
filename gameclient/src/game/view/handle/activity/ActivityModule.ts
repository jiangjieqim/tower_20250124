import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { ActivityChange_revc, ActivityListInit_revc, ActivityStatus_revc, BattlePassInit_revc, BattlePassLevel_revc, BattlePassTaskChange_revc, LimitPackTimeInit_revc, LimitPackTime_revc, MonthCardInit_revc, MonthCardRewardTimes_revc, MonthCardUnix_revc, SevenDayBigRewardUpdate_revc, SevenDayInitOrFresh_revc, SevenDayTaskUpdate_revc, TodayFirstLogin_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { FunctionModel } from "../funs/FunctionModel";
import { EFuncDef } from "../main/model/EFuncDef";
import { MainModel } from "../main/model/MainModel";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";
import { EActivityID } from "./ActivityEnum";
import { ActivityModel } from "./ActivityModel";
import { JiJinModel } from "./jijin/JiJinModel";
import { JiJinView } from "./jijin/JiJinView";
import { MeiRiChongZhiView } from "./meirichongzhi/MeiRiChongZhiView";
import { SevenActivityModel } from "./sevenactivity/SevenActivityModel";
import { SevenActivityView } from "./sevenactivity/SevenActivityView";
import { SHZXView } from "./shenhuazixuan/SHZXView";
import { SHZXView1 } from "./shenhuazixuan/SHZXView1";
import { ShouChongModel } from "./shouchong/ShouChongModel";
import { ShouChongView } from "./shouchong/ShouChongView";
import { SignModel } from "./sign/SignModel";
import { SignView } from "./sign/SignView";
import { TeQuanKaModel } from "./tequanka/TeQuanKaModel";
import { TeQuanKaView } from "./tequanka/TeQuanKaView";
import { XianShiLiBaoModel } from "./xianshilibao/XianShiLiBaoModel";
import { XianShiLiBaoView } from "./xianshilibao/XianShiLiBaoView";
import { ZhanLinModel } from "./zhanlin/ZhanLinModel";
import { ZhanLinView } from "./zhanlin/ZhanLinView";
import { ZhanLinView1 } from "./zhanlin/ZhanLinView1";
import { t_Battle_Pass_Task } from "./zhanlin/t_Battle_Pass_Task";
import { TaoDaeModel } from "../taodae/model/TaoDaeModel";
import { GameEvent } from "../main/model/GameEvent";

export class ActivityModule extends BaseModel{
    private static _ins:ActivityModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new ActivityModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{
        ActivityModel.Ins.initData();
    }

    public initMsg(){
        this.Reg(new ShouChongView(EViewType.ShouChongView));
        this.Reg(new TeQuanKaView(EViewType.TeQuanKaView));
        this.Reg(new SignView(EViewType.SignView));
        this.Reg(new ZhanLinView(EViewType.ZhanLinView));
        this.Reg(new ZhanLinView1(EViewType.ZhanLinView1));
        this.Reg(new XianShiLiBaoView(EViewType.XianShiLiBaoView));
        this.Reg(new MeiRiChongZhiView(EViewType.MeiRiChongZhiView));
        this.Reg(new SevenActivityView(EViewType.SevenActivityView));
        this.Reg(new SHZXView(EViewType.SHZXView));
        this.Reg(new SHZXView1(EViewType.SHZXView1));
        this.Reg(new JiJinView(EViewType.JiJinView));

        TowerMainModel.Ins.on(TowerMainEvent.MainViewInit,this,this.onMainViewInit);

        E.MsgMgr.AddMsg(SERVER_MSGID.ActivityListInit, this.ActivityListInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ActivityChange, this.ActivityChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ActivityStatus, this.ActivityStatus,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonthCardInit, this.MonthCardInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonthCardUnix, this.MonthCardUnix,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonthCardRewardTimes, this.MonthCardRewardTimes,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.BattlePassInit, this.BattlePassInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.BattlePassTaskChange, this.BattlePassTaskChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.BattlePassLevel, this.BattlePassLevel,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TodayFirstLogin, this.TodayFirstLogin,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.LimitPackTimeInit, this.LimitPackTimeInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.LimitPackTime, this.LimitPackTime,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SevenDayInitOrFresh, this.SevenDayInitOrFresh,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SevenDayTaskUpdate, this.SevenDayTaskUpdate,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SevenDayBigRewardUpdate, this.SevenDayBigRewardUpdate,this);
    }

    private onMainViewInit(){
        Laya.timer.callLater(this,this.setDot);
    }

    private setDot(){   
        ShouChongModel.Ins.setRedTip();
        TeQuanKaModel.Ins.setRedTip();
        SignModel.Ins.setRedTip();
        ZhanLinModel.Ins.setRedTip();
        SevenActivityModel.Ins.setRedTip();
        JiJinModel.Ins.setRedTip();
        
        if(ActivityModel.Ins.isRedTip(EActivityID.MRChongZhi)){
            FunctionModel.Ins.funcSetRed(EFuncDef.MRChongZhi, true);
        }else{
            FunctionModel.Ins.funcSetRed(EFuncDef.MRChongZhi, false);
        }
        E.EventMgr.emit(GameEvent.ActivityRedUpdate);
    }

    private ActivityListInit(value:ActivityListInit_revc){
        ActivityModel.Ins.activityList = value.datalist;
        ActivityModel.Ins.activityStatusList = value.status;
    }

    private ActivityChange(value:ActivityChange_revc){
        if(value.type == 0){
            for(let i:number=0;i<value.datalist.length;i++){
                let index = ActivityModel.Ins.activityList.findIndex(ele=>ele.activityId == value.datalist[i].activityId);
                if(index != -1){
                    let data = ActivityModel.Ins.activityList[index];
                    for(let j:number=0;j<value.datalist[i].datalist.length;j++){
                        let ii = data.datalist.findIndex(ele=>ele.id == value.datalist[i].datalist[j].id);
                        if(ii != -1){
                            data.datalist[ii] = value.datalist[i].datalist[j];
                        }else{
                            data.datalist.push(value.datalist[i].datalist[j]);
                        }
                    }
                }else{
                    ActivityModel.Ins.activityList.push(value.datalist[i]);
                }
            }
        }else{
            ActivityModel.Ins.activityList = value.datalist;
        }
        ActivityModel.Ins.event(ActivityModel.UPDATE_DATA);
        this.onMainViewInit();
    }

    private ActivityStatus(value:ActivityStatus_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = ActivityModel.Ins.activityStatusList.findIndex(ele=>ele.activityId == value.datalist[i].activityId);
            if(index != -1){
                ActivityModel.Ins.activityStatusList[index] = value.datalist[i];
            }else{
                ActivityModel.Ins.activityStatusList.push(value.datalist[i]);
            }
        }
        ActivityModel.Ins.event(ActivityModel.UPDATE_STATUS_DATA);
        this.onMainViewInit();
    }

    private TodayFirstLogin(value:TodayFirstLogin_revc){
        MainModel.Ins.todayFirstLogin = value.isFirst;
        ActivityModel.Ins.event(ActivityModel.UPDATE_TODAYFIRSTLOGIN);
    }

    private MonthCardInit(value:MonthCardInit_revc){
        TeQuanKaModel.Ins.monthCardEndUnix = value.monthCardEndUnix;
        TeQuanKaModel.Ins.statusList = value.datalist;
    }

    private MonthCardUnix(value:MonthCardUnix_revc){
        TeQuanKaModel.Ins.monthCardEndUnix = value.unix;
        TeQuanKaModel.Ins.event(TeQuanKaModel.UPDATE_DATA);
    }

    private MonthCardRewardTimes(value:MonthCardRewardTimes_revc){
        if(value.isList){
            TeQuanKaModel.Ins.statusList = value.datalist;
        }else{
            for(let i:number=0;i<value.datalist.length;i++){
                let index = TeQuanKaModel.Ins.statusList.findIndex(ele=>ele.flag == value.datalist[i].flag);
                if(index != -1){
                    TeQuanKaModel.Ins.statusList[index] = value.datalist[i];
                }
            }
        }
        TeQuanKaModel.Ins.event(TeQuanKaModel.UPDATE_DATA);
        this.onMainViewInit();
    }

    private BattlePassInit(value:BattlePassInit_revc){
        ZhanLinModel.Ins.lv = value.BattlePassLevel;
        ZhanLinModel.Ins.exp = value.BattlePassLevelExp;
        ZhanLinModel.Ins.taskList = value.tasks;
    }

    private BattlePassTaskChange(value: BattlePassTaskChange_revc) {
        if (ZhanLinModel.Ins.taskList) {
            for (let i: number = 0; i < value.tasks.length; i++) {
                let type = t_Battle_Pass_Task.Ins.getCfgById(value.tasks[i].id).f_task_type;
                let template = t_Battle_Pass_Task.Ins.getCfgById(value.tasks[i].id).f_task_template;
                let index = ZhanLinModel.Ins.taskList.findIndex(ele => t_Battle_Pass_Task.Ins.getCfgById(ele.id).f_task_template === template
                    && t_Battle_Pass_Task.Ins.getCfgById(ele.id).f_task_type === type);
                if (index != - 1) {
                    ZhanLinModel.Ins.taskList[index] = value.tasks[i];
                }
            }
            ZhanLinModel.Ins.setRedTip();
            ZhanLinModel.Ins.event(ZhanLinModel.UPDATE_DATA);
        }
    }

    private BattlePassLevel(value:BattlePassLevel_revc){
        ZhanLinModel.Ins.lv = value.level;
        ZhanLinModel.Ins.exp = value.exp;
        ZhanLinModel.Ins.event(ZhanLinModel.UPDATE_DATA);
    }

    private LimitPackTimeInit(value:LimitPackTimeInit_revc){
        XianShiLiBaoModel.Ins.limitPackTimeList = value.datalist;
    }

    private LimitPackTime(value:LimitPackTime_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = XianShiLiBaoModel.Ins.limitPackTimeList.findIndex(ele=>ele.id == value.datalist[i].id);
            if(index != -1){
                XianShiLiBaoModel.Ins.limitPackTimeList[index] = value.datalist[i];
            }else{
                XianShiLiBaoModel.Ins.limitPackTimeList.push(value.datalist[i]);
            }
        }
        XianShiLiBaoModel.Ins.event(XianShiLiBaoModel.UPDATE_DATA);
    }

    private SevenDayInitOrFresh(value:SevenDayInitOrFresh_revc){
        SevenActivityModel.Ins.dayId = value.day;
        SevenActivityModel.Ins.bigRewardList = value.bigRewardList;
        SevenActivityModel.Ins.taskList = value.taskList;
        this.onMainViewInit();
        SevenActivityModel.Ins.event(SevenActivityModel.UPDATE_DATA);
    }

    private SevenDayTaskUpdate(value:SevenDayTaskUpdate_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = SevenActivityModel.Ins.taskList.findIndex(ele=>ele.id == value.datalist[i].id);
            if(index != -1){
                SevenActivityModel.Ins.taskList[index] = value.datalist[i];
            }
        }
        this.onMainViewInit();
        SevenActivityModel.Ins.event(SevenActivityModel.UPDATE_DATA);
    }

    private SevenDayBigRewardUpdate(value:SevenDayBigRewardUpdate_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = SevenActivityModel.Ins.bigRewardList.findIndex(ele=>ele.id == value.datalist[i].id);
            if(index != -1){
                SevenActivityModel.Ins.bigRewardList[index] = value.datalist[i];
            }
        }
        this.onMainViewInit();
        SevenActivityModel.Ins.event(SevenActivityModel.UPDATE_DATA);
    }
}