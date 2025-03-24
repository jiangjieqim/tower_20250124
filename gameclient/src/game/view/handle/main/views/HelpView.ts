// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import {ViewBase} from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { IHelpViewData } from "../interface/Interface";

export class HelpView extends ViewBase{
    protected autoFree = true;
    protected _ui:ui.views.common.ui_help_viewUI;
    private _btnCtl:ButtonCtl;
    private subHeight:number;
    protected mMask = true;
    protected onFirstInit() {
        if(!this.UI){
            this.UI = this._ui = new ui.views.common.ui_help_viewUI();
            this._ui.tf1.text = "";
            this._ui.desc.text = "";
            this._btnCtl = new ButtonCtl(this._ui.close1,new Laya.Handler(this,this.Close));
            this.subHeight = this._ui.bg.height - this._ui.bg2.height;
            // this._ui._maskBg.on(Laya.Event.CLICK,this,this.Close);
            this.btnList.push(this._btnCtl);
        }
    }

    protected onAddLoadRes() {
    }
    protected onAddEventListener() {

    }
    protected onEnter() {
    
    }
    protected onInit() {
        this._ui.downIcon.visible = false;
        let _data:IHelpViewData = this.Data;
        this._ui.tf1.text = _data.title;
        this._ui.desc.text = _data.desc;
        let curH = this._ui.desc.textField.displayHeight;
        // console.log(this._ui.desc.textField.height,curH);

        let minH = 360;
        let maxH = 800;

        if(curH < minH){
            curH = minH;
        }else if(curH > maxH){
            curH = maxH;
        }
        this._ui.bg2.height =  curH + 100;
        this._ui.bg.height = this._ui.bg2.height + this.subHeight;
        this._ui.width = this._ui.bg.width;
        this._ui.height = this._ui.bg.height;
    }

    protected onExit() {
        
    }
}