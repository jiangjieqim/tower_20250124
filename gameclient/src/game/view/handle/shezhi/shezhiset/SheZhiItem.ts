// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { FuncProxy } from "../../funs/proxy/FunctionProxy";

export class SheZhiItem extends ui.views.shezhi.ui_iconItemUI{
    constructor(){
        super();
        ButtonCtl.CreateBtn(this.bg, this, this.onClick);
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
    }
}