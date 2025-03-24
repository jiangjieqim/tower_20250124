import { ui } from "../../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { MainModel } from "../../../main/model/MainModel";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";
import { t_Pvp_Unlock_Condition } from "../../proxy/t_Pvp_Unlock_Condition";

export class PvpLockItem1 extends ui.views.main.ui_pwlockItem1UI{

    private _ctl:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view);
    }

    public setData(value:Configs.t_Pvp_Unlock_Reward_dat,index:number){
        if(!value)return;
        this.zOrder = 100 - index;
        this._ctl.setData(ItemViewFactory.convertItem(value.f_reward));
        if(index + 1 <= TowerMainFightModel.Ins.pvpReward.length){
            this.pro.visible = true;
            this.img.skin = "remote/base/btn_s_dwjl.png";
            this.m.visible = true;
        }else{
            let num = this.getNum();
            if(index + 1 <= num){
                this.pro.visible = true;
                this.img.skin = "remote/base/btn_s_dwjl.png";
                this.m.visible = false;
            }else{
                this.pro.visible = false;
                this.img.skin = "remote/base/btn_n_dwjl.png";
                this.m.visible = false;
            }
        }
    }

    private getNum(){
        let arr = t_Pvp_Unlock_Condition.Ins.List;
        let num = 0;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_task_type == 29){
                if(MainModel.Ins.isNewPvpGuideComplete){
                    num++;
                }
            }else{
                let vo = TowerMainFightModel.Ins.pvpUnlockTask.find(ele => ele.taskType == arr[i].f_task_type);
                if(vo){
                    if(vo.val >= arr[i].f_task_amount){
                        num++;
                    }
                }
            }
        }
        return num;
    }
}