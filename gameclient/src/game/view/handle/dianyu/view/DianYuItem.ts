import { ui } from "../../../../../ui/layaMaxUI";
import { stActivity, stCommonTimes, stFriendListItem } from "../../../../network/protocols/BaseProto";
import { EActivityID, EActivityStatus } from "../../activity/ActivityEnum";
import { ActivityModel } from "../../activity/ActivityModel";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { DianYuModel } from "../model/DianYuModel";

export class DianYuItem extends ui.views.dianyu.ui_dianyuItemUI{

    private _ctl:ItemSlotCtl;
    private _ctl1:ItemSlotCtl;
    private _ctl2:ItemSlotCtl;

    constructor() {
        super();
        this._ctl = new ItemSlotCtl(this.view);
        this._ctl1 = new ItemSlotCtl(this.view1);
        this._ctl2 = new ItemSlotCtl(this.view2);
        this.view.on(Laya.Event.CLICK,this,this.onClick);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick))
    }

    private onBtnClick(){
        if(!this._data)return;
        TowertMainShopModel.Ins.recharge(this._data.f_recharge_id);
    }

    private onClick(e:Laya.Event){
        if(!this._data)return;
        if(this._status == EActivityStatus.Claimable){
            ActivityModel.Ins.sendCmd(EActivityID.DianYu,this._data.f_id);
            return;
        }
        FunctionModel.Ins.showItemTip(ItemViewFactory.convertItem(this._data.f_reward),this.view);
    }

    private _data:Configs.t_Crazy_Fish_Upgrade_dat;
    private _status:number;
    public setData(value: Configs.t_Crazy_Fish_Upgrade_dat) {
        if(!value)return;
        let data:stActivity = ActivityModel.Ins.getActivityData(EActivityID.DianYu);
        if(!data)return;
        this._data = value;

        this._ctl.setData(ItemViewFactory.convertItem(value.f_reward),false);
        let arr = ItemViewFactory.convertItemList(value.f_pack_reward);
        this._ctl1.setData(arr[0]);
        this._ctl2.setData(arr[1]);
        DotManager.removeDot(this.view);
        this._status = data.datalist.find(ele=>ele.id == value.f_id).param1;
        if(this._status == EActivityStatus.unclaimable){
            this.m.visible = false;
        }else if(this._status == EActivityStatus.Claimable){
            this.m.visible = false;
            DotManager.addDot(this.view);
        }else{
            this.m.visible = true;
        }

        let hdata = TowertMainHeroModel.Ins.getHeroById(value.f_hero_id);
        if(value.f_receive_level == 0 ||(hdata && hdata.level >= value.f_receive_level)){
            this.img.skin = "remote/dianyu/img_dxzm_d.png";
            this.icon.visible = true;
            this.icon.skin = `remote/dianyu/img_hy_${value.f_type}.png`;
            this.icon1.visible = true;
            this.icon1.skin = `remote/dianyu/img_hy_dxzm${value.f_type}.png`;
            this.img1.visible = false;
            this.sp.visible = this.sp1.visible = this.sp2.visible = false;
            this.view1.y = this.view2.y = 11;
            this.btn.visible = true;
            let cfg = t_Recharge.Ins.getCfgById(value.f_recharge_id);
            this.lab.text = StringUtil.moneyCv(cfg.f_price) + "元";
            let num = DianYuModel.Ins.clist.find(ele=>ele.flag == value.f_id).times;
            this.lab1.text = "(" + num + "/" + value.f_limit_times + ")";
            if(num >= value.f_limit_times){
                this.btn.disabled = true;
            }else{
                this.btn.disabled = false;
            }
        }else{
            this.img.skin = "remote/dianyu/img_dxzm_d1.png";
            this.icon.visible = false;
            this.icon1.visible = false;
            this.img1.visible = true;
            this.lab2.text = value.f_receive_level + "级";
            this.sp.visible = this.sp1.visible = this.sp2.visible = true;
            this.view1.y = this.view2.y = 43;
            this.btn.visible = false;
        }
    }
}