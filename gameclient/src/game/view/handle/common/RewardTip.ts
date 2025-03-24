import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EPageType } from "../../../common/defines/EnumDefine";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
import { SoltItemView } from "../main/views/icon/SoltItemView";

export class RewardTip extends ViewBase{
    public PageType: EPageType = EPageType.None;
    private _ui: ui.views.common.ui_rewardTipUI;

    protected onAddLoadRes() {
    }

    protected _tempPos:Laya.Point;
    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.common.ui_rewardTipUI();
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
        while(this._ui.sp.numChildren){
            this._ui.sp.removeChildAt(0);
        }
        let w = 96;
        let ofx = 5;
        let arr = ItemViewFactory.convertItemList(this.Data.data);
        for(let i:number=0;i<arr.length;i++){
            let view:SoltItemView = new SoltItemView;
            view.scaleX = view.scaleY = 0.8;
            view.x = i * w + ofx * i;
            view.setData(arr[i],false);
            this._ui.sp.addChild(view);
        }

        this._ui.bg.width = this._ui.sp.x + arr.length * w + (arr.length - 1) * ofx + this._ui.sp.x;
        this._ui.width = this._ui.bg.width;
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