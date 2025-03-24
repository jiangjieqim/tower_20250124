import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { stMail } from "../../../../network/protocols/BaseProto";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { SoltItemView } from "../../main/views/icon/SoltItemView";
import { MailModel } from "../model/MailModel";

export class MailItem extends ui.views.mail.ui_mailItemUI{
    constructor() {
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);

        this.list.itemRender = SoltItemView;
        this.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
    }

    protected onClick(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.MailView1,null,this._data);
    }

    private onRenderHandler(item:SoltItemView){
        item.setData(item.dataSource);
    }

    private _data:stMail;
    public setData(value:stMail) {
        if (!value) return;
        this._data = value;
        if(MailModel.Ins.isMask(value)){
            this.img1.visible = true;
            this.img.skin = "remote/mail/icon_yj_dk.png";
        }else{
            this.img1.visible = false;
            this.img.skin = "remote/mail/icon_yj.png";
        }
        this.lab.text = value.title;
        this.list.array = ItemViewFactory.cellValue2ItemVos(value.itemlist);
        if(value.expTime){
            this.lab1.text = TimeUtil.getTimeShow(value.expTime - TimeUtil.serverTime) + "后到期";
        }else{
            this.lab1.text = "永久";
        }
    }
}