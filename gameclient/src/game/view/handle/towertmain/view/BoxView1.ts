// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EMsgBoxType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { UseItem_req, stBox, stCellValue } from "../../../../network/protocols/BaseProto";
import { IconUtils } from "../../main/model/IconUtils";
import { MainModel } from "../../main/model/MainModel";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainFightModel } from "../model/TowerMainFightModel";
import { t_Box_Match } from "../proxy/t_Box_Match";
import { t_Box_Reward_Rate } from "../proxy/t_Box_Reward_Rate";

export class BoxView1 extends ViewBase{
    private _ui:ui.views.main.ui_baoxiangView1UI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _timeCtl:TimeCtl;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_baoxiangView1UI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn3,new Laya.Handler(this,this.onBtn3Click))
            )

            this._timeCtl = new TimeCtl(this._ui.lab11);
        }
    }

    private onBtn1Click(){
        if(!this._data)return;
        let vo = new stCellValue;
        vo.id = ECellType.JSQ;
        vo.count = 1;
        let req = new UseItem_req;
        req.type = 1;
        req.itemlist = [vo];
        req.extra = this._data.pos + "";
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBtn3Click() {
        if (!this._data) return;
        if (this._data.state == 1) {
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OkOrCancel, E.getLang("boxLab",this._data.costs[0].count), new Laya.Handler(this, this.sendCard));
        } else if (this._data.state == 2) {
            TowerMainFightModel.Ins.sendCmd(1, this._data.pos);
            this.Close();
        }
    }

    private sendCard(){
        TowerMainFightModel.Ins.sendCmd(2, this._data.pos);
        this.Close();
    }

    private _data: stBox;
    protected onInit(): void {
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_BOX,this,this.updateView);
        this.updateView();
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_BOX,this,this.updateView);
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private updateView(){
        this._data = TowerMainFightModel.Ins.boxList.find(ele => ele.pos == this.Data);
        if(!this._data)return;
        let cfg = t_Box_Match.Ins.getCfgById(this._data.boxId);
        this._ui.icon.skin = t_Box_Match.Ins.getSkinByQua(cfg.f_box_qua);
        this._ui.lab.text = cfg.f_arena_stage + "阶竞技场";
        this._ui.img.skin = t_Box_Match.Ins.getSkinLabByQua(cfg.f_box_qua);
        this._ui.lab1.text = cfg.f_text;
        this._ui.icon1.skin = IconUtils.getIconByCfgId(ECellType.JINBI);
        this._ui.lab2.text = t_Box_Reward_Rate.Ins.getStById(this._data.boxId,1);
        this._ui.lab3.text = t_Box_Reward_Rate.Ins.getStById(this._data.boxId,2);

        this._timeCtl.stop();
        if (this._data.state == 1) {
            this._ui.sp3.visible = true;
            this._ui.icon2.skin = IconUtils.getIconByCfgId(ECellType.SHUIJING);
            this._ui.lab5.text = "x" + this._data.costs[0].count;
            this._ui.lab6.text = "立即解锁";
            let time = this._data.unlockUnix - TimeUtil.serverTime;
            if (time > 0) {
                this._ui.btn1.disabled = false;
                this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
            } else {
                this.endTime();
                this._ui.btn1.disabled = true;
            }
        } else if (this._data.state == 2) {
            this._ui.sp3.visible = false;
            this._ui.lab6.text = "立即开启";
            this.endTime();
            this._ui.btn1.disabled = true;
        }

        this._ui.icon11.skin = IconUtils.getIconByCfgId(ECellType.JSQ);
        this._ui.lab22.text =  MainModel.Ins.mRoleData.getVal(ECellType.JSQ) + "";
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeC(this._timeCtl.tickVal,"分钟");
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }
}