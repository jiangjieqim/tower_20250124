import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EMsgBoxType, EViewType } from "../../../common/defines/EnumDefine";
import { FunctionModel } from "../funs/FunctionModel";
import { MainModel } from "../main/model/MainModel";
import { TowerMainEvent } from "./model/TowerMainEvent";
import { TowerMainModel } from "./model/TowerMainModel";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { TowerMainFightModel } from "./model/TowerMainFightModel";
import { ComposeModel } from "../compose/ComposeModel";
import { BoxView } from "./view/BoxView";
import { BoxView1 } from "./view/BoxView1";
import { BoxView2 } from "./view/BoxView2";
import { BoxView3 } from "./view/BoxView3";
import { BagView } from "../bag/bagView";
import { ValChanel_revc, PlayerLevelChange_revc, PlayerCurExpChange_revc, TrophyChange_revc, FuncInit_revc, FuncChange_revc, TimerInit_revc, TimerChange_revc, BoxInit_revc, BoxDel_revc, BoxChange_revc, FCardEnough_revc, BoxHandle_revc, Empty_revc, FriendsRoom_revc, FriendsFightRewardInit_revc, FriendsFightReward_revc, PremiumRewards_revc, TrophyRewardInit_revc, TrophyReward_revc, FuncPopupInit_revc, FuncPopup_revc, FriendRoomExistInit_revc, GodRoadInit_revc, GodRoad_revc, RoomMode_revc, PSInit_revc, PSBuy_req, PSBuy_revc, PSTime_revc, PlayerExInfoInit_revc, LoginDays_revc, TodaySpirit_revc, PvPUnlockInit_revc, PvPUnlockTask_revc, PvPUnlockRewards_revc, PvPUnlock_revc, NewInviteInitOrFresh_revc, NewInvite_revc, FirstPassRewardCoop_revc, MainTaskInit_revc, MainTask_revc, LotteryReward_revc, ChatRed_revc } from "../../../network/protocols/BaseProto";
import { JjcView } from "./view/JjcView";
import { FriendFightView } from "./view/FriendFightView";
import { FriendFightView1 } from "./view/FriendFightView1";
import { ELayerType } from "../../../layer/LayerMgr";
import { ShopBuyView } from "../common/ShopBuyView";
import { TrophyView } from "./view/trophy/TrophyView";
import { TapTapView } from "./view/TapTapView";
import { TrophyView1 } from "./view/trophy/TrophyView1";
import { TiLiView } from "./view/TiLiView";
import { TowertMainCardModel } from "../towertmaincard/model/TowertMainCardModel";
import { LevelView } from "./view/LevelView";
import { TrophyNewView } from "./view/trophy/TrophyNewView";
import { PvpLockView } from "./view/pvp/PvpLockView";
import { DWTSView } from "./view/pvp/DWTSView";
import { TWZView } from "./view/TWZView";
import { TWZView1 } from "./view/TWZView1";
import { MainActivityView } from "./view/mainactivity/MainActivityView";
import { AttrLevelView } from "./view/AttrLevelView";

export class TowertMainModule extends BaseModel{
    private static _ins:TowertMainModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new TowertMainModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{
        TowerMainFightModel.Ins.initData();
    }

