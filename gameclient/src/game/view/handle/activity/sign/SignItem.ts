// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { stActivity } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";

export class SignItem extends ui.views.sign.ui_signItemUI{
    private _ctl:ItemSlotCtl;
    private _ctl1:ItemSlotCtl;
    private _ctl2:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view1);
        this._ctl1 = new ItemSlotCtl(this.view2);
        this._ctl2 = new ItemSlotCtl(this.view3);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        ActivityModel.Ins.sendCmd(EActivityID.Sign,this._data.f_id);
    }

    private _data:Configs.t_Sevenday_Reward_dat;
    public setData(value:Configs.t_Sevenday_Reward_dat){
        if(!value)return;
        this._data = value;
        let data:stActivity = ActivityModel.Ins.getActivityData(EActivityID.Sign);
        if(!data)return;
        this.tf1.text = `第${StringUtil.NumToWord(value.f_days)}天`;
        let arr = ItemViewFactory.convertItemList(value.f_reward);
        this._ctl.setData(arr[0]);
        this._ctl1.setData(arr[1]);
        this._ctl2.setData(arr[2]);

        DotManager.removeDot(this.btn);
        this.m1.visible = this.m2.visible = this.m3.visible = false;
        this.img.visible = this.img1.visible = this.btn.visible = false;
        let status = data.datalist.find(ele=>ele.id == value.f_id).param1;
        if(status == EActivityStatus.unclaimable){
            this.img1.visible = true;
        }else if(status == EActivityStatus.Claimable){
            this.btn.visible = true;
            DotManager.addDot(this.btn);
        }else{
            this.img.visible = true;
            this.m1.visible = this.m2.visible = this.m3.visible = true;
        }
    }
}