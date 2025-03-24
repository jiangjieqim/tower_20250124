// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { MailList_req, stMail } from "../../../../network/protocols/BaseProto";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { EMailReqType, EMailStatus } from "../model/MailModel";
import { MailItem1 } from "./MailItem1";

export class MailView1 extends ViewBase{
    private _ui:ui.views.mail.ui_mailView1UI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
        this.addAtlas('mail.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.mail.ui_mailView1UI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click))
            )

            this._ui.list.itemRender = MailItem1;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onRenderHandler(item:MailItem1){
        item.setData(item.dataSource,this._data.state);
    }

    private onBtnClick(){
        this.onLingqu();
        this.Close();
    }

    private onBtn1Click(){
        E.ViewMgr.Open(EViewType.MailView2,null,this._data);
    }

    private onLingqu(){
        let req = new MailList_req();
        req.type = EMailReqType.LingQuOrRead;
        req.uid = this._data.uid;
        SocketMgr.Ins.SendMessageBin(req);
    }

    protected onInit(): void {
        this._data = this.Data;
        if(this._data.state == EMailStatus.notRead){
            this.onLingqu();
         }
        this.updateView();
    }

    protected onExit(): void {
        
    }

    private _data:stMail;
    private updateView(){
        this._ui.lab1.text = this._data.title;
        this._ui.lab.text = this._data.content;
        this._ui.lab.height = this._ui.lab.textField.textHeight + 2;
        this._ui.lab3.text = TimeUtil.timestamtoTime3(this._data.time * 1000);
        if(this._data.expTime){
            this._ui.lab2.text = TimeUtil.getTimeShow(this._data.expTime - TimeUtil.serverTime) + "后到期";
        }else{
            this._ui.lab2.text = "永久";
        }

        if(this._data.itemlist.length){
            this._ui.list.visible = true;
            this._ui.list.array = ItemViewFactory.cellValue2ItemVos(this._data.itemlist);
            if(this._data.state == EMailStatus.notLingqu){
                this._ui.btn.visible = true;
                this._ui.img.visible = false;
                this._ui.btn1.visible = false;
            }else{
                this._ui.btn.visible = false;
                this._ui.img.visible = true;
                this._ui.btn1.visible = true;
            }
        }else{
            this._ui.list.visible = false;
            this._ui.btn.visible = false;
            this._ui.img.visible = false;
            this._ui.btn1.visible = true;
        }
    }
}