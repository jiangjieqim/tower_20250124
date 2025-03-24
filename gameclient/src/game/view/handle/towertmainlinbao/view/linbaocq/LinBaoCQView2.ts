import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../../common/defines/EnumDefine";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { IconUtils } from "../../../main/model/IconUtils";
import { LinBaoCQCtl } from "./LinBaoCQCtl";

export class LinBaoCQView2 extends ViewBase{
    private _ui:ui.views.linbaocq.ui_linbaoCQView2UI;

    public PageType: EPageType = EPageType.None;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _succeed:SimpleEffect;
    private _tw:Laya.Tween;

    private _ctl1:LinBaoCQCtl;
    private _ctl2:LinBaoCQCtl;
    private _ctl3:LinBaoCQCtl;
    private _ctl4:LinBaoCQCtl;
    private _ctl5:LinBaoCQCtl;
    private _ctl6:LinBaoCQCtl;
    private _ctl7:LinBaoCQCtl;
    private _ctl8:LinBaoCQCtl;
    private _ctl9:LinBaoCQCtl;
    private _ctl10:LinBaoCQCtl;

    protected onAddLoadRes(): void {
        this.addAtlas('linbaocq.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.linbaocq.ui_linbaoCQView2UI();
            this._tw = new Laya.Tween;

            for(let i:number=1;i<11;i++){
                this._ui["view" + i].visible = false;
                this["_ctl" + i] = new LinBaoCQCtl(this._ui["view" + i]);
            }

            this._ui.sp_click.on(Laya.Event.CLICK,this,this.onClick);
        }
    }

    private onClick(){
        this.Close();
    }

    private _arr;
    private _num;
    private _id;
    protected onInit(): void {
        this._ui.sp1.visible = false;
        this._arr = this.Data;
        this._num = 0;
        for(let i:number=0;i<this._arr.length;i++){
            let data = this._arr[i].data;
            if(data.convertedId){
                this._id = data.convertedId;
                this._num += data.convertedNum;
            }
        }
        this.playEff();
        this._index = 1;
        this.playTween();
    }

    protected onExit(): void {
        if(this._succeed){
            this._succeed.dispose();
            this._succeed = null;
        }
        if(this._tw){
            this._tw.clear();
            this._tw = null;
        }
    }

    private _index;
    private playTween() {
        if (this._arr.length == 0) {
            if(this._num){
                this._ui.icon.skin = IconUtils.getIconByCfgId(this._id);
                this._ui.lab1.text = this._num + "";
                this._ui.sp1.visible = true;
            }
            return;
        }

        let data = this._arr.shift();
        let view = this._ui["view" + this._index];
        view.anchorX = view.anchorY = 0.5;
        view.scaleX = view.scaleY = 0.5;
        view.x = view.x + view.width * 0.5;
        view.y = view.y + view.height * 0.5;
        this["_ctl" + this._index].setData(data);
        view.visible = true;

        this._index++;
        this._tw.to(view, { scaleX: 1, scaleY: 1 }, 150, null, new Laya.Handler(this, this.playTween));
    }

    private playEff(){
        if (!this._succeed) {
            this._succeed = new SimpleEffect(this._ui.sp, `o/spine/succeed/wenwuhuode/wenwuhuode`, 322, 20);
        }
        this._succeed.play(0, false, this, this.onPlayEnd);
    }

    private onPlayEnd(){
        this._succeed.play(1,true);
    }
}