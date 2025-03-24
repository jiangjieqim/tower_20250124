// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { stTaskOut } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { DayTaskModel } from "../model/DayTaskModel";
import { t_Daily_Task } from "../proxy/t_Daily_Task";

export class DayTaskItem1 extends ui.views.task.ui_taskItem1UI {

    private _wid: number;
    private ctl:ItemSlotCtl;

    constructor() {
        super();
        this._wid = this.pro.width;
        this.ctl = new ItemSlotCtl(this.view);
        ButtonCtl.Create(this.btn, new Laya.Handler(this, this.onClick));
    }

    private onClick() {
        if (!this._data) return;
        DayTaskModel.Ins.sendCmd(0,this._data.id);
    }

    private _data: stTaskOut;
    public setData(value: stTaskOut) {
        if (!value) return;
        this._data = value;
        let cfg = t_Daily_Task.Ins.GetDataById(value.id);
        this.lab.text = cfg.f_des;
        let need = cfg.f_task_amount;
        if (value.val >= need) {
            this.pro.width = this._wid;
        } else {
            this.pro.width = value.val / need * this._wid;
        }
        this.lab1.text = value.val + "/" + need;
        let vo = ItemViewFactory.convertItem(cfg.f_client);
        this.ctl.setData(vo,false);

        DotManager.removeDot(this.btn);
        if (value.status == 0) {
            this.img.visible = false;
            this.img1.visible = true;
            this.btn.visible = false;
        } else if (value.status == 1) {
            this.img.visible = false;
            this.img1.visible = false;
            this.btn.visible = true;
            DotManager.addDot(this.btn,0,-10);
        } else {
            this.img.visible = true;
            this.img1.visible = false;
            this.btn.visible = false;
        }

    }
}