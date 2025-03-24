import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EAvatarDir } from "../../avatar/AvatarView";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { IconUtils } from "../../main/model/IconUtils";
import { t_Function_Card } from "../proxy/t_Function_Card";

export class TowertMainCardTip1 extends ViewBase{
    private _ui:ui.views.card.ui_cardTip1UI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _anim1:HeroAvatarView;

    protected onAddLoadRes() {
        this.addAtlas("card.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.card.ui_cardTip1UI;
        }
    }

    private _data:Configs.t_Function_Card_dat;
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
        this._ui.lab1.text = this._data.f_card_name;
        // this._ui.icon.skin = t_Function_Card.Ins.getIconById(this._data.f_card_imageid);
        // this._ui.qua.skin = t_Function_Card.Ins.getQuaSkin(this._data.f_qua);
        let cfg = t_Function_Card.Ins.getCfgById(this._data.f_cardid);
        this._ui.icon.cfg = cfg;

        let arr = this._data.f_card_price.split("-");
        let id = parseInt(arr[0]);
        let num = parseInt(arr[1]);
        this._ui.icon1.skin = IconUtils.getIconByCfgId(id);
        this._ui.lab.text = num + "";
        this._ui.lab2.text = (this._data.f_card_Cooldown / 1000).toFixed(1);
        this._ui.lab3.text = this._data.f_card_des;
        this._ui.lab4.text = E.getLang("getway") + this._data.f_source;

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
            this._ui.sp111.y += hhh;
        }
    }
}