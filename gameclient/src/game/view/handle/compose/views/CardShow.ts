import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { SpineCoreSkel } from "../../avatar/spine/SpineCoreSkel";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { QualitycolorProxy } from "../../common/CommonProxy";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";

export interface ICardShow{
    playerName:string;
    cardId:number;
}

/**功能卡牌展示 
 * D:\Project1\Art\UI切图-神话塔防\13.战斗内横幅\1.所有横幅示意图
*/
export class CardShow extends ViewBase{
    private _curURL:string;
    private skel: SpineCoreSkel;
    private cfg:Configs.t_Function_Card_dat;
    PageType: EPageType = EPageType.None;
    private _ui:ui.views.compose.banner1.ui_card_showUI;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.clearEffect();
    }

    private clearEffect(){
        this._ui.cardTf.text = "";
        this._ui.playerTf.text = "";
        this._ui.descTf.text = "";
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.compose.banner1.ui_card_showUI();
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this.clearEffect();
        let vo:ICardShow = this.Data;
        let cfg = t_Function_Card.Ins.getCfgById(vo.cardId);
        this.cfg = cfg;

        // this.updateDesc();

        let _curURL:string = t_Function_Card.Ins.getIconById(this.cfg.f_card_imageid);
        this._curURL = _curURL;
        this.playCard();
        // LogSys.Log(`cur url:${_curURL}`)
    }

    private updateDesc(){
        let cfg = this.cfg;
        this._ui.cardTf.text = "【"+cfg.f_card_name+"】";
        this._ui.cardTf.color = "#" + QualitycolorProxy.Ins.getCfgByQua(cfg.f_qua).f_color;

        let vo:ICardShow = this.Data;
        this._ui.playerTf.text = vo.playerName + E.getLang("used");
        this._ui.descTf.text = cfg.f_card_des;

        let w = this._ui.cardTf.textField.width + this._ui.playerTf.textField.width;
        this._ui.playerTf.x = (this._ui.width - w)/2;
        this._ui.cardTf.x = this._ui.playerTf.x + this._ui.playerTf.textField.textWidth;
    }

    private playCard(){
        this.skel = new SpineCoreSkel();
        this.skel.setSlotImg("Card_back",this._curURL);//Card_back Card_front
        //品质框
        this.skel.setSlotImg("Card_back_1",t_Function_Card.Ins.getQuaSkin(this.cfg.f_qua));

        this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        let anim:number = EAvatarAnim.TowerIdle + (this.cfg.f_card_visualeffect - 1);
        this.skel.play(anim, this, this.onPlayEnd, undefined, true);
        this.skel.load(`o/spine/succeed/Card/card.skel`);
    }

    /**显示文本 */
    private onShowLable(e){
        if(e.name == "Show"){
            this.updateDesc();
        }
    }

    private onCompleteHander(){
        if(this.skel && this.skel.skeleton){
            this.skel.skeleton.once(Laya.Event.LABEL,this,this.onShowLable);
            this.skel.skeleton.pos(this._ui.width/2,0);
            this._ui.addChildAt(this.skel.skeleton,1);
        }else{
            LogSys.Error(`yonr this.skel.skeleton is null`)
        }
    }
    private onPlayEnd(){
        this.Close();
    }
    
}