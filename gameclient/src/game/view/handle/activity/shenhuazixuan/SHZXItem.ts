import { ui } from "../../../../../ui/layaMaxUI";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";

export class SHZXItem extends ui.views.shenhuazixuan.ui_shzxItemUI{

    private _heroAnim:HeroAvatarView;

    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onUnDisplay(){
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }

    public setData(value:Configs.t_Mythical_Choice_dat,index:number,selIndex:number){
        if(!value)return;
        if(index == selIndex){
            this.img.visible = true;
        }else{
            this.img.visible = false;
        }
        let cfg = HeroListProxy.Ins.getCfgById(value.f_heroid);
        this.lab.text = cfg.f_hero;
        let imageId = TowertMainHeroModel.Ins.getDefImageIdById(cfg.f_heroid);
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
        this._heroAnim = FightFactory.createByImageId(imageId, this.sp,value.f_choice_offset);
        let data = TowertMainHeroModel.Ins.getHeroById(cfg.f_heroid);
        if (data) {
            this.sp1.visible = true;
        } else {
            this.sp1.visible = false;
        }
    }
}