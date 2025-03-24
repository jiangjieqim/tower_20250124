// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { ShopHotFresh_req } from "../../../../../network/protocols/BaseProto";
import { System_RefreshTimeProxy } from "../../../main/ctl/System_RefreshTimeProxy";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { TowertMainShopModel } from "../../model/TowertMainShopModel";

export class ShopItem8 extends ui.views.shop.ui_shopItem8UI {
    private _timeCtl: TimeCtl;

    constructor() {
        super();
        this.on(Laya.Event.UNDISPLAY, this, this.onUnDisplay);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick))
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click))
    }

    private onBtnClick() {
        if (!this._data) return;
        E.sendTrack("ad_watch",{type:this._data.f_name});
        E.sdk.lookVideo((type: 0 | 1 | 2) => {
            switch (type) {
                case 0:
                    // ⽤户未看完取消
                    break;
                case 1:
                    // ⽤户看完⼴告
                    E.sendTrack("ad_finish",{type:this._data.f_name});
                    let req = new ShopHotFresh_req;
                    req.flag = 0;
                    SocketMgr.Ins.SendMessageBin(req);
                    break;
                case 2:
                    // 拉取⼴告错误
                    break;
            }
        });
    }

    private onBtn1Click(){
        let req = new ShopHotFresh_req;
        req.flag = 1;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onUnDisplay() {
        if (this._timeCtl) {
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private _data:Configs.t_Shop_dat;
    public setData(value:Configs.t_Shop_dat) {
        if (!value) return;
        this._data = value;
        this.img.skin = "remote/shop/tx_" + value.f_type + ".png";
        if (!this._timeCtl) {
            this._timeCtl = new TimeCtl(this.lab);
        }
        this._timeCtl.stop();
        let time = TowertMainShopModel.Ins.todayEndUnix - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
        let vo = TowertMainShopModel.Ins.hotFreshList.find(ele => ele.type == 0);
        let arr = System_RefreshTimeProxy.Ins.getVal(32).split("|");
        this.lab1.text = (parseInt(arr[0]) - vo.cnt) + "/" + arr[0];
        if(vo.cnt >= parseInt(arr[0])){
            this.btn.disabled = true;
        }else{
            this.btn.disabled = false;
        }
        vo = TowertMainShopModel.Ins.hotFreshList.find(ele => ele.type == 1);
        this.lab2.text = ( parseInt(arr[1]) - vo.cnt) + "/" + arr[1];
        if(vo.cnt >= parseInt(arr[1])){
            this.btn1.disabled = true;
        }else{
            this.btn1.disabled = false;
        }
        let item = ItemViewFactory.convertItem(arr[2]);
        this.icon.skin = item.getIcon();
        this.lab3.text = item.count + "";
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTime(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }
}