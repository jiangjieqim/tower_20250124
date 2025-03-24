// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { stBox } from "../../../../network/protocols/BaseProto";
import { TeQuanKaModel } from "../../activity/tequanka/TeQuanKaModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { IconUtils } from "../../main/model/IconUtils";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainFightModel } from "../model/TowerMainFightModel";
import { t_Box_Falling_Rate } from "../proxy/t_Box_Falling_Rate";
import { t_Box_Match } from "../proxy/t_Box_Match";
import { t_Box_Reward_Rate } from "../proxy/t_Box_Reward_Rate";

export class BoxView extends ViewBase{
    private _ui:ui.views.main.ui_baoxiangViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_baoxiangViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn3, new Laya.Handler(this, this.onBtn3Click)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2, new Laya.Handler(this, this.onBtn2Click))
            )
        }
    }

    private onBtn1Click(){
        E.ViewMgr.OpenByFuncid(EFuncDef.TeQuanKa);
    }

    private onBtn2Click(){
        E.ViewMgr.OpenByFuncid(EFuncDef.TeQuanKa);
    }

    private onBtnClick() {
        if (!this._data) return;
        TowerMainFightModel.Ins.sendCmd(0,this._data.pos);
        this.Close();
    }

    private onBtn3Click() {
        if (!this._data) return;
        TowerMainFightModel.Ins.sendCmd(2,this._data.pos);
        this.Close();
    }

    private _data:stBox;
    protected onInit(): void {
       this.updateView();
    }

    protected onExit(): void {
        
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
        if(this._data.state == 3){
            this._ui.sp.visible = true;
            this._ui.sp1.visible = this._ui.sp2.visible = false;
            let fCfg = t_Box_Falling_Rate.Ins.getCfgByQua(cfg.f_box_qua);
            this._ui.lab4.text = TimeUtil.subTimeC(TeQuanKaModel.Ins.getTime(fCfg.f_opentime));
        }else{
            this._ui.sp.visible = false;
            this._ui.sp1.visible = this._ui.sp2.visible = true;
            this._ui.icon2.skin = IconUtils.getIconByCfgId(ECellType.SHUIJING);
            if(this._data.costs.length){
                this._ui.lab5.text = "x" + this._data.costs[0].count;
            }else{
                this._ui.lab5.text = "x0";
            }
        }

        this._ui.lab11.text = E.getLang("baoxiang1");
        this._ui.lab22.text = E.getLang("baoxiang2");
        if(TeQuanKaModel.Ins.isOpenZSK()){
            this._ui.btn1.visible = false;
            this._ui.img11.visible = true;
        }else{
            this._ui.btn1.visible = true;
            this._ui.img11.visible = false;
        }
        if(TeQuanKaModel.Ins.isOpenYueKa()){
            this._ui.btn2.visible = false;
            this._ui.img22.visible = true;
        }else{
            this._ui.btn2.visible = true;
            this._ui.img22.visible = false;
        }
    }
}