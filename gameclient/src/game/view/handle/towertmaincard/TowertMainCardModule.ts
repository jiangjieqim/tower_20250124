import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { FCardInit_revc, FCardChange_revc, FCardPlanChange_revc, FCardChangePlan_revc, FCardGuaranteChange_revc, FCardExtract_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { TowertMainCardModel } from "./model/TowertMainCardModel";
import { TowertMainCardTip } from "./view/TowertMainCardTip";
import { TowertMainCardTip1 } from "./view/TowertMainCardTip1";
import { TowertMainCardView1 } from "./view/TowertMainCardView1";
import { TowertMainCardView2 } from "./view/TowertMainCardView2";
import { CardCQView } from "./view/cardcq/CardCQView";
import { CardCQView1 } from "./view/cardcq/CardCQView1";
import { CardCQView2 } from "./view/cardcq/CardCQView2";

export class TowertMainCardModule extends BaseModel{
    private static _ins:TowertMainCardModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new TowertMainCardModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(): void {
        this.Reg(new TowertMainCardView1(EViewType.TowertMainCardView1));
        this.Reg(new TowertMainCardView2(EViewType.TowertMainCardView2));
        this.Reg(new TowertMainCardTip(EViewType.TowertMainCardTip));
        this.Reg(new TowertMainCardTip1(EViewType.TowertMainCardTip1));
        this.Reg(new CardCQView(EViewType.CardCQView));
        this.Reg(new CardCQView1(EViewType.CardCQView1));
        this.Reg(new CardCQView2(EViewType.CardCQView2));

        E.MsgMgr.AddMsg(SERVER_MSGID.FCardInit,this.FCardInit);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardChange,this.FCardChange);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardPlanChange,this.FCardPlanChange);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardChangePlan,this.FCardChangePlan);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardGuaranteChange,this.FCardGuaranteChange);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardExtract,this.FCardExtract);
    }

    private FCardInit(value:FCardInit_revc){
        TowertMainCardModel.Ins.cardList = value.cards;
        TowertMainCardModel.Ins.cardPlanList = value.cardPlans;
        TowertMainCardModel.Ins.planId = value.planId;
        TowertMainCardModel.Ins.newList = [];
        TowertMainCardModel.Ins.cardGuaranteList = value.guaranteList;
    }

    private FCardChange(value:FCardChange_revc){
        for(let i:number=0;i<value.cards.length;i++){
            let index = TowertMainCardModel.Ins.cardList.findIndex(ele=>ele.id == value.cards[i].id);
            if(index == -1){
                let obj: any = {};
                obj.id = value.cards[i].id;
                obj.isSelect = false;
                TowertMainCardModel.Ins.newList.push(obj);
            }
        }
        TowertMainCardModel.Ins.cardList = value.cards;
        TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_CARD);
    }

    private FCardPlanChange(value:FCardPlanChange_revc){
        TowertMainCardModel.Ins.planId = value.planId;
        TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_PLANID);
    }

    private FCardChangePlan(value:FCardChangePlan_revc){
        for(let i:number=0;i<value.cards.length;i++){
            let index = TowertMainCardModel.Ins.cardPlanList.findIndex(ele => ele.id === value.cards[i].id);
            TowertMainCardModel.Ins.cardPlanList[index] = value.cards[i];
        }
        TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_PLAN);
    }

    private FCardGuaranteChange(value:FCardGuaranteChange_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowertMainCardModel.Ins.cardGuaranteList.findIndex(ele => ele.packageid === value.datalist[i].packageid);
            if(index != -1){
                TowertMainCardModel.Ins.cardGuaranteList[index] = value.datalist[i];
            }
        }
    }

    private FCardExtract(value:FCardExtract_revc){
        TowertMainCardModel.Ins.cqKBId = value.packageid;
        if (E.ViewMgr.isOpenReg(EViewType.CardCQView2)) {
            (E.ViewMgr.Get(EViewType.CardCQView2) as CardCQView2).updateView(value.cards);
        }else{
            E.ViewMgr.Open(EViewType.CardCQView2,null,value.cards);
        }
        TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_CQLIST);
    }
}