import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { DotManager } from "../../../common/DotManager";
import { FunctionModel } from "../../../funs/FunctionModel";
import { FuncProxy, MainIconProxy } from "../../../funs/proxy/FunctionProxy";
import { TowerMainEvent } from "../../../towertmain/model/TowerMainEvent";
import { TowertMainView } from "../../../towertmain/view/TowertMainView";
import { System_RefreshTimeProxy } from "../../ctl/System_RefreshTimeProxy";
import { EFuncDef } from "../../model/EFuncDef";

export interface IFuncSmallIconSkin extends ISmallIcon{
    // bg: Laya.Image;
    // icon: Laya.Image;
    // tf: Laya.Label;
    // dot:Laya.Image;
}

interface ISmallIcon extends Laya.Sprite{
    dot:Laya.Image;
    icon:Laya.Image;
    bg:Laya.Image;
    tf:Laya.Label;
    ////////////////////////
    bg2:Laya.Image;
    tf2:Laya.Label;
    sp:Laya.Sprite;
}

/**按钮样式 */ 
export enum EButtonStyle{
    /**中间 */
    Mid = 1,
    /**底部 */
    Bottom = 2,
    /**坐标 */
    Pos = 3,
}
export interface IBaseSmallIcon extends Laya.Sprite{
    dot:Laya.Image;
    icon:Laya.Image;
    bg:Laya.Image;
    tf:Laya.Label;
}
export interface ISDKSkinButton{
    /**设置sdk层级的按钮隐藏显示 */
    updateLogicVis(v:boolean);
}
export class FuncSmallIcon {
// implements ISDKSkinButton{
    public used:boolean  = false;
    public isOpen:boolean = false;
    public btnStyle:EButtonStyle;

    /**有标识坐标的按钮 0代表没有定位*/
    public pos:number = 0;
    public skin: ISmallIcon;
    public funcId:number;
    ///////////////////////////////////////////////////////////////////////
    private funcCfg:Configs.t_func_dat;
    btnCtl:ButtonCtl;
    private cfg:Configs.t_MainIcon_dat;
    private _debugTF:Laya.Label;
    private _se:SimpleEffect;
    constructor() {}
    public initSkin(cls){
        this.skin = new cls();
        this.statusLabel = "";
        this.onDisplay();
    }
    public refresh(name:string|Laya.View, funcType: EFuncDef, btnStyle: EButtonStyle,x:number=undefined,y:number=undefined){
        let skin;
        if(name instanceof Laya.View){
            skin = name;
        }else{
            skin = (E.ViewMgr.Get(EViewType.Main) as TowertMainView).UI[name];
        }
        let pos = 0;
        let cfg = MainIconProxy.Ins.getCfgByFuncid(funcType);

        if(cfg && btnStyle == EButtonStyle.Pos){
            pos = cfg.f_pos;
        }
        
        this.skin = skin;
        DebugUtil.draw(this.skin);
        if(debug){
            if(!this._debugTF){
                this._debugTF = new Laya.Label();
                this._debugTF.fontSize = 18;
                this._debugTF.color = "#ff0000";
            }
            this.skin.addChild(this._debugTF);
            this._debugTF.text = funcType.toString();
        }
        this.pos = pos;
        this.btnStyle = btnStyle;

        let btnEffect = true;

        let btn:IFuncSmallIconSkin = skin;
        if(btn.dot){
            btn.dot.visible = false;
        }

        if(btnStyle == EButtonStyle.Bottom){
            //底部按钮
            btnEffect = false;
            this.selected = false;
        }

        this.btnCtl = ButtonCtl.CreateBtn(this.skin, this, this.onClickHandler, btnEffect);
        if(btnStyle == EButtonStyle.Mid){
            this.btnCtl.setpos(x,y);
        }
        skin.on(Laya.Event.DISPLAY,this,this.onDisplay);
        skin.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        this.setData(funcType);
        if(x!=undefined){
            this.btnCtl.setpos(x,y);
        }
        this.update();
    }

    public update(){

    }

    /**按钮状态 */
    public set statusLabel(v: string) {
        if (this.skin.bg2) {
            if (v == "") {
                this.skin.bg2.visible = this.skin.tf2.visible = false;
            }else{
                this.skin.bg2.visible = this.skin.tf2.visible = true;
                this.skin.tf2.text = v;
            }
        }
    }
    public set selected(v: boolean) {
        this.skin.bg.visible = v;
    }

    /**重置坐标 */
    public setPos(x: number, y: number) {
        this.skin.x = x;
        this.skin.y = y;
    }

