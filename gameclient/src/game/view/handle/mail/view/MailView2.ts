// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { MailList_req } from "../../../../network/protocols/BaseProto";
import { EMailReqType } from "../model/MailModel";

export class MailView2 extends ViewBase{
    private _ui:ui.views.mail.ui_mailView2UI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
        this.addAtlas('mail.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.mail.ui_mailView2UI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtnClick1))
            )
        }
    }

    private onBtnClick(){
        this.Close();
    }

    private onBtnClick1(){
        let req = new MailList_req();
        req.type = EMailReqType.Del;
        req.uid = this.Data.uid;
        SocketMgr.Ins.SendMessageBin(req);
        this.Close();
        E.ViewMgr.Close(EViewType.MailView1);
    }

    protected onInit(): void {

    }

    protected onExit(): void {
        
    }

}