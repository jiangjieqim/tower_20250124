import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EMsgBoxType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SpringFestivalSignIn_req, stSpringFestivalSignIn } from "../../../../network/protocols/BaseProto";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { t_Spring_Festival_2025_Config } from "../proxy/t_Spring_Festival_2025_Config";
import { t_Spring_Festival_2025_Sign } from "../proxy/t_Spring_Festival_2025_Sign";

export class NewYearItem1 extends ui.views.newyear.ui_newyearItemUI{
    private _itemCtl:ItemSlotCtl;
    constructor(){
        super();
        this._itemCtl = new ItemSlotCtl(this.view);
        ButtonCtl.Create(this.img,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        let vo = ItemViewFactory.convertItem(t_Spring_Festival_2025_Config.Ins.getValueById(4));
        let st = E.getLang("newyearlab1",vo.count);
        E.ViewMgr.ShowMsgBox(EMsgBoxType.OkOrCancel,st,new Laya.Handler(this, this.sendCmd));
        
    }

    private sendCmd(){
        let req = new SpringFestivalSignIn_req;
        req.id = this._data.id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _data: stSpringFestivalSignIn;
    public setData(value: stSpringFestivalSignIn) {
        if (!value) return;
        this._data = value;
        let cfg = t_Spring_Festival_2025_Sign.Ins.GetDataById(value.id);
        this._itemCtl.setData(ItemViewFactory.convertItem(cfg.f_reward));
        this.m.visible = false;
        this.sp.visible = false;
        this.img.visible = false;
        this.lab1.text = "";
        switch (value.state) {
            case 0:
                this.lab1.text = "第" + cfg.f_day + "天";
                break;
            case 1:
                this.m.visible = true;
                this.sp.visible = true;
                break;
            case 2:
                this.img.visible = true;
                let st = t_Spring_Festival_2025_Config.Ins.getValueById(4);
                let vo = ItemViewFactory.convertItem(st);
                this.icon.skin = IconUtils.getIconByCfgId(vo.cfgId);
                this.lab.text = vo.count + "";
                break;
            case 3:
                this.lab1.text = "第" + cfg.f_day + "天";
                break;
        }
    }
}