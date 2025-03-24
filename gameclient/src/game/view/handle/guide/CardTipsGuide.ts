import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { E } from "../../../G";
import { EAvatarDir } from "../avatar/AvatarView";
import { FightFactory } from "../compose/FightFactory";
import { HeroAvatarView } from "../compose/views/HeroAvatarView";
import { IconUtils } from "../main/model/IconUtils";
import { t_Function_Card } from "../towertmaincard/proxy/t_Function_Card";
import { GuideModel, IGuideCardShow } from "./GuideModel";
/**新手引导卡牌预览 */
export class CardTipsGuide extends ViewBase{
    private _curData:IGuideCardShow;
    // protected mHitFull:boolean = true;
    // protected mMaskClick:boolean = false;
    protected mMask:boolean = true;
    private _ui:ui.views.card.ui_cardTip_guideUI;
    // protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    // private closeBtn:ButtonCtl;
    private _anim1:HeroAvatarView;
    // private cardList:number[] = [];
    private _data:Configs.t_Function_Card_dat;

    protected onAddLoadRes() {
        this.addAtlas("card.atlas");
    }

    protected onMaskClick(e:Laya.Event){
        this.onClickAnyArea();
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.card.ui_cardTip_guideUI;
            this._ui.on(Laya.Event.CLICK,this,this.onClickAnyArea);
            // this.bindClose(this._ui.btn_close);
            //this.closeBtn = ButtonCtl.CreateBtn(this._ui.btn_close,this,this.Close,undefined,undefined,true);
            this._ui.btn_close.on(Laya.Event.CLICK,this,this.Close);
        }
    }

    private onClickAnyArea(){
        // LogSys.Log(Math.random()+"...");
        this.showNextCard();
    }

    protected onInit(): void {
        this._curData = this.Data;
        // this.cardList = 
        this.disposeHero();
        this._anim1 = FightFactory.createBigHeroAvatar(24, this._ui.sp,0,10);
        this._anim1.dir = EAvatarDir.Right;

        this.showNextCard();
    }

    private showNextCard(){
        if(this._curData.cardList.length){
            let cardId:number = this._curData.cardList.shift();
            let list:Configs.t_Function_Card_dat[] = t_Function_Card.Ins.List;
            let cfg = list.find(o=>o.f_cardid == cardId);
            this._data = cfg;
            this.updateView();
        }else{
            this.Close();
        }
    }

    protected onExit(): void {
        // if(this._curData.nextStep){
        //     GuideModel.Ins.nextGuideStep();
        // }
        this._curData.cardList = [];
        this.disposeHero();
        // if(this.closeBtn){
        //     this.closeBtn.dispose();
        //     this.closeBtn = null;
        // }
    }

    private disposeHero() {
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
    }

    private updateView(){
        this._ui.lab1.text = this._data.f_card_name;
        // this._ui.icon.skin = t_Function_Card.Ins.getIconById(this._data.f_card_imageid);
        // this._ui.qua.skin = t_Function_Card.Ins.getQuaSkin(this._data.f_qua);
        this._ui.icon.cfg = t_Function_Card.Ins.getCfgById(this._data.f_cardid);
        let arr = this._data.f_card_price.split("-");
        let id = parseInt(arr[0]);
        let num = parseInt(arr[1]);
        this._ui.icon1.skin = IconUtils.getIconByCfgId(id);
        this._ui.lab.text = num + "";
        this._ui.lab2.text = (this._data.f_card_Cooldown / 1000).toFixed(1);
        this._ui.lab3.text = this._data.f_card_des;
        this._ui.lab4.text = E.getLang("cardtips1");
        // E.getLang("getway") + this._data.f_source;

        if(this._data.f_label == 1){
            this._ui.img.skin = "";
        }else{
            this._ui.img.skin = t_Function_Card.Ins.getLabSkin(this._data.f_label);
        }

       this.setUI();
    }

    private setUI(){
        let labH = this._ui.lab3.textField.textHeight;
        let hh = labH - 95;
        if(hh > 0){
            let hhh = hh + 2;
            this._ui.height += hhh;
            this._ui.bg.height += hhh;
            this._ui.sp.y += hhh;
            this._ui.lab4.y += hhh;
            // this._ui.sp111.y += hhh;
        }
    }
}