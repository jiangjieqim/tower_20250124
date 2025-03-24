import { ui } from "../../../../../ui/layaMaxUI";
import { stTaskOutActivation } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { DayTaskModel } from "../model/DayTaskModel";
import { t_Daily_Task_Reward } from "../proxy/t_Daily_Task_Reward";

export class DayTaskItem extends ui.views.task.ui_taskItemUI{

    constructor() {
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        if(this._data.status == 1){
            DayTaskModel.Ins.sendCmd(2,this._data.id);
        }else{
            let cfg = t_Daily_Task_Reward.Ins.GetDataById(this._data.id);
            FunctionModel.Ins.showRewardTip(cfg.f_reward,this);
        }
    }

    private _data:stTaskOutActivation;
    public setData(value: stTaskOutActivation) {
        if(!value)return;
        this._data = value;
        DotManager.removeDot(this.img);
        if(value.status == 0){
            this.img.skin = "remote/base/box_n.png";
        }else if(value.status == 1){
            this.img.skin = "remote/base/box_n.png";
            DotManager.addDot(this.img,10,-10);
        }else{
            this.img.skin = "remote/base/box_s.png";
        }
        let cfg = t_Daily_Task_Reward.Ins.GetDataById(value.id);
        this.lab.text = cfg.f_activation + "";
    }
}