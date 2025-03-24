import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { ShopExchange_req, ShopHotExchange_req, stShop } from "../../../../../network/protocols/BaseProto";
import { DotManager } from "../../../common/DotManager";
import { EBuyType, IShopBuyItem } from "../../../common/ShopBuyView";
import { IconUtils } from "../../../main/model/IconUtils";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
import { TowertMainShopModel } from "../../model/TowertMainShopModel";
import { t_Recharge } from "../../proxy/t_Recharge";
import { t_Shop_Hotsell } from "../../proxy/t_Shop_Hotsell";

export class ShopCtl {
    protected _ui:ui.views.shop.ui_shopCtlUI;

    constructor(skin:ui.views.shop.ui_shopCtlUI) {
        this._ui = skin;
        // this._ui.on(Laya.Event.CLICK,this,this.onClick);
        ButtonCtl.CreateBtn(this._ui,this,this.onClick,false);
    }

    private onClick(){
        if(this._data){
            if(this._type == 1){
                this.sendCmd();
            }else if(this._type == 2){
                this.lookV();
            }else if(this._type == 4){
                this.sendCmd1(this._data.f_id);
            }
        }
    }

    private sendCmd(){
        if(this._data.f_PurchaseID){
            TowertMainShopModel.Ins.recharge(this._data.f_PurchaseID);
        }else if(this._hotData){
            let cfg = t_Shop_Hotsell.Ins.getCfgById(this._hotData.id);
            let vo = ItemViewFactory.convertItem(cfg.f_Price);
            let vo1 = ItemViewFactory.convertItem(cfg.f_reward);
            E.ViewMgr.showMsgBoxView(vo1,vo,new Laya.Handler(this,()=>{
                let req = new ShopHotExchange_req;
                req.id = this._hotData.id;
                SocketMgr.Ins.SendMessageBin(req);
            }));
            
        }else if(this._data.f_type == 3 || this._data.f_type == 4 || this._data.f_type == 8
            || this._data.f_type == 9){
            let vo = ItemViewFactory.convertItem(this._data.f_Price);
            let vo1 = ItemViewFactory.convertItem(this._data.f_reward);
            TowerMainModel.Ins.buyItem(vo, vo1, new Laya.Handler(this, this.onBuyClick), EBuyType.Item,
            false,null,new Laya.Handler(this,this.getMaxNum));
        }else{
            let vo = ItemViewFactory.convertItem(this._data.f_Price);
            let vo1 = ItemViewFactory.convertItem(this._data.f_reward);
            E.ViewMgr.showMsgBoxView(vo1,vo,new Laya.Handler(this,()=>{
                this.sendCmd1(this._data.f_id);
            }));
        }
    }

    private getMaxNum(){
        if (this._data.f_limit_type) {
            let vo = TowertMainShopModel.Ins.shopList.find(ele => ele.id == this._data.f_id);
            return this._data.f_limit_times - vo.cnt;
        } else {
            return 99;
        }
    }

    private sendCmd1(id:number,num:number = 1){
        let req = new ShopExchange_req;
        req.id = id;
        req.times = num;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBuyClick(value:IShopBuyItem,selCount:number){
        if(!this._data)return;
        this.sendCmd1(this._data.f_id,selCount);
    }

    private lookV(){
        E.sendTrack("ad_watch",{type:this._data.f_name});
        E.sdk.lookVideo((type: 0 | 1 | 2) => {
            switch(type) {
                case 0:
                    // ⽤户未看完取消
                    break;
                case 1:
                    // ⽤户看完⼴告
                    E.sendTrack("ad_finish",{type:this._data.f_name});
                    this.sendCmd1(this._data.f_id);
                    break;
                case 2:
                    // 拉取⼴告错误
                    break;
            }
        });
    }

    private _data:Configs.t_Shop_dat;
    private _type:number;
    private _hotData:stShop;
    public setData(value:Configs.t_Shop_dat,data:stShop=null){
        if(!value)return;
        this._data = value;
        this._hotData = data;
        if(value.f_limit_type == 0 || this._hotData){
            this._ui.lab1.visible = this._ui.lab2.visible = false;
        }else{
            this._ui.lab1.visible = this._ui.lab2.visible = true;
            this._ui.lab2.text = E.getLang("shopLab").split("-")[value.f_limit_type - 1];
        }

        let count = 0;
        let vo:stShop;
        if (!this._hotData) {
            vo = TowertMainShopModel.Ins.shopList.find(ele => ele.id == value.f_id);
        } else{
            vo = this._hotData;
        }
        if(vo){
            count = vo.cnt;
        }

        DotManager.removeDot(this._ui);
        if(this._hotData){
            if(count){
                this.setVis(0,0,0,1,0);
                this._type = 3;
            }else{
                this.setVis(0,1,0,0,0);
                this._type = 1;
                let cfg = t_Shop_Hotsell.Ins.getCfgById(this._hotData.id);
                let id = parseInt(cfg.f_Price.split("-")[0]);
                let val = parseInt(cfg.f_Price.split("-")[1]);
                this._ui.icon.skin = IconUtils.getIconByCfgId(id);
                this._ui.lab3.text = val + "";
            }
        }else{
            if(value.f_PurchaseID){
                if(value.f_limit_type == 0 || count < value.f_limit_times){
                    this.setVis(0,0,0,0,1);
                    this._type = 1;
                    let cfg = t_Recharge.Ins.getCfgById(value.f_PurchaseID);
                    this._ui.lab5.text = StringUtil.moneyCv(cfg.f_price) + "元";
                }else{
                    this.setVis(0,0,0,1,0);
                    this._type = 3;
                }
                this._ui.lab1.text = `(${count}/${value.f_limit_times})`;
            }else if(value.f_Price != ""){
                if(value.f_limit_type == 0 || count < value.f_limit_times){
                    this.setVis(0,1,0,0,0);
                    this._type = 1;
                    let id = parseInt(value.f_Price.split("-")[0]);
                    let val = parseInt(value.f_Price.split("-")[1]);
                    this._ui.icon.skin = IconUtils.getIconByCfgId(id);
                    this._ui.lab3.text = val + "";
                }else{
                    this.setVis(0,0,0,1,0);
                    this._type = 3;
                }
                this._ui.lab1.text = `(${count}/${value.f_limit_times})`;
            }else if(count < value.f_free){
                this.setVis(1,0,0,0,0);
                this._type = 4;
                this._ui.lab1.text = `(${count}/${value.f_free})`;
                DotManager.addDot(this._ui,30);
            }else if(count - value.f_free < value.f_ad){
                this.setVis(0,0,1,0,0);
                this._type = 2;
                this._ui.lab1.text = `(${count - value.f_free}/${value.f_ad})`;
            }else{
                this.setVis(0,0,0,1,0);
                this._type = 3;
                if(value.f_ad){
                    this._ui.lab1.text = `(${count - value.f_free}/${value.f_ad})`;
                }else{
                    this._ui.lab1.text = `(${count}/${value.f_free})`;
                }
            }
        }
    }

    private setVis(b,b1,b2,b3,b4){
        this._ui.labf.visible = b;
        this._ui.icon.visible = b1;
        this._ui.sp.visible = b2;
        this._ui.lab4.visible = b3;
        this._ui.lab5.visible = b4;
    }
}