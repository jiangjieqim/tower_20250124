import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { FunctionModel } from "../../funs/FunctionModel";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { EFuncDef } from "../model/EFuncDef";
import { IconUtils } from "../model/IconUtils";
import { MainModel } from "../model/MainModel";
import { ECellType } from "../vos/ECellType";
import { System_RefreshTimeProxy } from "./System_RefreshTimeProxy";

export class ValCtl {
    clickHandler:Laya.Handler;
    private tf: Laya.Label;
    private type: ECellType;
    private img: Laya.Image;
    private _addImg:Laya.Image;
    private _isClick:boolean;

    public static Create(tf: Laya.Label, img: Laya.Image, type: number,addImg:Laya.Image,isClick:boolean = true) {
        let ctl = new ValCtl(tf, img ,addImg,isClick);
        ctl.setType(type);
        return ctl;
    }

    constructor(tf: Laya.Label, img: Laya.Image,addImg:Laya.Image,isClick:boolean) {
        this.tf = tf;
        this.img = img;
        this._addImg = addImg;
        this._isClick = isClick;
       
        this.tf.on(Laya.Event.DISPLAY, this, this.onDisplay);
        this.tf.on(Laya.Event.UNDISPLAY, this, this.onUnDisplay);
        this.tf.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick(){
        if(this._isClick){
            if(this.clickHandler){
                this.clickHandler.run();
            }
            if(this.type == ECellType.TILI){
                E.ViewMgr.Open(EViewType.TiLiView);
            }else{
                if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.Shop,false)){
                    TowerMainModel.Ins.event(TowerMainEvent.UPDATE_BBTN_CLICK,[0,this.type]);
                }
            }
        }
    }

    private onDisplay() {
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell,this,this.onUpdateView);
        this.onUpdateView(this.type);
    }

    private onUnDisplay() {
        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell, this, this.onUpdateView);
    }

    private onUpdateView(id: number) {
        if (id == this.type) {
            let img = this.img;
            if (img) {
                img.skin = IconUtils.getIconByCfgId(this.type);
            }
            this._addImg.visible = this._isClick;
            if(this.type == ECellType.TILI){
                let val = MainModel.Ins.mRoleData.getVal(this.type);
                this.tf.text = StringUtil.val2m(val) + "/" + parseInt(System_RefreshTimeProxy.Ins.getVal(62));
            }else{
                let val = MainModel.Ins.mRoleData.getVal(this.type);
                this.tf.text = StringUtil.val2m(val);
            }
        }
    }
    public setType(type: ECellType) {
        this.type = type;
        this.onUpdateView(type);
    }
}