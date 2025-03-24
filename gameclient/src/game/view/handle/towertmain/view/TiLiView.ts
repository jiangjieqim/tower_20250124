import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { PSBuy_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemVo } from "../../main/vos/ItemVo";
import { TowerMainFightModel } from "../model/TowerMainFightModel";

export class TiLiView extends ViewBase{
    private _ui:ui.views.main.ui_tiliViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _timeCtl1:TimeCtl;

    protected onAddLoadRes(): void {
        this.addAtlas("vigour.atlas");
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_tiliViewUI();
            this.bindClose(this._ui.btn_close);

            this._timeCtl1 = new TimeCtl(this._ui.lab7);

            this._ui.sp.on(Laya.Event.CLICK,this,this.onClick);
            this._ui.sp1.on(Laya.Event.CLICK,this,this.onClick1);
        }
    }

    private onClick(){
        let n = System_RefreshTimeProxy.Ins.getVal(64);
        let arr = System_RefreshTimeProxy.Ins.getVal(65).split("|");
        let data = TowerMainFightModel.Ins.pSCntList.find(ele=>ele.type == 1);
        if(arr[data.cnt]){
            let vo:ItemVo = new ItemVo;
            vo.cfgId = parseInt(n.split("-")[0]);
            vo.count = parseInt(n.split("-")[1]);
            let vo1 = ItemViewFactory.convertItem(arr[data.cnt]);
            E.ViewMgr.showMsgBoxView(vo,vo1,new Laya.Handler(this,()=>{
                let req = new PSBuy_req;
                req.flag = 1;
                SocketMgr.Ins.SendMessageBin(req);
            }));
        }
    }

    private onClick1(){
        let num = parseInt(System_RefreshTimeProxy.Ins.getVal(67));
        let data = TowerMainFightModel.Ins.pSCntList.find(ele=>ele.type == 0);
        if(data.cnt >= num)return;

        E.sendTrack("ad_watch",{type:1});
        E.sdk.lookVideo((type: 0 | 1 | 2) => {
            switch(type) {
                case 0:
                    // ⽤户未看完取消
                    break;
                case 1:
                    // ⽤户看完⼴告
                    E.sendTrack("ad_finish",{type:1});
                    let req = new PSBuy_req;
                    req.flag = 0;
                    SocketMgr.Ins.SendMessageBin(req);
                    break;
                case 2:
                    // 拉取⼴告错误
                    break;
            }
        });
    }

    protected onInit(): void {
        TowerMainFightModel.Ins.on(TowerMainFightModel.TILI_DATE,this,this.onUpdateView);
        this.updateView();
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.off(TowerMainFightModel.TILI_DATE,this,this.onUpdateView);
        if(this._timeCtl1){
            this._timeCtl1.dispose();
            this._timeCtl1 = null;
        }
    }

    private onUpdateView(){
        Laya.timer.callLater(this,this.updateView);
    }

    private updateView(){
        let n = System_RefreshTimeProxy.Ins.getVal(64);
        let arr = System_RefreshTimeProxy.Ins.getVal(65).split("|");
        this._ui.lab.text = "x" + n.split("-")[1];
        let data = TowerMainFightModel.Ins.pSCntList.find(ele=>ele.type == 1);
        if(!data){
            return;
        }
        this._ui.lab2.text = arr.length - data.cnt + "";
        if(arr[data.cnt]){
            this._ui.icon.visible = this._ui.lab4.visible = true;
            this._ui.lab8.visible = false;
            let id = parseInt(arr[data.cnt].split("-")[0]);
            this._ui.icon.skin = IconUtils.getIconByCfgId(id);
            this._ui.lab4.text = arr[data.cnt].split("-")[1];
        }else{
            this._ui.icon.visible = this._ui.lab4.visible = false;
            this._ui.lab8.visible = true;
        }

        let nn = System_RefreshTimeProxy.Ins.getVal(66);
        let num = parseInt(System_RefreshTimeProxy.Ins.getVal(67));
        this._ui.lab1.text = "x" + nn.split("-")[1];
        let data1 = TowerMainFightModel.Ins.pSCntList.find(ele=>ele.type == 0);
        this._ui.lab3.text = num - data1.cnt + "";
        this._ui.lab5.text = data1.cnt + "/" + num;

        let time1 = TowerMainFightModel.Ins.secToFullPS - TimeUtil.serverTime;
        if (time1 > 0) {
            this._timeCtl1.start(time1, new Laya.Handler(this, this.onUpdateTime1), new Laya.Handler(this, this.endTime1));
        } else {
            this._timeCtl1.stop();
            this.endTime1();
        }
    }

    private onUpdateTime1() {
        let time_str = TimeUtil.subTime(this._timeCtl1.tickVal);
        this._timeCtl1.setText(time_str);
    }

    private endTime1() {
        this._timeCtl1.setText("已满");
    }
}