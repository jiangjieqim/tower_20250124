import { ui } from "../../../../ui/layaMaxUI";
import { EViewType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { MainEvent } from "../main/model/MainEvent";
import { MainModel } from "../main/model/MainModel";
/**选服item */
export class LoginSelServerItem extends ui.views.login.ui_login_sel_server_itemUI{
    private _ui:ui.views.login.ui_login_sel_server_itemUI;
    constructor(){
        super();
        // this.y = 868;
        this._ui = this;
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onUnDisplay(){
        MainModel.Ins.off(MainEvent.UpdateServer,this,this.onUpdataServer);
    }
    private onDisplay(){
        MainModel.Ins.on(MainEvent.UpdateServer,this,this.onUpdataServer);
        this._ui.lab_sel.on(Laya.Event.CLICK,this,this.onLabSelClick);
        this._ui.img_t.visible = this._ui.lab_id.visible = this._ui.img_t1.visible = false;
        this._ui.lab_id.autoSize = true;
        this.x = ((this.parent as Laya.Sprite).width - this.width)/2;
        this.y = 868;
    }
    private onLabSelClick(){
        E.ViewMgr.Open(EViewType.LoginQuFu);
    }
    private onUpdataServer(){
        this._ui.img_t.visible = this._ui.lab_id.visible = true;
        this._ui.lab_id.text = MainModel.Ins.serverName || "";
        let url:string = "remote/base/red.png"
        switch(MainModel.Ins.serverState){//区服状态 1爆满 2畅通 3维护
            case 1:
                // this._ui.img_t.skin = "remote/loginnew1/bm.png";
                break;
            case 2:
                // this._ui.img_t.skin = "remote/loginnew1/ct.png";
                url = "remote/base/green.png"
                break;
            case 3:
                // this._ui.img_t.skin = "remote/loginnew1/wh.png";
                break;
        }
        this._ui.img_t.skin = url;

        if(MainModel.Ins.serverIsNew){
            this._ui.img_t1.visible = true;
        }else{
            this._ui.img_t1.visible = false;
        }

        this._ui.img_t1.x = this._ui.lab_id.x + this._ui.lab_id.textField.textWidth;
        // this._ui.lab_sel.x = this._ui.img_t1.x + this._ui.img_t1.width;
    }
}