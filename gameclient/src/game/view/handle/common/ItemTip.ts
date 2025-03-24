import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EPageType } from "../../../common/defines/EnumDefine";
import { MainModel } from "../main/model/MainModel";
import { ItemSlotCtl } from "../main/views/icon/SoltItemView";
import { ItemVo } from "../main/vos/ItemVo";
import { QualitycolorProxy } from "./CommonProxy";

export class ItemTip extends ViewBase{
    public PageType: EPageType = EPageType.None;
    private _ui: ui.views.common.ui_itemTipUI;
    private _itemCtl:ItemSlotCtl;

    protected onAddLoadRes() {
    }

    protected _tempPos:Laya.Point;
    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.common.ui_itemTipUI();

            this._ui.item.mouseEnabled = false;
            this._ui.item.sp.visible = false;
            this._ui.mouseEnabled = true;
            this._itemCtl = new ItemSlotCtl(this._ui.item);
        }
    }

    protected onInit() {
        Laya.stage.on(Laya.Event.CLICK,this,this.onStageClick);
        this.UpdateView();
        this.setData(this.Data.data,this.Data.target);
    }

    protected onExit() {
        Laya.stage.off(Laya.Event.CLICK,this,this.onStageClick);
    }

    private onStageClick(e:Laya.Event){
        if(this.IsShow()){
            this.Close();
        }
    }

    private setData(value: ItemVo,target:Laya.Sprite){
        this._itemCtl.setData(value);
        this._ui.lab_name.text = value.getName();
        this._ui.lab_name.color = "#" + QualitycolorProxy.Ins.getCfgByQua(value.cfg.f_qua).f_color;
        this._ui.lab_name.strokeColor = "#" + QualitycolorProxy.Ins.getCfgByQua(value.cfg.f_qua).f_outline;
        this._ui.lab.text = value.getDesc();
        if(value.cfg.f_block_amount){
            this._ui.lab1.visible = this._ui.lab_num.visible = false;
        }else{
            this._ui.lab1.visible = this._ui.lab_num.visible = true;
            this._ui.lab_num.text = MainModel.Ins.mRoleData.getVal(value.cfgId) + "";
        }

        let pos = (target.parent as Laya.Sprite).localToGlobal(new Laya.Point((target as Laya.Sprite).x,(target as Laya.Sprite).y));
        this._tempPos = pos;
        this.SetCenter();
    }

    protected SetCenter(): void {
        if (!this._tempPos) {
            return;
        }
        let offsetY: number = 0;

        if (this._tempPos.x + this._ui.width > Laya.stage.width) {
            this._tempPos.x = Laya.stage.width - this._ui.width;
        }

        this._ui.x = this._tempPos.x;
        
        let yy = this._tempPos.y - this._ui.height - offsetY;
        if (yy < 0) {
            this._ui.y = 0;
        } else {
            this._ui.y = yy;
        }
    }
}