import { ui } from "../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";

export class ShouChongItem1 extends ui.views.shouchong.ui_shouchongItem1UI{
    private _ctl1:ItemSlotCtl;
    private _ctl2:ItemSlotCtl;

    constructor(){
        super();
        this._ctl1 = new ItemSlotCtl(this.view1);
        this._ctl2 = new ItemSlotCtl(this.view2);
    }

    public setData(value:Configs.t_First_Recharge_dat,index:number,selectIndex:number){
        if(!value)return;
        if(index == selectIndex){
            this.sel.visible = true;
        }else{
            this.sel.visible = false;
        }
        if(index == 0){
            this.tf1.text = "第一天";
        }else if(index == 1){
            this.tf1.text = "第二天";
        }else if(index == 2){
            this.tf1.text = "第三天";
        }
        let arr = ItemViewFactory.convertItemList(value.f_reward);
        this._ctl1.setData(arr[0]);
        this._ctl2.setData(arr[1]);
        let data = ActivityModel.Ins.getActivityData(EActivityID.ShouChong);
        if(!data)return;
        let status = data.datalist.find(ele=>ele.id == value.f_id).param1;
        if(status == EActivityStatus.Claimed){
            this.m1.visible = this.m2.visible = true;
        }else{
            this.m1.visible = this.m2.visible = false;
        }
    }
}