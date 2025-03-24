import { ui } from "../../../../../../ui/layaMaxUI";
import { IconUtils } from "../../../main/model/IconUtils";
import { TowertMainHeroModel } from "../../model/TowertMainHeroModel";
import { HeroListProxy } from "../../proxy/HeroProxy";

export class HeroItem3 extends ui.views.hero.ui_heroItem3UI{
    constructor() {
        super();
    }

    public setData(value:any,flag:boolean){
        if(!value)return;
        this.sp.visible = flag;
        if(value.type == 1){
            this.icon.visible = true;
            this.icon1.visible = this.lab.visible = false;
            let cfg = HeroListProxy.Ins.getCfgById(value.data);
            this.img.skin = HeroListProxy.Ins.getSmallQuaSkin(cfg.f_qua);
            let imageId = TowertMainHeroModel.Ins.getDefImageIdById(value.data)
            this.icon.skin = HeroListProxy.Ins.getSmallIconSkin(imageId);
        }else{
            this.icon.visible = false;
            this.icon1.visible = this.lab.visible = true;
            this.img.skin = HeroListProxy.Ins.getSmallQuaSkin(1);
            let id = parseInt(value.data.split("-")[0]);
            let val = parseInt(value.data.split("-")[1]);
            this.icon1.skin = IconUtils.getIconByCfgId(id);
            this.lab.text = "x" + val;
        }
    }
}