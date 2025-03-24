import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../../common/defines/EnumDefine";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { IconUtils } from "../../../main/model/IconUtils";
import { LinBaoCQCtl } from "./LinBaoCQCtl";

export class LinBaoCQView1 extends ViewBase{
    private _ui:ui.views.linbaocq.ui_linbaoCQView1UI;

    public PageType: EPageType = EPageType.None;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _succeed:SimpleEffect;
    private _ctl:LinBaoCQCtl;
    private _tw:Laya.Tween;

    protected onAddLoadRes(): void {
        this.addAtlas('linbaocq.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.linbaocq.ui_linbaoCQView1UI();
            this._ctl = new LinBaoCQCtl(this._ui.view);
            this._tw = new Laya.Tween;
        }
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
        this._ui.view.anchorX = this._ui.view.anchorY = 0.5;
        this._ui.view.scaleX = this._ui.view.scaleY = 0.5;
        this._ui.view.x = this._ui.view.x + this._ui.view.width * 0.5;
        this._ui.view.y = this._ui.view.y + this._ui.view.height * 0.5;
        this._ctl.setData(data);
        
        this._tw.to(this._ui.view, { scaleX: 1, scaleY: 1 }, 250, null, new Laya.Handler(this, this.playTween));
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