import { ui } from "../../../../../ui/layaMaxUI";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { FuncProxy } from "../../funs/proxy/FunctionProxy";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";

export class TabItem extends ui.views.fuli.ui_tabUI{
    private effect:NoContainerSimpleEffect;

    constructor() {
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){
        FunctionModel.Ins.on(TowerMainEvent.FuncSmallIconUpdate,this,this.onRedUpdate);
    }

    private onUnDisplay(){
        FunctionModel.Ins.off(TowerMainEvent.FuncSmallIconUpdate,this,this.onRedUpdate);
       this.disEff();
    }

    private _data:number;
    public setData(value:number) {
        if (!value) return;
        this._data = value;
        let cfg = FuncProxy.Ins.getCfgByFuncId(value);
        this.lab.text = cfg.f_name;
        this.img.skin = `remote/fuli/icon_${value}.png`;
        if (!this.effect) {
            this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/ICON_TX/ICON_TX`, this.sp, 8, 0);
        }
        this.onRedUpdate();
    }

    private disEff(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }

    protected onRedUpdate() {
        if(!this._data)return;
        if(FunctionModel.Ins.getHasRed(this._data)){
            DotManager.addDot(this,10);
        }else{
            DotManager.removeDot(this);
        }
    }
}