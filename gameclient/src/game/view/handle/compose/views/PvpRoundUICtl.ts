import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightUIFactory } from "../FightUIFactory";
import { FightPossessAttrPlayerCtl } from "./cells/FightPossessAttrPlayerCtl";
import { PreBannerView } from "./cells/PreBannerView";
import { IFaceChatVo } from "./FaceChatView";

export class PvpRoundUICtl {
    chatbtn: Laya.Image;
    pre: Laya.Sprite;
    buffCon: Laya.Sprite;
    chatAlgin:string;
    private chatBtnCtl: ButtonCtl;
    private buff:FightPossessAttrPlayerCtl;
    private preBanner:PreBannerView;//预览栏
    private get model(){
        return ComposeModel.Ins;
    }
    onInit() {
        //预览栏====================================================
        this.preBanner = FightUIFactory.createPreBannerSkin(
            [EViewType.FightPossess,EViewType.FightMsgHisShowView],
            ui.views.compose.fightcell.ui_pre_bot_bannerUI,this.pre,0,0,false,"bottom");
        //=========================================================
        this.chatBtnCtl = ButtonCtl.CreateBtn(this.chatbtn, this, this.onOpenChat);
        this.buff = new FightPossessAttrPlayerCtl(this.buffCon);
        this.buff.row = -1;
        this.model.on(ComposeEvent.PvpTurnBasedBuffList,this,this.onPvpTurnBasedBuffList);
        this.onPvpTurnBasedBuffList();
    }

    private onPvpTurnBasedBuffList(){
        this.buff.refreshList(this.model.pvpRoundBuffs);
    }

    private onOpenChat() {
        let vo: IFaceChatVo = {} as IFaceChatVo;
        vo.con = this.chatbtn;
        vo.algin = this.chatAlgin;
        E.ViewMgr.Open(EViewType.FaceChatView, null, vo);
    }
    dispose() {
        this.model.off(ComposeEvent.PvpTurnBasedBuffList,this,this.onPvpTurnBasedBuffList);
        if(this.chatBtnCtl){
            this.chatBtnCtl.dispose();
            this.chatBtnCtl = null;
        }
        if(this.buff){
            this.buff.dispose();
            this.buff = null;
        }
        if(this.preBanner){
            this.preBanner.destory();
            this.preBanner = null;
        }
    }
}