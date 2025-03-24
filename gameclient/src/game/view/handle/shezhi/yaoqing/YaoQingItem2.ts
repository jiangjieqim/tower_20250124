// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { InviteReward_req, stCommonTimes } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { SheZhiModel } from "../model/SheZhiModel";

export class YaoQingItem2 extends ui.views.shezhi.ui_yaoqingItem2UI {
    private _ctl: ItemSlotCtl;
    private _wid:number;

    constructor() {
        super();
        this._ctl = new ItemSlotCtl(this.view);
        this._wid = this.pro.width;
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick))
    }

    private onBtnClick() {
        if (!this._data) return;
        let req = new InviteReward_req;
        req.id = this._data.flag;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _data: stCommonTimes;
    public setData(value: Configs.t_Invite_Reward_dat) {
        if (!value) return;
        this._ctl.setData(ItemViewFactory.convertItem(value.f_reward));
        this.lab.text = E.getLang("yaoqing1", value.f_invite_number);
        let need = value.f_invite_number;
        if (SheZhiModel.Ins.yqInvitedCnt >= need) {
            this.pro.width = this._wid;
        } else {
            this.pro.width = SheZhiModel.Ins.yqInvitedCnt / need * this._wid;
        }
        this.lab1.text = SheZhiModel.Ins.yqInvitedCnt + "/" + need;

        this._data = SheZhiModel.Ins.yqList.find(ele => ele.flag === value.f_id);
        DotManager.removeDot(this.btn);
        this.sp.visible = this.sp1.visible = this.btn.visible = false;
        if (this._data.times == 0) {
            this.sp1.visible = true;
        } else if (this._data.times == 1) {
            this.btn.visible = true;
            DotManager.addDot(this.btn);
        } else {
            this.sp.visible = true;
        }
    }
}