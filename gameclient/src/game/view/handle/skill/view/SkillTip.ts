import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SkillListProxy } from "../proxy/SkillProxy";

export class SkillTip extends ViewBase{
    protected mMask = true;
    protected maskAlpha = 0.3;
    private _ui: ui.views.common.ui_skillTipUI;

    protected onAddLoadRes() {
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.common.ui_skillTipUI();

            this._ui.hd.style.fontSize = 20;
            this._ui.hd.style.family = "BOLD";
            this._ui.hd.style.leading = 10;
            this._ui.hd.style.stroke = 2;
            this._ui.hd.style.strokeColor = "#2d2422";
        }
    }

    protected onInit(): void {
        let id = this.Data[0];
        let lv = this.Data[1];
        let cfg = SkillListProxy.Ins.getCfgById(id);
        this._ui.icon.skin = SkillListProxy.Ins.getIconById(id);//cfg.f_skillid
        if(cfg){
           
            this._ui.lab_name.text = cfg.f_skill_name;
            this._ui.icon1.skin = SkillListProxy.Ins.getIconByType(cfg);
            if(lv){
                this._ui.lock.visible = true;
                this._ui.lab.text = lv + E.getLang("lockdesc");
            }else{
                this._ui.lock.visible = false;
            }

            this._ui.hd.innerHTML = cfg.f_skill_dsc;
            this._ui.hd.width = 380;
        }else{
            this._ui.lab_name.text = `${id}`;
        }
    }

    protected onExit(): void {
        // Laya.Loader.clearTextureRes(this._ui.icon.skin);
    }
}