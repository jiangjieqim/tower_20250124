import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { MainModel } from "../../../main/model/MainModel";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";

export class PvpLockItem extends ui.views.main.ui_pwlockItemUI{
    constructor(){
        super();
        ButtonCtl.Create(this.sp2, new Laya.Handler(this, this.onBtnClick));
    }

    private onBtnClick(){
        E.ViewMgr.ShowMidError("前往PVP引导");
    }

    public setData(value:Configs.t_Pvp_Unlock_Condition_dat){
        if(!value)return;
        this.lab.text = value.t_des;

        this.sp.visible = this.sp1.visible = this.sp2.visible = false;
        if(value.f_task_type == 29){
            if(MainModel.Ins.isNewPvpGuideComplete){
                this.lab1.text = "1/1";
                this.sp.visible = true;
            }else{
                this.lab1.text = "0/1";
                this.sp2.visible = true;
            }
        }else{
            let vo = TowerMainFightModel.Ins.pvpUnlockTask.find(ele => ele.taskType == value.f_task_type);
            if(vo){
                this.lab1.text = vo.val + "/" + value.f_task_amount;
                if(vo.val >= value.f_task_amount){
                    this.sp.visible = true;
                }else{
                    this.sp1.visible = true;
                }
            }
        }
    }
}