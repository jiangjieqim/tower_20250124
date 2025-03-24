// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { FuncCardVo } from "../vos/FuncCardVo";
/**卡牌预览 */
export class FuncCardShow extends ViewBase{
    protected autoFree:boolean = true;
    private clickImgCtl:ButtonCtl;
    private _ui:ui.views.compose.ui_func_card_showUI;
    private _cardVo:FuncCardVo;
    public PageType:EPageType = EPageType.None;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        if(this.clickImgCtl){
            this.clickImgCtl.dispose();
        }
        // Laya.Loader.clearTextureRes(this._ui.bg.skin);
        // Laya.Loader.clearTextureRes(this._ui.bg1.skin);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.compose.ui_func_card_showUI();
            // this.clickImgCtl = ButtonCtl.CreateBtn(this._ui.clickImg,this,this.onClickImg);
        }
    }
    private onClickImg(){
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this.refresh(this.Data);
    }

    refresh(_vo:FuncCardVo){
        this._cardVo = _vo;
        this._ui.nameTf.text = this._ui.name1Tf.text = this._cardVo.cfg.f_card_name;
        this._ui.descTf.text = this._cardVo.cfg.f_card_des;

        let needItem = this._cardVo.needItemVo;
        this._ui.lab_gj.text = needItem.count + "";
        this._ui.moneyIcon.skin = needItem.getIcon();
        this._ui.lab_sd.text = (this._cardVo.cfg.f_card_Cooldown / 1000).toFixed(1);
        this._ui.bg.skin = t_Function_Card.Ins.getIconById(this._cardVo.cfg.f_card_imageid);
    }

    protected SetCenter() {
        this.UI.anchorX = this.UI.anchorY = 0.5;
        this.UI.x = this.ViewParent.width >> 1;
        // this.UI.y = this.ViewParent.height / 2 - (ScreenAdapter.DefaultHeight - this._ui.height) / 2;
        // let offsetY: number = (Laya.stage.height - this._ui.height) / 2;
        this.UI.y  = E.sdk.statusBarHeight+this._ui.height/2;//顶部
    }
}