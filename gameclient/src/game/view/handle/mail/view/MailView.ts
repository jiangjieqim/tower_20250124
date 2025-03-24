// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { MailList_req, stMail } from "../../../../network/protocols/BaseProto";
import { EMailReqType, MailModel } from "../model/MailModel";
import { MailItem } from "./MailItem";

export class MailView extends ViewBase{
    private _ui:ui.views.mail.ui_mailViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
        this.addAtlas('mail.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.mail.ui_mailViewUI();
            this.bindClose(this._ui.btn_close);

            this._ui.list.renderHandler = new Laya.Handler(this,this.onMailHandler);
            this._ui.list.itemRender = MailItem;
            this._ui.list.array = [];
            this._ui.img.visible = false;

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onClickDelHandler)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onYiJianHandler))
            )
        }
    }

    /**一键领取 */
    private onYiJianHandler(){
        if(!MailModel.Ins.hasMailCanLingqu){
            E.ViewMgr.ShowMidLabel(E.getLang("maillingqu"));
            return;
        }
        let req = new MailList_req();
        req.type = EMailReqType.LingQuOrRead;
        req.uid = 0;
        SocketMgr.Ins.SendMessageBin(req);
    }
    
    /**删除已读 */
    private onClickDelHandler(){
        if(MailModel.Ins.mailList.length <= 0){
            E.ViewMgr.ShowMidLabel(E.getLang("maildel"));
            return;
        }
        let req = new MailList_req();
        req.type = EMailReqType.Del;
        req.uid = 0;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onMailHandler(item:MailItem){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        MailModel.Ins.on(MailModel.UPDATE_MAIL,this,this.updateView);
        let req = new MailList_req();
        req.uid = 0;
        req.type = EMailReqType.List;
        SocketMgr.Ins.SendMessageBin(req);
    }

    protected onExit(): void {
        MailModel.Ins.off(MailModel.UPDATE_MAIL,this,this.updateView);
    }

    private updateView(){
        let num = 100;
        let num1 = MailModel.Ins.mailList.length;
        if(num1 > num){
            num1 = num;
        }
        this._ui.lab.text = num1 + "/" + num;
        MailModel.Ins.mailList.sort(this.onSort);
        this._ui.list.array = MailModel.Ins.mailList;
        if(MailModel.Ins.mailList.length <= 0){
            this._ui.img.visible = true;
        }else{
            this._ui.img.visible = false;
        }
    }

    private onSort(a:stMail,b:stMail){
        return MailModel.Ins.isMask(a) - MailModel.Ins.isMask(b);
    }
}