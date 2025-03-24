import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { InviteReward_req, stCommonTimes } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { SheZhiModel } from "../model/SheZhiModel";
import { t_Invite_Reward } from "./t_Invite_Reward";

export class YaoQingItem1 extends ui.views.shezhi.ui_yaoqingItem1UI{

    constructor(){
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        if(this._data.times == 1){
            let req = new InviteReward_req;
            req.id = this._data.flag;
            SocketMgr.Ins.SendMessageBin(req);
        }else{
            let cfg = t_Invite_Reward.Ins.GetDataById(this._data.flag);
            FunctionModel.Ins.showRewardTip(cfg.f_reward,this);
        }
    }

    private _data:stCommonTimes;
    public setData(value:Configs.t_Invite_Reward_dat){
        if(!value)return;
        this.lab.text = value.f_invite_number + "";

        this._data = SheZhiModel.Ins.yqList.find(ele => ele.flag === value.f_id);
        DotManager.removeDot(this.img);
        if(this._data.times == 0){
            this.img.skin = "remote/shezhi/ico_bx.png";
        }else if(this._data.times == 1){
            this.img.skin = "remote/shezhi/ico_bx.png";
            DotManager.addDot(this.img);
        }else{
            this.img.skin = "remote/shezhi/ico_bx1.png";
        }
    }
}