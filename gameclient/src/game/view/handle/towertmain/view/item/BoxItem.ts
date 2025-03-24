import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { stBox } from "../../../../../network/protocols/BaseProto";
import { TeQuanKaModel } from "../../../activity/tequanka/TeQuanKaModel";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { IconUtils } from "../../../main/model/IconUtils";
import { ECellType } from "../../../main/vos/ECellType";
// import { YinDaoModel } from "../../../yindao/YinDaoModel";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";
import { t_Box_Falling_Rate } from "../../proxy/t_Box_Falling_Rate";
import { t_Box_Match } from "../../proxy/t_Box_Match";

export class BoxItem extends ui.views.main.ui_baoxiangItemUI {
    private _timeCtl: TimeCtl;
    private _boxSe: SimpleEffect;

    constructor() {
        super();

        this.on(Laya.Event.DISPLAY, this, this.onDisplay);
        this.on(Laya.Event.UNDISPLAY, this, this.onUnDisplay);

        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onDisplay() {

    }

    private onUnDisplay() {
        if (this._timeCtl) {
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
        if (this._boxSe) {
            this._boxSe.dispose();
            this._boxSe = null;
        }
    }

    private onClick() {
        if (this._data && this._data.pos != TowerMainFightModel.Ins.boxIndex) {
            switch (this._data.state) {//宝箱状态 0尚未解锁 1解锁中 2可开启 3可解锁
                case 0:
                case 3:
                    E.ViewMgr.Open(EViewType.BoxView, null, this._data.pos);
                    break;
                case 1:
                    E.ViewMgr.Open(EViewType.BoxView1, null, this._data.pos);
                    break;
                case 2:
                    TowerMainFightModel.Ins.sendCmd(1, this._data.pos);
                    break;
            }
            // let cfg = YinDaoModel.Ins._gCfg;
            // if (cfg) {
            //     if(cfg.f_precondition != ""){
            //         let arr1 = cfg.f_precondition.split("-");
            //         let type = parseInt(arr1[0]);
            //         let val = parseInt(arr1[1]);
            //         if (type == 1) {
            //             if (MainModel.Ins.isPvpFightGuide || TowerMainFightModel.Ins.boxIndex) {
            //                 return;
            //             }
            //             if(this._data.boxId == val && this._data.state == 2){
            //                 YinDaoModel.Ins.sendCmd(cfg.f_groupid,4);
            //             }else{
            //                 if(cfg.f_forward_step == 1){
            //                     YinDaoModel.Ins.isBoxClick = true;
            //                 }
            //                 YinDaoModel.Ins.sendCmd(cfg.f_groupid,cfg.f_orderid);
            //             }
            //             YinDaoModel.Ins.removeYD();
            //         }
            //     }else{
            //         YinDaoModel.Ins.sendCmd(cfg.f_groupid,cfg.f_orderid);
            //         YinDaoModel.Ins.removeYD();
            //     }
            // }
        }
    }

    private _data: stBox;
    public setData(value: number) {
        if (!value) return;
        if (!this._timeCtl) {
            this._timeCtl = new TimeCtl(this.lab1);
        }
        this._timeCtl.stop();
        this._data = TowerMainFightModel.Ins.boxList.find(ele => ele.pos == value);
        if (this._data) {
            if (this._data.pos == TowerMainFightModel.Ins.boxIndex) {
                this.spp.visible = false;
                this.icon0.visible = true;
                this.icon.visible = true;
                this.bg.skin = "remote/towerMain/bottom_box_d1.png";
                let cfg = t_Box_Match.Ins.getCfgById(this._data.boxId);
                if (!this._boxSe) {
                    this._boxSe = new SimpleEffect(this.icon, `o/spine/succeed/baoxiangluoxia${cfg.f_box_qua}/${cfg.f_box_qua}`, 8, -8);
                }
                this._boxSe.play(1, false, this, this.onPlayEnd);
                SpineEffectMgr.playOnce(`o/spine/succeed/baoxiangluoxia${cfg.f_box_qua}_TX/${cfg.f_box_qua}`,this.lz, 8, -8,1);
            } else {
                this.updateView();
            }
        } else {
            this.spp.visible = false;
            this.icon0.visible = true;
            this.icon.visible = false;
            this.bg.skin = "remote/towerMain/bottom_box_d1.png";
        }
    }

    private onPlayEnd() {
        TowerMainFightModel.Ins.boxIndex = 0;
        this.updateView();
        // YinDaoModel.Ins.addYD(2000);
    }

    private updateView() {
        if (!this._data) return;
        this.spp.visible = true;
        let cfg = t_Box_Match.Ins.getCfgById(this._data.boxId);
        this.icon0.visible = false;
        this.icon.visible = true;
        if (!this._boxSe) {
            this._boxSe = new SimpleEffect(this.icon, `o/spine/succeed/baoxiangluoxia${cfg.f_box_qua}/${cfg.f_box_qua}`, 8, -8);
        }
        this._boxSe.play(0, true);
        let fCfg = t_Box_Falling_Rate.Ins.getCfgByQua(cfg.f_box_qua);
        switch (this._data.state) {//宝箱状态 0尚未解锁 1解锁中 2可开启 3可解锁
            case 0:
                this.bg.skin = "remote/towerMain/bottom_box_d1.png";
                this.sp.visible = true;
                this.lab.visible = true;
                this.lab.text = TimeUtil.subTimeC(TeQuanKaModel.Ins.getTime(fCfg.f_opentime));
                this.sp1.visible = false;
                this.img.skin = "remote/towerMain/tx_swjs1.png";
                this.sp2.visible = false;
                this.sp3.visible = false;
                break;
            case 1:
                this.bg.skin = "remote/towerMain/bottom_box_d_djs.png";
                this.sp.visible = false;
                this.sp1.visible = false;
                this.img.skin = "";
                this.sp2.visible = true;
                let time = this._data.unlockUnix - TimeUtil.serverTime;
                if (time > 0) {
                    this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
                } else {
                    this.endTime();
                }
                this.sp3.visible = true;
                this.icon1.skin = IconUtils.getIconByCfgId(ECellType.SHUIJING);
                if (this._data.costs.length) {
                    this.lab2.text = "x" + this._data.costs[0].count;
                } else {
                    this.lab2.text = "x0";
                }
                break;
            case 2:
                this.bg.skin = "remote/towerMain/bottom_box_d_kkq.png";
                this.sp.visible = true;
                this.lab.visible = false;
                this.sp1.visible = true;
                this.img.skin = "";
                this.sp2.visible = false;
                this.sp3.visible = false;
                break;
            case 3:
                this.bg.skin = "remote/towerMain/bottom_box_d1.png";
                this.sp.visible = true;
                this.lab.visible = true;
                this.lab.text = TimeUtil.subTimeC(TeQuanKaModel.Ins.getTime(fCfg.f_opentime));
                this.sp1.visible = false;
                this.img.skin = "remote/towerMain/tx_djjs1.png";
                this.sp2.visible = false;
                this.sp3.visible = false;
                break;
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }
}