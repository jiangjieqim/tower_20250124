import { ui } from "../../../../../ui/layaMaxUI";
import { stActivityCell } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { TowerMainFightModel } from "../../towertmain/model/TowerMainFightModel";
import { EActivityID } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";

export class JiJinItem extends ui.views.jijin.ui_jijinItemUI{
    private _ctl:ItemSlotCtl;
    private _ctl1:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view);
        this._ctl1 = new ItemSlotCtl(this.view1);
        this.view.on(Laya.Event.CLICK,this,this.onClick);
        this.view1.on(Laya.Event.CLICK,this,this.onClick1);
    }

    private onClick(e:Laya.Event){
        if(!this._cfg)return;
        if(this._data && (this._data.param1 == 1 || this._data.param1 == 11)){
            ActivityModel.Ins.sendCmd(EActivityID.JIJIN,0,this._cfg.f_fund_type.toString());
            return;
        }
        FunctionModel.Ins.showItemTip(ItemViewFactory.convertItem(this._cfg.f_free_reward),this.view);
    }

    private onClick1(e:Laya.Event){
        if(!this._cfg)return;
        if(this._data && (this._data.param1 == 11 || this._data.param1 == 13)){
            ActivityModel.Ins.sendCmd(EActivityID.JIJIN,0,this._cfg.f_fund_type.toString());
            return;
        }
        FunctionModel.Ins.showItemTip(ItemViewFactory.convertItem(this._cfg.f_pay_reward),this.view1);
    }

    private _data:stActivityCell;
    private _cfg:Configs.t_Fund_Reward_dat;
    public setData(value:Configs.t_Fund_Reward_dat,index:number){
        if(!value)return;
        this._cfg = value;
        this.zOrder = index;
        if(index == 0){
            this.bg.visible = false;
            this.bg1.visible = true;
        }else{
            this.bg.visible = true;
            this.bg1.visible = false;
        }

        this.lab.text = value.f_required_days + "天";
        this._ctl.setData(ItemViewFactory.convertItem(value.f_free_reward),false);
        this._ctl1.setData(ItemViewFactory.convertItem(value.f_pay_reward),false);
        if(TowerMainFightModel.Ins.loginDay >= value.f_required_days){
            this.pro.visible = this.pro1.visible = true;
            this.m.visible = false;
        }else{
            this.pro.visible = this.pro1.visible = false;
            this.m.visible = true;
        }

        DotManager.removeDot(this.view);
        DotManager.removeDot(this.view1);
        let status = 0;
        let data = ActivityModel.Ins.getActivityData(EActivityID.JIJIN);
        if(data){
            this._data = data.datalist.find(ele=>ele.id == value.f_id);
            if(this._data){
                status = this._data.param1;
            }
        }
        switch (status) {
            case 0:
                this.setVis(1, 1, 0, 1, 1, 0);
                break;
            case 1:
                this.setVis(0, 0, 0, 1, 1, 0);
                DotManager.addDot(this.view);
                break;
            case 2:
                this.setVis(0, 1, 1, 1, 1, 0);
                break;
            case 11:
                this.setVis(0, 0, 0, 0, 0, 0);
                DotManager.addDot(this.view);
                DotManager.addDot(this.view1);
                break;
            case 12:
                this.setVis(0, 1, 1, 0, 1, 1);
                break;
            case 13:
                this.setVis(0, 1, 1, 0, 0, 0);
                DotManager.addDot(this.view1);
                break;
        }
    }

    private setVis(b,b1,b2,b3,b4,b5){
        this.sp1.visible = b;
        // this.img1.visible = b1;
        this.img4.visible = b2;
        this.sp.visible = b3;
        // this.img2.visible = b4;
        this.img3.visible = b5;
    }
}