import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FirstPassRewardCoop_req, stFirstPassRewardCoop } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { RoleInfoModel } from "../../roleinfo/model/RoleInfoModel";
import { TowerMainFightModel } from "../model/TowerMainFightModel";
import { t_First_Pass_Reward_Coop } from "../proxy/t_First_Pass_Reward_Coop";

export class TWZItem1 extends ui.views.main.ui_tuweiItem1UI{

    private _ctl:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view);
        this.view.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        if(this._data.status == 1){
            let req = new FirstPassRewardCoop_req;
            req.id = this._data.id;
            SocketMgr.Ins.SendMessageBin(req);
            return;
        }
        let cfg = t_First_Pass_Reward_Coop.Ins.GetDataById(this._data.id);
        FunctionModel.Ins.showItemTip(ItemViewFactory.convertItem(cfg.f_reward),this.view);
    }

    private _data:stFirstPassRewardCoop;
    public setData(value:Configs.t_First_Pass_Reward_Coop_dat,index:number,type:number){
        if(!value)return;
        this._data = TowerMainFightModel.Ins.firstPassRewardCoop.find(ele=>ele.id == value.f_id);
        this.zOrder = 1000 - index;
        this.lab.text = value.f_wave + "波";
        let vo = ItemViewFactory.convertItem(value.f_reward);
        this._ctl.setData(vo,false);
        let num = RoleInfoModel.Ins.getMaxPveNum(type);
        if(num >= value.f_wave){
            this.pro.visible = true;
            this.img.skin = "remote/base/btn_s_dwjl.png";
        }else{
            this.pro.visible = false;
            this.img.skin = "remote/base/btn_n_dwjl.png";
        }

        DotManager.removeDot(this);
        if (this._data) {
            if (this._data.status == 1) {
                DotManager.addDot(this, 0, 30);
                this.m.visible = false;
            } else if (this._data.status == 2) {
                this.m.visible = true;
            }else{
                this.m.visible = false;
            }
        } else {
            this.m.visible = false;
        }
    }
}