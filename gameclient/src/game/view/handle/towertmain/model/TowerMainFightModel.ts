import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { BoxHandle_req, FriendsRoomJoin_req, FriendsRoom_req, FuncPopup_req, stBox, stBoxReward, stCareer, stCellValue, stCellValueConvert, stCommonReward, stCommonTimes, stFirstPassRewardCoop, stFuncPopup, stGodRoad, stMainTask, stNewInvite, stPSCnt, stPvPUnlockTask } from "../../../../network/protocols/BaseProto";
import { t_Battle_Config } from "../../compose/t_Battle_Config";
import { DianYuModel } from "../../dianyu/model/DianYuModel";
import { FriendModel } from "../../friend/model/FriendModel";
import { FunctionModel } from "../../funs/FunctionModel";
import { FuncProxy } from "../../funs/proxy/FunctionProxy";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { EFuncDef } from "../../main/model/EFuncDef";
import { MainModel } from "../../main/model/MainModel";
import { ECellType } from "../../main/vos/ECellType";
import { RoleInfoModel } from "../../roleinfo/model/RoleInfoModel";
import { t_Func_Popup } from "../proxy/t_Func_Popup";
import { t_Medal } from "../proxy/t_Medal";

export class TowerMainFightModel extends Laya.EventDispatcher{
    private static _ins: TowerMainFightModel;

    public static UPDATE_BOX:string = "UPDATE_BOX";
    public static UPDATE_FRIEND_REWARD:string = "UPDATE_FRIEND_REWARD";
    public static TROPHY_REWARD:string = "TROPHY_REWARD";
    public static FUN_POP_DATE:string = "FUN_POP_DATE";
    public static GODROAD_DATE:string = "GODROAD_DATE";
    public static TILI_DATE:string = "TILI_DATE";
    public static todaySpirit:string = "todaySpirit";
    public static UPDATE_PVP:string = "UPDATE_PVP";
    public static PVP_LOCK:string = "PVP_LOCK";
    public static UPDATE_INVITE:string = "UPDATE_INVITE";
    public static UPDATE_TASK:string = "UPDATE_TASK";
    public static UPDATE_Lottery:string = "UPDATE_Lottery";
    public static UPDATE_CHAT:string = "UPDATE_CHAT";

    public static get Ins() {
        if (!this._ins) {
            this._ins = new TowerMainFightModel();
        }
        return this._ins;
    } 

    public boxIndex:number;
    public boxList:stBox[];
    public boxRewList:stCellValueConvert[];
    public boxTempList:stBoxReward[];
    public heroList:stCellValueConvert[];
    public rewardList:stCellValue[];

    public wxFriendRoomId:string;
    public friendRoomId:string;
    public friendRewardList:stCommonTimes[];
    public friendInputText:string;

    public trophyRewardList:stCommonReward[];

    public funcPopupList:stFuncPopup[];
    public _isTapTL:boolean;

    public godRoadList:stGodRoad[];

    public pSCntList:stPSCnt[];
    public nextRecorverUnix:number;
    public secToFullPS:number;

    public loginDay:number;

    public lvList:number[];

    public isPvp:number;
    public pvpUnlockTask:stPvPUnlockTask[];
    public pvpReward:number[];

    public canInvite:number;
    public newInvite:stNewInvite[];
    public firstPassRewardCoop:stFirstPassRewardCoop[];
    public isInvite:boolean;

    public isChatRed:number;

    public mainTask:stMainTask;

    constructor(){
        super();
        this.initData();
    }

    public initData(){
        this.wxFriendRoomId = "";
        this.friendRoomId = "";
        this.friendInputText = "";
        this.boxIndex = 0;
        this.boxList = [];
        this.friendRewardList = [];

        this.boxTempList = [];
        this.heroList = [];
        this.rewardList = [];

        this.trophyRewardList = [];
        this.funcPopupList = [];
        this._isTapTL = false;

        this.godRoadList = [];
        this.pSCntList = [];

        this.lvList = [];

        this.isPvp = 0;
        this.pvpUnlockTask = [];
        this.pvpReward = [];

        this.isShowDWTS = false;

        this.canInvite = 1;
        this.newInvite = [];
        this.firstPassRewardCoop = [];
        this.isInvite = false;

        this.isChatRed = 0;
    }

