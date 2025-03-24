// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { E } from "../../../../../G";
import { FunctionModel } from "../../../funs/FunctionModel";
import { EFuncDef } from "../../model/EFuncDef";
import { ISDKSkinButton } from "../icon/FuncSmallIcon";
import { DouYinClientCtl } from "./DouYinClientCtl";
// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";

/**设置按钮 */ 
export class SettingBtn extends ButtonCtl {
    protected redImg:Laya.Image;
    funcid:EFuncDef;
    // public funcid:EFuncDef;
    constructor(skin:ILiebiaoSubSkin,url:string="",text:string="",click:Laya.Handler=null) {
        // this._ui.btn_yxq.redimg
        // skin: Laya.Image, redImg: Laya.Image
        super(skin, click);
        skin.bg.skin = url;//"remote/main/main/sz.png";
        skin.tf.text = text//"设置";
        // this.clickHandler = new Laya.Handler(this,this.onClick);
        this.redImg = skin.redimg;

        skin.on(Laya.Event.DISPLAY, this, this.onDisplay);
        skin.on(Laya.Event.UNDISPLAY, this, this.onUnDisplay);
        this.redFlag = false;
    }

    protected onDisplay() {
        DebugUtil.drawTF(this.skin,this.funcid+"");
    }
    protected onUnDisplay() {
    }

    set redFlag(v:boolean){
        this.redImg.visible = v;
    }
    get isOpen(){
        if(this.funcid){
            return FunctionModel.Ins.isOpenByFuncId(this.funcid);
        }
        return true;
    }
    public updateRed() {

    }
}
export interface ILiebiaoSubSkin extends Laya.Sprite {
    bg: Laya.Image;
    redimg: Laya.Image;
    tf: Laya.Label;
}
// /**基础按钮 */
// export class LeftSmallFuncIcon extends SettingBtn{
//     protected funcID:EFuncDef;
//     private cfg:Configs.func_dat;
//     constructor(skin:ILiebiaoSubSkin,funcID:EFuncDef){
//         super(skin);
//         this.funcID = funcID;
//         this.cfg = FuncProxy.Ins.getCfgByFuncId(this.funcID);
//         skin.bg.skin = `remote/main/main/${this.cfg.f_sub_icon}`;
//         skin.tf.text = this.cfg.f_name;
//         skin.redimg.visible = false;
//         this.clickHandler = new Laya.Handler(this,this.onClick);
//     }
//     private onClick(){
//         E.ViewMgr.OpenByFuncid(this.funcID);
//     }

//     get isOpen(){
//         //return TaskModel.Ins.isFuncOpen(this.funcID);
//         return true;
//     }
// }

export class BaseSettingBtn extends SettingBtn{
    constructor(skin,funcId:EFuncDef,icon:string,name:string){   
        // "remote/main/main/yq.png"  
        // StringUtil.IsNullOrEmpty(icon) ? MainModel.Ins.getIconByFuncId(funcId) : icon
        super(skin, icon, name);
        this.funcid = funcId;
        this.clickHandler = new Laya.Handler(this,this.onBtnSZClick);
    }
    private onBtnSZClick(){
        // MainModel.Ins.openFunc(this.funcid);
        E.ViewMgr.OpenByFuncid(this.funcid);
    }
}
export class InsideSettingBtn extends BaseSettingBtn{
    constructor(skin,funcId:EFuncDef,icon:string,name:string){
        super(skin,funcId,icon,name);
    }
}

/**设置里的内部抖音客服按钮 */
export class InsideDouyinSettingBtn extends BaseSettingBtn implements ISDKSkinButton{
    private ctl:DouYinClientCtl = new DouYinClientCtl();
    updateLogicVis(v:boolean){
        this.ctl.updateLogicVis(this.skin,v);
    }
    constructor(skin,funcId:EFuncDef,icon:string,name:string){
        super(skin,funcId,icon,name);
    }

    protected onDisplay() {
        super.onDisplay();
        this.updateLogicVis(true);
    }

    protected onUnDisplay() {
        super.onUnDisplay()
        this.updateLogicVis(false);
    }
}