import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { ShengShouModel } from "../model/ShengShouModel";

export class ShengShouView3 extends ViewBase{
    private _ui:ui.views.shengshou.ui_shengShouView3UI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _timeCtl:TimeCtl;

    protected onAddLoadRes(): void {
        
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_shengShouView3UI();

            this._timeCtl = new TimeCtl(this._ui.lab);
            this._ui.sp.on(Laya.Event.CLICK,this,this.onClick);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click))
            )
        }
    }

    private onClick(){
        this.Close();
    }

    private onBtnClick(){
        E.ViewMgr.Open(EViewType.ShengShouView,null,this.Data);
        this.Close();
    }

    private onBtn1Click(){
        let st = E.getLang("shengshouskin_" + this.Data);
        E.ViewMgr.Open(EViewType.HeroSkinView,null,parseInt(st));
    }

    protected onInit(): void {
        if (!this.Data) {
            Laya.timer.callLater(this, () => {
                this.Close();
            });
            return;
        }
        let data = ShengShouModel.Ins.getRankTimeData(this.Data);
        if(!data){
            Laya.timer.callLater(this, () => {
                this.Close();
            });
            return;
        }
        let time = data.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
        this._ui.img.skin = `static/banner_ss_${this.Data}.png`;
    }

    protected onExit(): void {
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("已结束");
    }
}