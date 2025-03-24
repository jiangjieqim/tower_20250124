import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { TowertMainHeroModel } from "../../model/TowertMainHeroModel";

export class HeroItem2 extends ui.views.hero.ui_heroItem2UI{
    constructor() {
        super();
        this.ht.style.fontSize = 24;
        this.ht.style.family = "BOLD";
        this.ht.style.stroke = 4;
        this.ht.style.strokeColor = "#3a1c17";
    }

    public setData(value:Configs.t_Hero_upgrade_dat,lv:number){
        if(!value)return;
        this.lab.text = E.getLang("LV") + value.f_herolevel;
        this.ht.innerHTML = value.f_client_skill;
        this.ht.width = 395;
        if(lv >= value.f_herolevel){
            this.lock.visible = false;
            this.sp.visible = this.sp1.visible = false;
        }else{
            this.lock.visible = true;
            if(TowertMainHeroModel.Ins.isHeroLv(value.f_heroid,lv)){
                if(lv+1 == value.f_herolevel){
                    this.sp.visible = true;
                    this.sp1.visible = false;
                }else{
                    this.sp.visible = false;
                    this.sp1.visible = true;
                }
            }else{
                this.sp.visible = false;
                this.sp1.visible = true;
            }
        }
    }
}