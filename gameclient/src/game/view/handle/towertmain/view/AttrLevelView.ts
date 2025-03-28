import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { stHero } from "../../../../network/protocols/BaseProto";
import { showFix, TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListLvProxy } from "../../towertmainhero/proxy/HeroProxy";

export class AttrLevelView extends ViewBase{
    private _ui:ui.views.main.ui_attrLevelViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_attrLevelViewUI();
        }
    }

    protected onInit(): void {
        if(!this.Data){
            return;
        }
        
        let value:stHero = this.Data;
        let count = TowertMainHeroModel.Ins.getAttr();
        let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(value.id,value.level);
        let cfg1 = HeroListLvProxy.Ins.getCfgByIdAndLv(value.id,value.level - 1);
        let num =  TowertMainHeroModel.Ins.convertGlobalAttribute(cfg);//parseInt(cfg.f_global_attribute.split(":")[1]);
        let num1 = 0;
        if (cfg1.f_global_attribute != "") {
            num1 = TowertMainHeroModel.Ins.convertGlobalAttribute(cfg1);//parseInt(cfg1.f_global_attribute.split(":")[1]);
        }
        num -= num1;
        let cc = count - num;
        this._ui.lab.text = (cc / 100).toFixed(showFix) + "%";
        this._ui.lab1.text = (count / 100).toFixed(showFix) + "%";
    }

    protected onExit(): void {
    }
}