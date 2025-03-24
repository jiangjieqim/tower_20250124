import { ui } from "../../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { TrophyReward_req, stCommonReward } from "../../../../../network/protocols/BaseProto";
import { DotManager } from "../../../common/DotManager";
import { FunctionModel } from "../../../funs/FunctionModel";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { RoleInfoModel } from "../../../roleinfo/model/RoleInfoModel";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";

export class TrophyNewItem1 extends ui.views.trophy.ui_trophyItemUI{
    
    private _ctl:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view);
        this.view.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        let vo:stCommonReward = TowerMainFightModel.Ins.trophyRewardList.find(ele=>ele.id == this._data.f_id);
        if(vo && vo.state == 1){
            let req = new TrophyReward_req;
            req.id = 0;
            SocketMgr.Ins.SendMessageBin(req);
            return;
        }
        FunctionModel.Ins.showItemTip(ItemViewFactory.convertItem(this._data.f_reward),this.view);
    }

    private _data:Configs.t_Trophy_Reward_dat;
    public setData(value:Configs.t_Trophy_Reward_dat,index:number){
        if(!value)return;

        this._data = value;
        this.zOrder = 1000 - index;
        this.lab.text = value.f_trophy + "分";
        let vo = ItemViewFactory.convertItem(value.f_reward);
        this._ctl.setData(vo,false);
        let trophy = RoleInfoModel.Ins.getMaxTrophy();
        if(trophy >= value.f_trophy){
            this.pro.visible = true;
            this.img.skin = "remote/base/btn_s_dwjl.png";
        }else{
            this.pro.visible = false;
            this.img.skin = "remote/base/btn_n_dwjl.png";
        }

        DotManager.removeDot(this);
        let voo: stCommonReward = TowerMainFightModel.Ins.trophyRewardList.find(ele => ele.id == value.f_id);
        if (voo) {
            if (voo.state == 1) {
                DotManager.addDot(this, 0, 30);
                this.m.visible = false;
            } else {
                this.m.visible = true;
            }
        } else {
            this.m.visible = false;
        }
    }
}