import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EPageType } from "../../../common/defines/EnumDefine";
import { IconUtils } from "../main/model/IconUtils";
import { ECellType } from "../main/vos/ECellType";
import { t_Box_Match } from "../towertmain/proxy/t_Box_Match";
import { t_Box_Reward_Rate } from "../towertmain/proxy/t_Box_Reward_Rate";

export class BoxTip extends ViewBase{
    public PageType: EPageType = EPageType.None;
    private _ui: ui.views.common.ui_boxTipUI;

    protected onAddLoadRes() {
    }

    protected _tempPos:Laya.Point;
    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.common.ui_boxTipUI();
        }
    }

    protected onInit(): void {
        if(!this.Data)return;
        Laya.stage.on(Laya.Event.CLICK,this,this.onStageClick);
        this.updateView();
    }

    protected onExit(): void {
        Laya.stage.off(Laya.Event.CLICK,this,this.onStageClick);
    }

    private onStageClick(e:Laya.Event){
        if(this.IsShow()){
            this.Close();
        }
    }

    private updateView(){
        let cfg = t_Box_Match.Ins.getCfgById(this.Data.id);
        this._ui.img.skin = t_Box_Match.Ins.getSkinLabByQua(cfg.f_box_qua);
        this._ui.icon.skin = IconUtils.getIconByCfgId(ECellType.JINBI);
        this._ui.lab.text = t_Box_Reward_Rate.Ins.getStById(cfg.f_box_id,1);
        this._ui.lab1.text = t_Box_Reward_Rate.Ins.getStById(cfg.f_box_id,2);
        this._ui.lab2.text = cfg.f_text;

        let t = this.Data.target;
        this._tempPos = (t.parent as Laya.Sprite).localToGlobal(new Laya.Point((t as Laya.Sprite).x,(t as Laya.Sprite).y));
        this.SetCenter();
    }

    protected SetCenter(): void {
        if (!this._tempPos) {
            return;
        }

        let xx = this._tempPos.x + this.Data.target.width * 0.5 - this._ui.width * 0.5 + this.Data.offX;
        if(xx < 0){
            xx = 0;
        }
        if (xx + this._ui.width > Laya.stage.width) {
            xx = Laya.stage.width - this._ui.width;
        }
        this._ui.x = xx;
        let xxx = this._tempPos.x + this.Data.target.width * 0.5 - this._ui.jiao.width * 0.5;
        let pos = (this._ui as Laya.Sprite).globalToLocal(new Laya.Point(xxx,this._tempPos.y));
        this._ui.jiao.x = pos.x + this.Data.offX;

        let yy = this._tempPos.y - this._ui.height + this.Data.offY;
        if (yy < 0) {
            this._ui.y = 0;
        } else {
            this._ui.y = yy;
        }
    }
}