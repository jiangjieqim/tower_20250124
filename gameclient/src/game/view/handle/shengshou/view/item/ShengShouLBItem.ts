import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EMsgBoxType } from "../../../../../common/defines/EnumDefine";
import { ActivityModel } from "../../../activity/ActivityModel";
import { DotManager } from "../../../common/DotManager";
import { IconUtils } from "../../../main/model/IconUtils";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { TowertMainShopModel } from "../../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../../towertmainshop/proxy/t_Recharge";
import { ShengShouModel } from "../../model/ShengShouModel";

export class ShengShouLBItem extends ui.views.shengshou.ui_LBItemUI{

    constructor(){
        super();
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click));
        ButtonCtl.Create(this.btn2,new Laya.Handler(this,this.onBtn2Click));
    }

    private onBtnClick(){
        if(!this._data)return;
        ActivityModel.Ins.sendCmd(ShengShouModel.Ins.actID,this._data.f_id);
    }

    private onBtn1Click(){
        if(!this._data)return;
        TowertMainShopModel.Ins.recharge(this._data.f_recharge_id);
    }

    private onBtn2Click(){
        if(!this._data)return;
        let vo = ItemViewFactory.convertItem(this._data.f_price);
        let st = E.getLang("shengshoulab",vo.count);
        E.ViewMgr.ShowMsgBox(EMsgBoxType.OkOrCancel,st,new Laya.Handler(this, this.sendCmd));
    }

    private sendCmd(){
        ActivityModel.Ins.sendCmd(ShengShouModel.Ins.actID,this._data.f_id);
    }

    private _data:Configs.t_HolyBeast_Pack_dat;
    public setData(value:Configs.t_HolyBeast_Pack_dat,type:number){
        if(!value)return;
        this._data = value;
        this.lab.text = value.f_pack_name;
        if(value.f_discount){
            this.img1.visible = true;
            this.lab1.text = value.f_discount / 100 + "%";
        }else{
            this.img1.visible = false;
        }
        
        ItemViewFactory.renderItemSlots(this.sp,value.f_reward,true,10,0.95,"left");
        let data = ActivityModel.Ins.getActivityData(ShengShouModel.Ins.actID);
        if(!data)return;
        let num = data.datalist.find(ele => ele.id === value.f_id).param1;
        this.lab2.text = num + "/" + value.f_limited_amount;

        this.btn.visible = this.btn1.visible = this.btn2.visible = this.img.visible = false;
        DotManager.removeDot(this.btn);
        if(num >= value.f_limited_amount){
            this.img.visible = true;
        }else{
            if(type == 1){
                if(value.f_recharge_id){
                    this.btn1.visible = true;
                    let cfg = t_Recharge.Ins.getCfgById(value.f_recharge_id);
                    this.lab3.text = StringUtil.moneyCv(cfg.f_price) + "元";
                }else{
                    this.btn.visible = true;
                    if(ShengShouModel.Ins.isOpen(ShengShouModel.Ins.actID)){
                        DotManager.addDot(this.btn);
                    }
                }
            }else{
                this.btn2.visible = true;
                let vo = ItemViewFactory.convertItem(value.f_price);
                this.icon.skin = IconUtils.getIconByCfgId(vo.cfgId);
                this.lab4.text = vo.count + "";
            }
        }
    }
}