import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SevenDayTaskReward_req, stSevenDayTaskDetail } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { EActivityStatus } from "../ActivityEnum";
import { SevenActivityModel } from "./SevenActivityModel";

export class SevenActivityItem extends ui.views.sevenactivity.ui_sevenActivityItemUI{

    constructor(){
        super();
        this.list.itemRender = ui.views.sevenactivity.ui_sevenActivityItem1UI;
        this.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        let req = new SevenDayTaskReward_req;
        req.id = this._data.id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onRenderHandler(item:ui.views.sevenactivity.ui_sevenActivityItem1UI){
        ItemViewFactory.renderItemSlots(item.sp,item.dataSource,true,10,0.95,"left");
        if(this._data.state == EActivityStatus.Claimed){
            item.m.visible = true;
        }else{
            item.m.visible = false;
        }
    }

    private _data:stSevenDayTaskDetail;
    public setData(value:Configs.t_Sevenday_Task_dat){
        if(!value)return;
        if(!SevenActivityModel.Ins.taskList)return;
        this._data = SevenActivityModel.Ins.taskList.find(ele=>ele.id == value.f_id);
        this.lab.text = value.f_task_text;
        this.list.array = value.f_task_reward.split("|");
        this.img.visible = this.btn.visible = this.sp1.visible = this.sp2.visible = false;
        DotManager.removeDot(this.btn);
        if(this._data.state == EActivityStatus.Claimed){
            this.sp2.visible = true;
        }else if(this._data.state == EActivityStatus.Claimable){
            this.btn.visible = true;
            DotManager.addDot(this.btn);
        }else{
            this.img.visible = this.sp1.visible = true;
            this.lab1.text = this._data.cnt + "";
            this.lab2.text = "/" + value.f_task_amount;
        }
    }
}