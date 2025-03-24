// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { DotManager } from "../../../common/DotManager";
import { FunctionModel } from "../../../funs/FunctionModel";
import { FuncProxy } from "../../../funs/proxy/FunctionProxy";
import { TowerMainEvent } from "../../model/TowerMainEvent";

export class SetIconItem extends ui.views.main.ui_setIconUI{
    constructor(){
        super();
        ButtonCtl.CreateBtn(this.img, this, this.onClick);
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    protected onDisplay() {
        FunctionModel.Ins.on(TowerMainEvent.FuncSmallIconUpdate,this,this.onRedUpdate);
    }

    protected onUnDisplay(){
        FunctionModel.Ins.off(TowerMainEvent.FuncSmallIconUpdate,this,this.onRedUpdate);
    }

    private onClick(){
        if(!this._data)return;
        E.ViewMgr.OpenByFuncid(this._data.f_funid);
    }

    private _data:Configs.t_MainIcon_dat;
    public setData(value:Configs.t_MainIcon_dat){
        if(!value)return;
        this._data = value;
        let cfg = FuncProxy.Ins.getCfgByFuncId(value.f_funid);
        this.img.skin = `o/mainicon/${value.f_icon}`;
        this.lab.text = cfg.f_name;
        this.onRedUpdate();
    }

    protected onRedUpdate() {
        if(!this._data)return;
        if(FunctionModel.Ins.getHasRed(this._data.f_funid)){
            DotManager.addDot(this,10);
        }else{
            DotManager.removeDot(this);
        }
    }
}