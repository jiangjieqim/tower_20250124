import { ui } from "../../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { HolyBeastTask_req } from "../../../../../network/protocols/BaseProto";
import { EActivityStatus } from "../../../activity/ActivityEnum";
import { DotManager } from "../../../common/DotManager";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ShengShouModel } from "../../model/ShengShouModel";

export class ShengShouTaskItem extends ui.views.shengshou.ui_taskItemUI{
    
    constructor(){
        super();
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        let req = new HolyBeastTask_req;
        req.activityId = ShengShouModel.Ins.actID;
        req.id = this._data.f_id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _data: Configs.t_HolyBeast_Task_dat;
    public setData(value: Configs.t_HolyBeast_Task_dat) {
        if (!value) return;
        this._data = value;
        ItemViewFactory.renderItemSlots(this.sp,value.f_reward,true,10,0.95,"left");
        this.lab.text = value.f_des;
        this.lab1.x = this.lab.x + this.lab.textField.textWidth + 5;
        let data = ShengShouModel.Ins.getTaskData(ShengShouModel.Ins.actID);
        if(!data)return;
        let val = data.datalist.find(ele=>ele.id == value.f_id);
        this.lab1.text = "(" + val.cnt + "/" + value.f_task_amount + ")";
        if(val.cnt >= value.f_task_amount){
            this.lab1.color = "#44ff67";
        }else{
            this.lab1.color = "#ffffff";
        }

        DotManager.removeDot(this.btn);
        this.btn.visible = this.sp1.visible = this.sp2.visible = false;
        if(val.state == EActivityStatus.Claimed){
            this.sp2.visible = true;
        }else if(val.state == EActivityStatus.Claimable){
            this.btn.visible = true;
            DotManager.addDot(this.btn);
        }else{
            this.sp1.visible = true;
        }
    }
}