    protected onDisplay() {
        FunctionModel.Ins.on(TowerMainEvent.FuncSmallIconUpdate,this,this.onRedUpdate);
    }

    public refreshView() {
        this.setData(this.funcId);
    }
    protected onUnDisplay(){
        FunctionModel.Ins.off(TowerMainEvent.FuncSmallIconUpdate,this,this.onRedUpdate);
        if(this._se){
            this._se.dispose();
            this._se = null;
        }
    }
    private onClickHandler(){
        if(!this.funcCfg)return;
        let arr = System_RefreshTimeProxy.Ins.getVal(57).split("|");
        if(arr.indexOf(this.funcId.toString()) != -1){
            if(E.ta){
                let time = TimeUtil.timestamtoTime(TimeUtil.serverTimeMS);
                E.ta.userSetOnce({first_pack:time});
                E.ta.userSetOnce({first_pack_id:this.funcId});
            }
        }
        E.ViewMgr.OpenByFuncid(this.funcCfg.f_FunctionID,true,this.funcCfg.f_param);
    }

    midEmptyStatus(){
        this.funcId = 0;
        let skin = this.skin;
        skin.dot.visible = false;
        skin.tf2.visible = skin.bg2.visible = false;
        skin.icon.skin = `remote/main/main/weikaifang.png`;
        skin.tf.text = "";
    }

    protected onRedUpdate() {
        if (this.cfg) {
                let red:boolean = FunctionModel.Ins.getHasRed(this.funcId);
                //===============================================================
                let x:number = 0;
                let y:number = 20;
                if(this.btnStyle == EButtonStyle.Pos){
                    x = 20;
                    y = 0;
                }
                if(this.btnStyle == EButtonStyle.Mid){
                    x = 0;
                    y = 0;
                }

                if(red){
                    DotManager.addDot(this.skin, x,y);
                }else{
                    DotManager.removeDot(this.skin);
                }
                DebugUtil.drawTF(this.skin,this.funcId + "," + (red ? 1 : 0));
        }
    }
    private getName(cfg: Configs.t_func_dat){
        return cfg.f_name;
    }

    protected updateNameTfText(){
        this.skin.tf.text = this.getName(this.funcCfg);
    }

    private setData(funcType: EFuncDef) {
        this.funcId = funcType;
        let cfg = MainIconProxy.Ins.getCfgByFuncid(funcType);
        if(!cfg){
            this.visible = false;
            this.isOpen = false;
            return;
        }
        let funcCfg = FuncProxy.Ins.getCfgByFuncId(funcType);
        this.funcCfg = funcCfg;
        this.cfg = cfg;
        
        this.updateNameTfText();

        let iconVal:string = "";
        let isOpen:boolean = FunctionModel.Ins.isOpenByFuncId(this.funcId);

        let vis:boolean = true;
        if(this.btnStyle == EButtonStyle.Mid){
            //中间的按钮,翅膀,换装

            let iconArr = cfg.f_icon.split(".");
            let a = iconArr[0]
            let icon = isOpen ? a : `${a}_1`;
            iconVal = `o/mainicon/${icon}.png`;
        }else if(this.btnStyle == EButtonStyle.Bottom){
            /**底部按钮 冒险*/

            let arr = cfg.f_icon.split(".");
            let _icon2:string = "";
            if(isOpen){
                _icon2 = arr[0]+"."+"png";
            }else{
                _icon2 = arr[0]+"_1."+"png";
            }
            iconVal = `o/mainicon/${_icon2}`;
        }else if(this.btnStyle == EButtonStyle.Pos){
            vis = isOpen;
            iconVal = `o/mainicon/${cfg.f_icon}`;
            
        }
        
        if(cfg.f_animation != ""){
            this.skin.icon.visible = false;
            this.skin.sp.visible = true;
            if(!this._se){
                this._se = new SimpleEffect(this.skin.sp, `o/spine/succeed/${cfg.f_animation}/${cfg.f_animation}`,8,8);
            }
            this._se.play(0,true);
        }else{
            this.skin.icon.visible = true;
            this.skin.icon.skin = iconVal;
            this.skin.sp.visible = false;
        }
        this.visible = vis;
        this.isOpen = isOpen;
        this.onRedUpdate();
    }

    public midReset(){
        this.skin.dot.visible = true;
        this.skin.tf2.visible = this.skin.bg2.visible = true;
    }

    public set visible(v:boolean){
        this.skin.visible = v;
    }

    public dispose(){
        this.onUnDisplay();
        this.skin.removeSelf();
    }
}