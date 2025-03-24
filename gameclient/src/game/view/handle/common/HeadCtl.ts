import { ui } from "../../../../ui/layaMaxUI";
import { MainModel } from "../main/model/MainModel";
import { t_Head_Image } from "../roleinfo/proxy/t_Head_Image";

export class HeadCtl{
    protected _ui:ui.views.common.ui_headCtlUI;

    constructor(skin:ui.views.common.ui_headCtlUI){
        this._ui = skin;
        this._ui.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this._ui.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){
        
    }

    private onUnDisplay(){
        
    }

    public setData(headUrl:string,HeadFrame:number){
        MainModel.Ins.setTTHead(this._ui.img_icon,headUrl);

        let cfg =  t_Head_Image.Ins.getCfgByIdAndType(HeadFrame,2);
        if(cfg){
            this._ui.img_k.skin = t_Head_Image.Ins.getIconKSkin(cfg.f_imageID);
        }
    }
}