    public initMsg(){
        this.Reg(new BagView(EViewType.BagView));
        this.Reg(new BoxView(EViewType.BoxView));
        this.Reg(new BoxView1(EViewType.BoxView1));
        this.Reg(new BoxView2(EViewType.BoxView2));
        this.Reg(new BoxView3(EViewType.BoxView3));
        this.Reg(new JjcView(EViewType.JjcView));
        this.Reg(new FriendFightView(EViewType.FriendFightView));
        this.Reg(new FriendFightView1(EViewType.FriendFightView1));
        this.Reg(new ShopBuyView(EViewType.ShopBuy,ELayerType.subFrameLayer));
        this.Reg(new TrophyView(EViewType.TrophyView));
        this.Reg(new TapTapView(EViewType.TapTapView));
        this.Reg(new TrophyView1(EViewType.TrophyView1));
        this.Reg(new TiLiView(EViewType.TiLiView,ELayerType.subFrameLayer));
        this.Reg(new LevelView(EViewType.LevelView,ELayerType.subFrameLayer));
        this.Reg(new AttrLevelView(EViewType.AttrLevelView,ELayerType.subFrameLayer));
        this.Reg(new TrophyNewView(EViewType.TrophyNewView));
        this.Reg(new PvpLockView(EViewType.PvpLockView));
        this.Reg(new DWTSView(EViewType.DWTSView));
        this.Reg(new TWZView(EViewType.TWZView));
        this.Reg(new TWZView1(EViewType.TWZView1));
        this.Reg(new MainActivityView(EViewType.MainActivityView));

        E.MsgMgr.AddMsg(SERVER_MSGID.ValChanel,this.onValChanel,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PlayerLevelChange, this.PlayerLevelChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PlayerCurExpChange, this.PlayerCurExpChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TrophyChange, this.TrophyChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FuncInit, this.FuncInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FuncChange, this.FuncChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TimerInit, this.TimerInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TimerChange, this.TimerChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.BoxInit, this.BoxInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.BoxDel, this.BoxDel,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.BoxChange, this.BoxChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardEnough, this.FCardEnough,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.BoxHandle, this.BoxHandle,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.Empty, this.Empty,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendsRoom, this.FriendsRoom,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendsFightRewardInit, this.FriendsFightRewardInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendsFightReward, this.FriendsFightReward,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TrophyRewardInit, this.TrophyRewardInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TrophyReward, this.TrophyReward,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FuncPopupInit, this.FuncPopupInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FuncPopup, this.FuncPopup,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendRoomExistInit, this.FriendRoomExistInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.GodRoadInit, this.GodRoadInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.GodRoad, this.GodRoad,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.RoomMode, this.RoomMode,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PSInit, this.PSInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PSBuy, this.PSBuy,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PSTime, this.PSTime,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PlayerExInfoInit, this.PlayerExInfoInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.LoginDays, this.LoginDays,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TodaySpirit, this.TodaySpirit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvPUnlockInit, this.PvPUnlockInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvPUnlockTask, this.PvPUnlockTask,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvPUnlockRewards, this.PvPUnlockRewards,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvPUnlock, this.PvPUnlock,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.NewInviteInitOrFresh, this.NewInviteInitOrFresh,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.NewInvite, this.NewInvite,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FirstPassRewardCoop, this.FirstPassRewardCoop,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MainTaskInit, this.MainTaskInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MainTask, this.MainTask,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.LotteryReward, this.LotteryReward,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ChatRed, this.ChatRed,this);
    }

    //道具变化
    onValChanel(value:ValChanel_revc){
        TowerMainModel.Ins.ValChanel(value);
    }

    //等级变化
    private PlayerLevelChange(value: PlayerLevelChange_revc) {
        TowerMainFightModel.Ins.lvList = [MainModel.Ins.mRoleData.lv, value.level];
        MainModel.Ins.mRoleData.lv = value.level;
        TowerMainModel.Ins.event(TowerMainEvent.UpdateRoleData);
        TowerMainModel.Ins.event(TowerMainEvent.UpdateRoleLv);
    }

    //经验变化
    private PlayerCurExpChange(value:PlayerCurExpChange_revc){
        MainModel.Ins.mRoleData.exp = value.curLevelExp;
        TowerMainModel.Ins.event(TowerMainEvent.UpdateRoleData);
    }

    //奖杯变化
    private TrophyChange(value:TrophyChange_revc){
        MainModel.Ins.mRoleData.trophy = value.trophy;
        TowerMainModel.Ins.event(TowerMainEvent.UpdateRoleData);
    }

    //功能初始化数据
    private FuncInit(value:FuncInit_revc){
        FunctionModel.Ins.funList = value.datalist;
    }

    //功能数据变化
    private FuncChange(value:FuncChange_revc){
        if(value.type == 1){
            FunctionModel.Ins.funList = FunctionModel.Ins.funList.concat(value.datalist);
        }else{
            for(let i:number=0;i<value.datalist.length;i++){
                let index = FunctionModel.Ins.funList.findIndex(ele=>ele == value.datalist[i]);
                if(index != -1){
                    FunctionModel.Ins.funList.splice(index,1);
                }
            }
        }
        TowerMainModel.Ins.event(TowerMainEvent.FunctionChange);
    }

    //定时任务时间数据初始化数据
    private TimerInit(value:TimerInit_revc){
        FunctionModel.Ins.stTimerList = value.datalist;
    }

