// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { TreasureRaise_req } from "../../../../network/protocols/BaseProto";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { IconUtils } from "../../main/model/IconUtils";
import { MainModel } from "../../main/model/MainModel";
import { TowertMainLinbaoModel } from "../model/TowertMainLinbaoModel";
import { t_Treasure } from "../proxy/t_Treasure";
import { t_Treasure_Upgrade } from "../proxy/t_Treasure_Upgrade";

export class TowertMainLinbaoTip extends ViewBase{
    private _ui:ui.views.linbao.ui_linbaoTipUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _proW;

    protected onAddLoadRes() {
        
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.linbao.ui_linbaoTipUI;
            this._proW = this._ui.pro.width;

            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            );
        }
    }

    private onBtnClick(){
        if(!this._data)return;
        let req:TreasureRaise_req = new TreasureRaise_req;
        req.id = this._data.f_treasureid;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _data:Configs.t_Treasure_dat;
    private _bo;
    protected onInit(): void {
        TowertMainLinbaoModel.Ins.on(TowertMainLinbaoModel.UPDATE_LINBAO,this,this.updateView);
        TowertMainLinbaoModel.Ins.on(TowertMainLinbaoModel.UPDATE_UP,this,this.onUpView);
        this._data = this.Data[0];
        this._bo = this.Data[1];
        this.updateView();
    }

    protected onExit(): void {
        TowertMainLinbaoModel.Ins.off(TowertMainLinbaoModel.UPDATE_LINBAO,this,this.updateView);
        TowertMainLinbaoModel.Ins.off(TowertMainLinbaoModel.UPDATE_UP,this,this.onUpView);
    }

    private onUpView(){
        E.AudioMgr.StopSound();
        E.AudioMgr.PlaySound1("1008.mp3");
        SpineEffectMgr.playOnce(`o/spine/scene/lingbao_up_bg/lingbao_up_bg`,this._ui.sp_se1,6,22,this._data.f_qua-1);
        SpineEffectMgr.playOnce(`o/spine/scene/lingbao_up/lingbao_up`,this._ui.sp_se2);
    }

    private _cfg:Configs.t_Treasure_Upgrade_dat;
    private updateView(){
        this._ui.sp_jt.visible = false;
        let data = TowertMainLinbaoModel.Ins.getLinBaoById(this._data.f_treasureid);
        if(data){
            this._cfg = t_Treasure_Upgrade.Ins.getCfgByIdAndLv(data.id,data.level);
            let nextCfg:Configs.t_Treasure_Upgrade_dat = t_Treasure_Upgrade.Ins.getNextCfgByIdAndLv(data.id,data.level);
            if(nextCfg){
                this._ui.sppro.visible = true;
                this._ui.lab_mj.visible = false;
                this._ui.sp.visible = false;
                let arr = this._cfg.f_upgrade_consume.split("|");
                let id = parseInt(arr[0].split("-")[0]);
                let need = parseInt(arr[0].split("-")[1]);
                let count = MainModel.Ins.mRoleData.getVal(id);
                if(count >= need){
                    this._ui.pro.width = this._proW;
                    this._ui.sp_jt.visible = true;
                }else{
                    this._ui.pro.width = count / need * this._proW;
                }
                this._ui.lab_pro.text = count + "/" + need;

                this._ui.spp.visible = true;
                this._ui.sp1.visible = false;
                id = parseInt(arr[1].split("-")[0]);
                need = parseInt(arr[1].split("-")[1]);
                this._ui.icon.skin = IconUtils.getIconByCfgId(id);
                this._ui.lab_icon.text = "x" + need;
                count = MainModel.Ins.mRoleData.getVal(id);
                if(count >= need){
                    this._ui.lab_icon.color = "#ffffff";
                }else{
                    this._ui.lab_icon.color = "#f63431";
                }

                if(TowertMainLinbaoModel.Ins.isLinBaoLv(data.id,data.level)){
                    this._ui.btn.disabled = false;
                }else{
                    this._ui.btn.disabled = true;
                }

                this._ui.lab_icon.width = this._ui.lab_icon.textField.textWidth;
                this._ui.bg_icon.width = this._ui.lab_icon.width + 77;
                this._ui.bg_icon.x = (250 - this._ui.bg_icon.width) * 0.5;
            }else{
                this._ui.sppro.visible = this._ui.lab_mj.visible = true;
                this._ui.sp.visible = false;
                this._ui.pro.width = this._proW;
                this._ui.lab_pro.text = "";
                this._ui.spp.visible = false;
                this._ui.sp1.visible = true;
                this._ui.sp1.skin = "remote/linbao/txymj.png";
            }
        }else{
            this._cfg = t_Treasure_Upgrade.Ins.getCfgByIdAndLv(this._data.f_treasureid,1);
            this._ui.sppro.visible = this._ui.lab_mj.visible = false;
            this._ui.sp.visible = true;
            this._ui.spp.visible = false;
            this._ui.sp1.visible = true;
            this._ui.sp1.skin = "remote/linbao/tx_wjs.png";
        }
        this._ui.icon1.skin = t_Treasure.Ins.getIcon(this._data.f_icon);
        this._ui.img.skin = t_Treasure.Ins.getQuaSkin(this._data.f_qua);
        this._ui.lab_name.text = this._data.f_treasure_name;
        this._ui.lab_lv.text = "lv:" + this._cfg.f_treasure_level;
        this._ui.lab_des.text = this._data.f_treasure_des;

        this.setDec();

        if(!this._bo){
            this._ui.spp.visible = false;
            this._ui.sp1.visible = false;
        }
    }

    private setDec(){
        this._ui.hd.style.fontSize = 24;
        this._ui.hd.style.family = "BOLD";
        this._ui.hd.style.leading = 10;
        this._ui.hd.style.stroke = 2;
        this._ui.hd.style.strokeColor = "#3a1c17";
        this._ui.hd.style.valign = "center";
        this._ui.hd.width = 460;
        
        let data = TowertMainLinbaoModel.Ins.getLinBaoById(this._data.f_treasureid);
        if(data){
            let cfg = t_Treasure_Upgrade.Ins.getCfgByIdAndLv(data.id,data.level);
            this._ui.hd.innerHTML = cfg.f_effect_des;
        }else{
            this._ui.hd.innerHTML = this._data.f_treasure_effect_des;
        }
        
        let w = this._ui.hd.contextWidth;
        this._ui.hd.x = (this._ui.width - w) * 0.5 - 10;
        this._ui.hd.width = w;
    }
}