    public isFightRedTip(){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.Fight,false)){
            return false;
        }
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.TuWeiZhan,false)){
            return false;
        }
        if(this.isFunRedTip() || this.isTrophyRedTip()){
            return true;
        }
        // if(ChengHaoModel.Ins.isRedTip()){
        //     return true;
        // }
        if(this.isPvpRedTip()){
            return true;
        }
        if(this.isRedTipPve()){
            return true;
        }
        if(FriendModel.Ins.isRedTip()){
            return true;
        }
        if(this.isChatRedTip()){
            return true;
        }
        if(DianYuModel.Ins.isRedTip()){
            return true;
        }
        if(this.isZSBZRedTip()){
            return true;
        }
        return false;
    }

    public isChatRedTip(){
        return this.isChatRed;
    }

    private isFunRedTip(){
        let arr = FuncProxy.Ins.fightFunMap;
        for(let i:number=0;i<arr.length;i++){
            if(FunctionModel.Ins.getHasRed(arr[i])){
                return true;
            } 
        }
        return false;
    }

    public isSetRedTip(){
        let arr = FuncProxy.Ins.setFunMap;
        for(let i:number=0;i<arr.length;i++){
            if(FunctionModel.Ins.getHasRed(arr[i])){
                return true;
            } 
        }
        return false;
    }

    public isFriendRewardRedTip(){
        for(let i:number=0;i<this.friendRewardList.length;i++){
            if(this.friendRewardList[i].times == 1){
                return true;
            }
        }
        return false;
    }

    public isTrophyRedTip(){
        if(this.isTrophyViewRedTip() || this.isGodRoadRedTip()){
            return true;
        }
        return false;
    }

    public isTrophyViewRedTip(){
        for(let i:number=0;i<this.trophyRewardList.length;i++){
            if(this.trophyRewardList[i].state == 1){
                return true;
            }
        }
        return false;
    }

    public sendCmd(action:number,pos:number){
        let req = new BoxHandle_req;
        req.pos = pos;
        req.action = action;
        SocketMgr.Ins.SendMessageBin(req);
    }

    public sendFriendCmd(flag:number,roomSn:string){
        let req = new FriendsRoomJoin_req;
        req.flag = flag;
        req.roomSn = roomSn;
        SocketMgr.Ins.SendMessageBin(req);
    }

    public sendRoom(flag:number,type:number){
        let req = new FriendsRoom_req;
        req.flag = flag;
        req.mode = type;
        SocketMgr.Ins.SendMessageBin(req);
    }

    isItemEnoughSt:Function;
    public isTiLiEnough(){
        let st = t_Battle_Config.Ins.getValueById(47);
        if (this.isItemEnoughSt != undefined && !this.isItemEnoughSt(st)) {
            E.ViewMgr.Open(EViewType.TiLiView);
            return false;
        }
        return true;
    }

    private openCallLater(data:stFuncPopup,value:Configs.t_Func_Popup_dat){
        if(value.f_activity){
            E.ViewMgr.Open(value.f_viewtype,null,value.f_activity);
        }else{
            E.ViewMgr.Open(value.f_viewtype);
        }
        
        data.exist = 1;

        if(Laya.Utils.getQueryString("disable_save_pop_view")){

        }else{
            let req = new FuncPopup_req;
            req.datalist = [data.funcId];
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    public popView(){
        let arr = t_Func_Popup.Ins.List;
        arr.sort(this.onSort);
        for(let i:number=0;i<arr.length;i++){
            if(FunctionModel.Ins.isOpenByFuncId(arr[i].f_func_id,false)){
                let data = TowerMainFightModel.Ins.funcPopupList.find(ele=>ele.funcId == arr[i].f_func_id);
                if(data && data.exist == 0){
                    this.openCallLater(data,arr[i]);
                    return;
                }
            }
        }
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.TapTap,false)){
            if(this._isTapTL == false){
                this._isTapTL = true;
                E.ViewMgr.OpenByFuncid(EFuncDef.TapTap,false);
            }
        }
    }

    private onSort(a:Configs.t_Func_Popup_dat,b:Configs.t_Func_Popup_dat){
        return a.f_sort - b.f_sort;
    }

    public isGodRoadRedTip(){
        for(let i:number=0;i<this.godRoadList.length;i++){
            if(this.godRoadList[i].status == 1){
                return true;
            }
        }
        return false;
    }

    public isPvpRedTip(){
        // if(this.isPvp)return false;
        // let arr = t_Pvp_Unlock_Condition.Ins.List;
        // for(let i:number=0;i<arr.length;i++){
        //     let index = this.pvpReward.findIndex(ele=>ele == arr[i].f_id);
        //     if(index == -1){
        //         if(arr[i].f_task_type == 29){
        //             if(MainModel.Ins.isNewPvpGuideComplete){
        //                 return true;
        //             }
        //         }else{
        //             let vo = this.pvpUnlockTask.find(ele=>ele.taskType == arr[i].f_task_type);
        //             if(vo){
        //                 if(vo.val >= arr[i].f_task_amount){
        //                     return true;
        //                 }
        //             }
        //         }
        //     }
        // }
        return false;
    }

    private _dwNum:number;
    public setDWNum(arr:stCareer[]){
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].flag == 1){
               this._dwNum = arr[i].times;
               break;
            }
        }
    }

    public isShowDWTS:boolean;
    public showDWTS(){
        let trophy = RoleInfoModel.Ins.getMaxTrophy(); 
        if(this._dwNum != trophy){
            let cfg = t_Medal.Ins.getCfgByTr(this._dwNum);
            let ncfg = t_Medal.Ins.getCfgByTr(trophy);
            if(cfg.f_id != ncfg.f_id){
                this.isShowDWTS = true;
            }
            this._dwNum = trophy;
        }
    }

    public isRedTipPve(){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.TuWeiZhan,false)){
            return false;
        }
        for(let i:number=0;i<this.newInvite.length;i++){
            if(this.newInvite[i].status == 1){
                return true;
            }
        }
        for(let i:number=0;i<this.firstPassRewardCoop.length;i++){
            if(this.firstPassRewardCoop[i].status == 1){
                return true;
            }
        }
        return false;
    }

    public isZSBZRedTip(){
        let arr = System_RefreshTimeProxy.Ins.getVal(101).split("|");
        let val = MainModel.Ins.mRoleData.getVal(ECellType.ZSBZ);
        let count = parseInt(arr[0].split("-")[1]);
        if(val >= count){
            return true;
        }
        return false;
    }
}