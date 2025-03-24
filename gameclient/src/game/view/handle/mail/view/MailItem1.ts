import { ui } from "../../../../../ui/layaMaxUI";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { ItemVo } from "../../main/vos/ItemVo";
import { EMailStatus } from "../model/MailModel";

export class MailItem1 extends ui.views.mail.ui_mailItem1UI{
    private _ctl:ItemSlotCtl;

    constructor() {
        super();
        this._ctl = new ItemSlotCtl(this.view);
    }

    public setData(value:ItemVo,state:number) {
        if (!value) return;
        this._ctl.setData(value);
        if(state == EMailStatus.isLingqued){
            this.img.visible = true;
        }else{
            this.img.visible = false;
        }
    }
}