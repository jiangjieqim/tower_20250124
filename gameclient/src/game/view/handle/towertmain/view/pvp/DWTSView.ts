import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { RoleInfoModel } from "../../../roleinfo/model/RoleInfoModel";
import { t_Medal } from "../../proxy/t_Medal";

export class DWTSView extends ViewBase{
    protected mMask = true;
    protected mMainSnapshot = true;
    protected mMaskClick:boolean = false;

    protected autoFree:boolean = true;

    private _hzEff:SimpleEffect;

    private _ui:ui.views.main.ui_dwtsViewUI;

    protected onAddLoadRes(): void { 
        
    }

    protected onFirstInit(): void { 
        if(!this.UI){
            this.UI = this._ui = new ui.views.main.ui_dwtsViewUI();
            this.bindClose(this._ui.btn);
        }
    }


    protected onInit(): void {
        this._ui.btn.visible = false;
        this._ui.lab.visible = false;
        let trophy = RoleInfoModel.Ins.getMaxTrophy();
        let cfg = t_Medal.Ins.getCfgByTr(trophy);
        this._ui.lab.text = cfg.f_rank_name;
        
        if(this._hzEff){
            this._hzEff.dispose();
            this._hzEff = null;
        }
        this._hzEff = new SimpleEffect(this._ui.sp, `o/spine/succeed/${cfg.f_medal_sp}/${cfg.f_medal_sp}`,this._ui.sp.width*0.5,100);
        this._hzEff.play(0,false,this,this.endplay);
    }

    protected onExit(): void {
        if(this._hzEff){
            this._hzEff.dispose();
            this._hzEff = null;
        }
    }

    private endplay(){
        this._hzEff.play(1,true);
        this._ui.btn.visible = true;
        this._ui.lab.visible = true;
    }
}