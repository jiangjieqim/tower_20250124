// import mUI = ui.views.common.ui_msgboxUI;

// import { ButtonCtl } from "../../../../frame/view/ButtonCtl";
import {ViewBase} from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EMsgBoxType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { ResPath } from "../../../resouce/ResPath";
export interface IMsgBoxParms{
    /**确定按钮文本 */
    okLabel:string;
    /**取消按钮文本 */
    cancelLabel:string;
    /**标题 */
    title:string;
    /**是否隐藏关闭按钮 */
    bHideCloseBtn:boolean;
    /**取消点击遮罩关闭 */
    disableMaskClick:boolean;
    /**自定义尺寸 */
    fontSize:number;
}
/**消息弹窗*/
export class MsgBoxView2 extends ViewBase  {
    private readonly defaultFontSize:number = 26;
    //#region 静态

    //#endregion

    //#region 实例
    private _ui: ui.views.common.ui_msgboxUI;

    private _sureCall: Laya.Handler;
    private _cancelCall: Laya.Handler;
    private _clearCall: Laya.Handler;       // 弹窗关闭时的回调
    private _exitCall:Laya.Handler;
    private type: EMsgBoxType;
    private sureCtl:ButtonCtl;
    private cancelCtl:ButtonCtl;
    private onlysureCtl:ButtonCtl;
    private closeBtnCtl:ButtonCtl;
    protected mMask = true;

    // PageType = EPageType.MsgBox;

    //#region 抽象方法实现
    protected onEnter() {

    }

    private onLaterExit(){
        if (this._clearCall) this._clearCall.run();
        this._clearCall = null;

        if(this._exitCall)this._exitCall.run();
        this._exitCall = null;
    }
    // clearAllCallBack(){
    //     this._exitCall = null;
    //     this._clearCall = null;
    // }
    protected onExit() {
        // Laya.timer.callLater(this,this.onLaterExit);
        this.onLaterExit();
    }
    protected onFirstInit() {
        if(!this.UI){
            this.UI = this._ui = new ui.views.common.ui_msgboxUI();
            this.sureCtl = ButtonCtl.Create(this._ui.sure,new Laya.Handler(this,this.onBtnSure));
            this.cancelCtl = ButtonCtl.Create(this._ui.cancel,new Laya.Handler(this,this.onBtnCancel));
            this.onlysureCtl = ButtonCtl.Create(this._ui.onlysure,new Laya.Handler(this,this.onBtnSureOnly));
            this.closeBtnCtl = ButtonCtl.Create(this._ui.close1,new Laya.Handler(this,this.onBtnClose));
        }
    }

    protected onInit() {
    }

    //#endregion

    public show(type: EMsgBoxType, content: string, sureCall: Laya.Handler, cancelCall: Laya.Handler,exitCall:Laya.Handler,params?:IMsgBoxParms) {
        if(!this._ui){
            return;
        }
        this._ui.lbl_content.text = content;

        if(!params){
            params = {} as IMsgBoxParms;
            params.fontSize = this.defaultFontSize;
        }
        
        this._ui.lbl_content.fontSize = params.fontSize || this.defaultFontSize;
        this._ui.tf2.text =  params.okLabel || E.getLang("Sure");
        this._ui.tf3.text = params.okLabel || E.getLang("Sure");
        this._ui.tf1.text = params.cancelLabel || E.getLang("Cancel");
        this._ui.label_tip.text = params.title || E.getLang("tips");
        if(params.bHideCloseBtn){
            this.closeBtnCtl.visible = false;
        }else{
            this.closeBtnCtl.visible = true;
        }

        if(params.disableMaskClick){
            this.mMaskClick = false;
        }else{
            this.mMaskClick = true;
        }

        this._sureCall = sureCall;
        this._cancelCall = cancelCall;
        this._exitCall = exitCall;
        this.type = type;
        if (type == EMsgBoxType.OnlyOk) {
            this.onlysureCtl.visible = true;
            this.sureCtl.visible = false;
            this.cancelCtl.visible = false;
        }
        else {
            this.onlysureCtl.visible = false;
            this.sureCtl.visible = true;
            this.cancelCtl.visible = true;
        }
    }

    protected onAddLoadRes() {
        this.addRes(ResPath.View.MsgBox, Laya.Loader.JSON);
    }

    protected onAddEventListener() {
        
    }

    protected onChangeLanguage() {
        this._ui.label_tip.changeText(E.LangMgr.getLang("Tip"));
        // this._ui.sure.label = E.LangMgr.getLang("Sure");
        // this._ui.onlysure.label = E.LangMgr.getLang("Sure")
        // this._ui.cancel.label = E.LangMgr.getLang("Cancel");
    }

    //protected==========================


    private onBtnSure() {
        this._clearCall = this._sureCall;
        // if (this._sureCall)
        //     this._sureCall.Invoke();
        // E.AudioMgr.PlayUI(Frame.UIDefine.anniu);
        E.ViewMgr.Close(this.ViewType);
    }

    private onBtnCancel() {
        this._clearCall = this._cancelCall;
        // if (this._cancelCall)
        //     this._cancelCall.Invoke();
        // E.AudioMgr.PlayUI(Frame.UIDefine.anniu);
        E.ViewMgr.Close(this.ViewType);
    }

    private onBtnSureOnly() {
        this._clearCall = this._sureCall;
        // if (this._sureCall)
        //     this._sureCall.Invoke();
        // E.AudioMgr.PlayUI(Frame.UIDefine.anniu);
        E.ViewMgr.Close(this.ViewType);
    }

    private onBtnClose() {
        if (this.type == EMsgBoxType.OkOrCancel) {
            this._clearCall = this._cancelCall;
            // if (this._cancelCall)
            //     this._cancelCall.Invoke();
        }
        else {
            this._clearCall = this._sureCall;
            // if (this._sureCall)
            //     this._sureCall.Invoke();
        }
        // E.AudioMgr.PlayUI(Frame.UIDefine.anniu);
        E.ViewMgr.Close(this.ViewType);
    }

    //#endregion
}