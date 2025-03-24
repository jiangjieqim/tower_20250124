// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { stFCard } from "../../../../network/protocols/BaseProto";
import { EAvatarDir } from "../../avatar/AvatarView";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { IconUtils } from "../../main/model/IconUtils";
import { MainModel } from "../../main/model/MainModel";
import { TowertMainCardModel } from "../model/TowertMainCardModel";
import { t_Arena } from "../proxy/t_Arena";
import { t_Function_Card } from "../proxy/t_Function_Card";

export class TowertMainCardTip extends ViewBase{
    private _ui:ui.views.card.ui_cardTipUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _anim1:HeroAvatarView;

    protected onAddLoadRes() {
        this.addAtlas("card.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.card.ui_cardTipUI;

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2, new Laya.Handler(this, this.onBtn2Click)),
                ButtonCtl.Create(this._ui.sp_click, new Laya.Handler(this, this.onSPClick))
            )
        }
    }

    private onBtn1Click(){
        if(!this._data)return;
        TowertMainCardModel.Ins.sendCmd(1,this._data.id);
        this.Close();
    }

    private onBtn2Click(){
        if(!this._data)return;
        TowertMainCardModel.Ins.sendCmd(0,this._data.id);
        this.Close();
    }

    private onSPClick(){
        this.Close();
    }

    private _data:stFCard;
    protected onInit(): void {
        this._data = this.Data;
        this.updateView();
        this.disposeHero();
        this._anim1 = FightFactory.createBigHeroAvatar(24, this._ui.sp,0,10);
        this._anim1.dir = EAvatarDir.Right;
    }

    protected onExit(): void {
        this.disposeHero();
    }

    private disposeHero() {
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
    }

    private updateView(){
        let cfg = t_Function_Card.Ins.getCfgById(this._data.id);
        DebugUtil.drawTF(this._ui,`${this.ViewType}-cardId:${cfg.f_cardid}-tempId:${cfg.f_card__templateid}`,"#ffff00");
        this._ui.lab1.text = cfg.f_card_name;
        
        // this._ui.icon.skin = t_Function_Card.Ins.getIconById(cfg.f_card_imageid);
        // this._ui.qua.skin = t_Function_Card.Ins.getQuaSkin(cfg.f_qua);
        this._ui.icon.cfg = cfg;

        let arr = cfg.f_card_price.split("-");
        let id = parseInt(arr[0]);
        let num = parseInt(arr[1]);
        this._ui.icon1.skin = IconUtils.getIconByCfgId(id);
        this._ui.lab.text = num + "";
        this._ui.lab2.text = (cfg.f_card_Cooldown / 1000).toFixed(1);
        this._ui.lab3.text = cfg.f_card_des;

        let data = TowertMainCardModel.Ins.getCardById(this._data.id);
        this._ui.lab4.text = data.num + "";

        let count = 0;
        let array = TowertMainCardModel.Ins.getNowCardPlanData();
        let vo = array.find(ele => ele.id === this._data.id);
        if(vo){
            count = vo.num;
        }
        this._ui.lab5.text = count + "";
        this._ui.lab6.text = "/" + cfg.f_max_amount;

        this._ui.btn1.disabled = this._ui.btn2.disabled = false;
        if(count == 0){
            this._ui.btn2.disabled = true;
        }
        if(count >= cfg.f_max_amount || count >= data.num){
            this._ui.btn1.disabled = true;
        }

        let num1 = TowertMainCardModel.Ins.getPlanCount();
        let self = t_Arena.Ins.getCfgByTrophy(MainModel.Ins.mRoleData.trophy);
        if(num1 >= self.f_card_max_amount){
            this._ui.btn1.disabled = true;
        }

        if(cfg.f_label == 1){
            this._ui.img.skin = "";
        }else{
            this._ui.img.skin = t_Function_Card.Ins.getLabSkin(cfg.f_label);
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
            this._ui.sp11.y += hhh;
        }

        if(!TowertMainCardModel.Ins.isPeiZhi){
            this._ui.btn1.visible = this._ui.btn2.visible = false;
            this._ui.height -= 82;
        }
    }
}