import { ui } from "../../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { HolyBeastExtractReward_req } from "../../../../../network/protocols/BaseProto";
import { EActivityStatus } from "../../../activity/ActivityEnum";
import { DotManager } from "../../../common/DotManager";
import { FunctionModel } from "../../../funs/FunctionModel";
import { ShengShouModel } from "../../model/ShengShouModel";
import { t_HolyBeast_Intimacy_Reward } from "../../proxy/t_HolyBeast_Intimacy_Reward";

export class ShengShouItem extends ui.views.shengshou.ui_shengShouItemUI{

    constructor(){
        super();
        this.img.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        if(this._data.state == EActivityStatus.Claimable){
            let req = new HolyBeastExtractReward_req;
            req.activityId = ShengShouModel.Ins.actID;
            req.id = this._data.id;
            SocketMgr.Ins.SendMessageBin(req);
        }else{
            let cfg = t_HolyBeast_Intimacy_Reward.Ins.GetDataById(this._data.id);
            FunctionModel.Ins.showRewardTip(cfg.f_reward,this.img);
        }
    }

    private _data;
    public setData(value:Configs.t_HolyBeast_Intimacy_Reward_dat){
        if(!value)return;
        let data = ShengShouModel.Ins.getRewardData(ShengShouModel.Ins.actID);
        if(!data)return;
        this.lab.text = value.f_require + "";
        DotManager.removeDot(this.img);
        this._data = data.datalist.find(ele=>ele.id == value.f_id);
        if(this._data.state == EActivityStatus.Claimed){
            this.img.skin = "remote/base/box_s.png";
        }else if(this._data.state == EActivityStatus.Claimable){
            this.img.skin = "remote/base/box_n.png";
            DotManager.addDot(this.img);
        }else{
            this.img.skin = "remote/base/box_n.png";
        }
    }
}