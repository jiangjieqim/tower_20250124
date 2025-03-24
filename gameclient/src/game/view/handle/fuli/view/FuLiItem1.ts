import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EActivityID, EActivityStatus } from "../../activity/ActivityEnum";
import { ActivityModel } from "../../activity/ActivityModel";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { TowerMainFightModel } from "../../towertmain/model/TowerMainFightModel";

export class FuLiItem1 extends ui.views.fuli.ui_fuliItem1UI{

    constructor() {
        super();
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onClick));
    }

    private onClick(){
        if(!this._data)return;
        ActivityModel.Ins.sendCmd(EActivityID.ZXHaoLi,this._data.f_id);
    }

    private _data:Configs.t_Activity_Daily_Online_dat;
    public setData(value: Configs.t_Activity_Daily_Online_dat) {
        if(!value)return;
        this._data = value;
        this.lab.text = E.getLang("fuli2",value.f_online_minutes);
        ItemViewFactory.renderItemSlots(this.sp,value.f_reward,true,10,0.8,"left");
        
        let data = ActivityModel.Ins.getActivityData(EActivityID.ZXHaoLi);
        if(!data)return;
        DotManager.removeDot(this.btn);
        this.btn.visible = this.sp1.visible = this.sp2.visible = false;
        let status = data.datalist.find(ele=>ele.id == value.f_id).param1;
        if(status == EActivityStatus.Claimed){
            this.sp1.visible = true;
        }else if(status == EActivityStatus.Claimable){
            this.btn.visible = true;
            DotManager.addDot(this.btn);
        }else{
            this.sp2.visible = true;
        }
    }
}