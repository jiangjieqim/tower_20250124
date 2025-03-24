// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { stTaskOut } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { t_Battle_Pass_Task } from "./t_Battle_Pass_Task";

export class ZhanLinItem1 extends ui.views.zhanlin.ui_zhanlinItem1UI{
    private _ctl:ItemSlotCtl;
    private _wid:number;

    constructor(){
        super();
        this._wid = this.pro.width;
        this._ctl = new ItemSlotCtl(this.view);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        ActivityModel.Ins.sendCmd(EActivityID.ZhanLin,this._data.id,this._type.toString());
    }

    private _data:stTaskOut;
    private _type:number;
    public setData(value:stTaskOut,type:number){
        if(!value)return;
        this._data = value;
        this._type = type;
        let cfg:Configs.t_Battle_Pass_Task_dat = t_Battle_Pass_Task.Ins.getCfgById(value.id);
        this.lab.text = cfg.f_text;
        this._ctl.setData(ItemViewFactory.convertItem(cfg.f_reward));

        let need = cfg.f_task_number;
        if (value.val >= need) {
            this.pro.width = this._wid;
        } else {
            this.pro.width = value.val / need * this._wid;
        }
        this.lab1.text = value.val + "/" + need;

        DotManager.removeDot(this.btn);
        if(value.status == EActivityStatus.unclaimable){
            this.btn.visible = false;
            this.sp1.visible = false;
            this.sp.visible = true;
        }else if(value.status == EActivityStatus.Claimable){
            DotManager.addDot(this.btn);
            this.btn.visible = true;
            this.sp1.visible = false;
            this.sp.visible = false;
        }else if(value.status == EActivityStatus.Claimed){
            this.btn.visible = false;
            this.sp1.visible = true;
            this.sp.visible = false;
        }
    }   
}