import { ui } from "../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";

export class ShouChongItem extends ui.views.shouchong.ui_shouchongItemUI{
    private _ctl:ItemSlotCtl;
    private _ctl1:ItemSlotCtl;
    private _ctl2:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view1);
        this._ctl1 = new ItemSlotCtl(this.view2);
        this._ctl2 = new ItemSlotCtl(this.view3);
    }

    public setData(value:Configs.t_First_Recharge_dat,index:number,selectIndex:number){
        if(!value)return;
        if(index == selectIndex){
            this.img.visible = true;
        }else{
            this.img.visible = false;
        }
        if(index == 0){
            this.tf1.text = "第一天";
        }else if(index == 1){
            this.tf1.text = "第二天";
        }else if(index == 2){
            this.tf1.text = "第三天";
        }
        let arr = ItemViewFactory.convertItemList(value.f_reward);
        this._ctl.setData(arr[0]);
        this._ctl1.setData(arr[1]);
        this._ctl2.setData(arr[2]);
        let data = ActivityModel.Ins.getActivityData(EActivityID.ShouChong);
        if(!data)return;
        let status = data.datalist.find(ele=>ele.id == value.f_id).param1;
        if(status == EActivityStatus.Claimed){
            this.img_m.visible = this.img1.visible = true;
        }else{
            this.img_m.visible = this.img1.visible = false;
        }
    }
}