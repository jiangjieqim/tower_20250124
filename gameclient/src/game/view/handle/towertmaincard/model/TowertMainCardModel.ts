import { E } from "../../../../G";
import { EMsgBoxType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FCardExtract_req, FCardMove_req, stFCard, stFCardGuarante, stFCardPlan } from "../../../../network/protocols/BaseProto";
import { IMsgBoxParms } from "../../common/MsgBoxView2";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { MainModel } from "../../main/model/MainModel";
import { t_Arena } from "../proxy/t_Arena";

export class TowertMainCardModel extends Laya.EventDispatcher{
    private static _ins:TowertMainCardModel;
    public static get Ins(){
        if(!this._ins){
            this._ins = new TowertMainCardModel();
        }
        return this._ins;
    }

    public static UPDATE_CARD:string = "UPDATE_CARD";
    public static UPDATE_PLANID:string = "UPDATE_PLANID";
    public static UPDATE_PLAN:string = "UPDATE_PLAN";
    public static UPDATE_SELECT:string = "UPDATE_SELECT";
    public static UPDATE_CQLIST:string = "UPDATE_CQLIST";
    public static UPDATE_AUTO:string = "UPDATE_AUTO";

    public static CQYD1:string = "CQYD1";
    public static CQYD2:string = "CQYD2";

    public cardList:stFCard[];
    public cardPlanList:stFCardPlan[];
    public planId:number;
    public newList:any;
    public selectList:any[];
    public isPeiZhi:boolean;

    public selectKBId:number;
    public cardGuaranteList:stFCardGuarante[];
    public cqKBId:number;
    public cqAuto:boolean;
    public cqTG:boolean;
    public isPlayEnd:boolean;
    public isYD:boolean;

    constructor(){
        super();
        this.cardList = [];
        this.cardPlanList = [];
        this.newList = [];
        this.cqAuto = false;
        this.cqTG = false;
        this.isYD = false;
    }

    public getCardById(id:number){
        return this.cardList.find(ele => ele.id === id);
    }

    public getNowCardPlanData(){
        let vo= this.cardPlanList.find(ele => ele.id === this.planId);
        if(vo){
            return vo.cards;
        }
        return [];
    }

    public getPlanCount(){
        let num = 0;
        let arr = this.getNowCardPlanData();
        for(let i:number=0;i<arr.length;i++){
            num += arr[i].num;
        }
        return num;
    }

    public isCardEnough(){
        let cfg = t_Arena.Ins.getCfgByTrophy(MainModel.Ins.mRoleData.trophy)
        if(TowertMainCardModel.Ins.getPlanCount() >= cfg.f_card_max_amount){
            return true;
        }
        return false;
    }

    public showCardBox(type:number) {
        let param: IMsgBoxParms = {} as IMsgBoxParms;
        param.bHideCloseBtn = true;
        param.disableMaskClick = true;
        param.okLabel = "一键携带";
        E.ViewMgr.ShowMsgBox(EMsgBoxType.OkOrCancel, `卡牌携带不足，是否一键携带`, new Laya.Handler(this, this.sendCard,[type]), null, null, param);
    }

    private sendCard(type:number) {
        TowertMainCardModel.Ins.sendCmd(1, 0, type);
    }

    public isCardRedTip(){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.FunCard,false)){
            return false;
        }
        if(this.isNewRedTip()){
            return true;
        }
        return false;
    }

    public isNewRedTip(){
        for(let i:number=0;i<this.newList.length;i++){
            if(this.newList[i].isSelect == false){
                return true;
            }
        }
        return false;
    }

    public sendCmd(action:number,id:number,toFight:number=0){
        let req = new FCardMove_req;
        req.planId = this.planId;
        req.action = action;
        req.fCardId = id;
        req.toFight = toFight;
        SocketMgr.Ins.SendMessageBin(req);
    }

    public sendCQCmd(id:number){
        let req = new FCardExtract_req;
        req.packageid = id;
        SocketMgr.Ins.SendMessageBin(req);
    }
}