    //定时任务时间变化或新增
    private TimerChange(value:TimerChange_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = FunctionModel.Ins.stTimerList.findIndex(ele=>ele.category == value.datalist[i].category);
            if(index != -1){
                FunctionModel.Ins.stTimerList[index] = value.datalist[i];
            }else{
                FunctionModel.Ins.stTimerList.push(value.datalist[i]);
            }
        }
        TowerMainModel.Ins.event(TowerMainEvent.StTimerChange);
    }

    //宝箱信息初始化
    private BoxInit(value:BoxInit_revc){
        TowerMainFightModel.Ins.boxList = value.boxes;
    }

    private BoxDel(value:BoxDel_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.boxList.findIndex(ele=>ele.pos == value.datalist[i]);
            if(index != -1){
                TowerMainFightModel.Ins.boxList.splice(index,1);
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_BOX);
    }

    private BoxChange(value:BoxChange_revc){
        if(value.type == 0){
            for(let i:number=0;i<value.boxes.length;i++){
                let index = TowerMainFightModel.Ins.boxList.findIndex(ele=>ele.pos == value.boxes[i].pos);
                if(index != -1){
                    TowerMainFightModel.Ins.boxList[index] = value.boxes[i];
                }
            }
        }else if(value.type == 1){
            TowerMainFightModel.Ins.boxList = TowerMainFightModel.Ins.boxList.concat(value.boxes);
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_BOX);
    }

    private FCardEnough(value:FCardEnough_revc){
        if(value.enough == 1){
            ComposeModel.Ins.startMatch();
        }else if(value.enough == 2){
            TowerMainFightModel.Ins.sendRoom(1,1);
        }else if(value.enough == 3){
            TowerMainFightModel.Ins.sendFriendCmd(1,TowerMainFightModel.Ins.friendInputText);
        }
    }

    private BoxHandle(value:BoxHandle_revc){
        TowerMainFightModel.Ins.boxTempList.push(value.boxReward);
        E.ViewMgr.Open(EViewType.BoxView2);
    }

    private Empty(value:Empty_revc){
        if(value.code == 5){
            E.ViewMgr.Close(EViewType.FriendFightView1);
            Laya.timer.once(1000,this,this.onDelayHandler);
        }else if(value.code == 9){
            E.ViewMgr.ShowMidOk(E.getLang("Empty_revc1"));
        }else if(value.code == 10){
            E.ViewMgr.Close(EViewType.JjcView);
            Laya.timer.once(1000,this,this.onDelayHandler1);
        }else if(value.code == 11){
            E.ViewMgr.Close(EViewType.JjcView);
        }else if(value.code == 12){
            E.ViewMgr.Close(EViewType.JjcView);
        }else if(value.code == 14){
            E.ViewMgr.Close(EViewType.JjcView);
        }
    }

    private onDelayHandler(){
        if(!E.ViewMgr.isOpenReg(EViewType.ComposeMain)){
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,E.getLang("Empty_revc2"));
        }
    }

    private onDelayHandler1(){
        if(!E.ViewMgr.isOpenReg(EViewType.ComposeMain)){
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,E.getLang("Empty_revc3"));
        }
    }

    private FriendsRoom(value:FriendsRoom_revc){
        TowerMainFightModel.Ins.friendRoomId = value.roomSn;
        E.ViewMgr.Close(EViewType.FriendFightView);
        E.ViewMgr.Open(EViewType.FriendFightView1);
        if(TowerMainFightModel.Ins.isInvite){
            TowerMainFightModel.Ins.isInvite = false;
            E.sdk.goShareData('wxFriendRoomId=' + TowerMainFightModel.Ins.friendRoomId);
        }
    }

    private FriendRoomExistInit(value:FriendRoomExistInit_revc){
        if(value.roomSn != ""){
            TowerMainFightModel.Ins.friendRoomId = value.roomSn;
        }
    }

    private FriendsFightRewardInit(value:FriendsFightRewardInit_revc){
        TowerMainFightModel.Ins.friendRewardList = value.datalist;
    }

    private FriendsFightReward(value:FriendsFightReward_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.friendRewardList.findIndex(ele=>ele.flag == value.datalist[i].flag);
            if(index != -1){
                TowerMainFightModel.Ins.friendRewardList[index] = value.datalist[i];
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_FRIEND_REWARD);
    }

    private TrophyRewardInit(value:TrophyRewardInit_revc){
        TowerMainFightModel.Ins.trophyRewardList = value.datalist;
    }

    private TrophyReward(value:TrophyReward_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.trophyRewardList.findIndex(ele=>ele.id == value.datalist[i].id);
            if(index != -1){
                TowerMainFightModel.Ins.trophyRewardList[index] = value.datalist[i];
            }else{
                TowerMainFightModel.Ins.trophyRewardList.push(value.datalist[i]);
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.TROPHY_REWARD);
    }

    private FuncPopupInit(value:FuncPopupInit_revc){
        TowerMainFightModel.Ins.funcPopupList = value.datalist;
    }

    private FuncPopup(value:FuncPopup_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.funcPopupList.findIndex(ele=>ele.funcId == value.datalist[i].funcId);
            if(index != -1){
                TowerMainFightModel.Ins.funcPopupList[index] = value.datalist[i];
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.FUN_POP_DATE);
    }

    private GodRoadInit(value:GodRoadInit_revc){
        TowerMainFightModel.Ins.godRoadList = value.datalist;
    }

    private GodRoad(value:GodRoad_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.godRoadList.findIndex(ele=>ele.id == value.datalist[i].id);
            if(index != -1){
                TowerMainFightModel.Ins.godRoadList[index] = value.datalist[i];
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.GODROAD_DATE);
    }

    private RoomMode(value:RoomMode_revc){
        if(value.mode == 1){
            if(TowertMainCardModel.Ins.isCardEnough()){
                TowerMainFightModel.Ins.sendFriendCmd(1,value.roomSn);
            }else{
                TowerMainFightModel.Ins.friendInputText = value.roomSn;
                TowertMainCardModel.Ins.showCardBox(3);
            }
        }else if(value.mode == 2){
            if(TowerMainFightModel.Ins.isTiLiEnough()){
                TowerMainFightModel.Ins.sendFriendCmd(1,value.roomSn);
            }
        }
    }

    private PSInit(value:PSInit_revc){
        TowerMainFightModel.Ins.pSCntList = value.datalist;
        TowerMainFightModel.Ins.nextRecorverUnix = value.nextRecorverUnix;
        TowerMainFightModel.Ins.secToFullPS = value.secToFullPS;
    }

    private PSBuy(value:PSBuy_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.pSCntList.findIndex(ele=>ele.type == value.datalist[i].type);
            if(index != -1){
                TowerMainFightModel.Ins.pSCntList[index] = value.datalist[i];
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.TILI_DATE);
    }

    private PSTime(value:PSTime_revc){
        TowerMainFightModel.Ins.nextRecorverUnix = value.nextRecorverUnix;
        TowerMainFightModel.Ins.secToFullPS = value.secToFullPS;
        TowerMainFightModel.Ins.event(TowerMainFightModel.TILI_DATE);
    }

    private PlayerExInfoInit(value:PlayerExInfoInit_revc){
        TowerMainFightModel.Ins.loginDay = value.days;
    }

    private LoginDays(value:LoginDays_revc){
        TowerMainFightModel.Ins.loginDay = value.days;
    }

    private TodaySpirit(value:TodaySpirit_revc){
        MainModel.Ins.todaySpirit = value.spirit;
        TowerMainFightModel.Ins.event(TowerMainFightModel.todaySpirit);
    }

    private PvPUnlockInit(value:PvPUnlockInit_revc){
        TowerMainFightModel.Ins.isPvp = value.unlock;
        TowerMainFightModel.Ins.pvpUnlockTask = value.tasks;
        TowerMainFightModel.Ins.pvpReward = value.rewardExistIds;
    }

    private PvPUnlockTask(value:PvPUnlockTask_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.pvpUnlockTask.findIndex(ele=>ele.taskType == value.datalist[i].taskType);
            if(index != -1){
                TowerMainFightModel.Ins.pvpUnlockTask[index] = value.datalist[i];
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_PVP);
    }

    private PvPUnlockRewards(value:PvPUnlockRewards_revc){
        TowerMainFightModel.Ins.pvpReward = value.datalist;
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_PVP);
    }

    private PvPUnlock(value:PvPUnlock_revc){
        TowerMainFightModel.Ins.isPvp = value.unlock;
        TowerMainFightModel.Ins.event(TowerMainFightModel.PVP_LOCK);
    }

    private NewInviteInitOrFresh(value:NewInviteInitOrFresh_revc){
        TowerMainFightModel.Ins.canInvite = value.canInvite;
        TowerMainFightModel.Ins.newInvite = value.datalist;
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_INVITE);
    }

    private NewInvite(value:NewInvite_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.newInvite.findIndex(ele=>ele.pos == value.datalist[i].pos);
            if(index != -1){
                TowerMainFightModel.Ins.newInvite[index] = value.datalist[i];
            }else{
                TowerMainFightModel.Ins.newInvite.push(value.datalist[i]);
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_INVITE);
    }

    private FirstPassRewardCoop(value:FirstPassRewardCoop_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowerMainFightModel.Ins.firstPassRewardCoop.findIndex(ele=>ele.id == value.datalist[i].id);
            if(index != -1){
                TowerMainFightModel.Ins.firstPassRewardCoop[index] = value.datalist[i];
            }
        }
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_INVITE);
    }

    private MainTaskInit(value:MainTaskInit_revc){
        TowerMainFightModel.Ins.mainTask = value.mainTask;
    }

    private MainTask(value:MainTask_revc){
        TowerMainFightModel.Ins.mainTask = value.mainTask;
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_TASK);
    }

    private LotteryReward(value:LotteryReward_revc){
        TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_Lottery,value);
    }

    private ChatRed(value:ChatRed_revc){
        if(value.type == 1){
            TowerMainFightModel.Ins.isChatRed = value.hasRed;
            TowerMainFightModel.Ins.event(TowerMainFightModel.UPDATE_CHAT);
        }
    }
}