import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { FightFactory } from "../../../compose/FightFactory";
import { HeroAvatarView } from "../../../compose/views/HeroAvatarView";
import { IconUtils } from "../../../main/model/IconUtils";
import { MainModel } from "../../../main/model/MainModel";
import { TowertMainHeroModel } from "../../model/TowertMainHeroModel";
import { HeroListLvProxy, HeroListProxy } from "../../proxy/HeroProxy";
import { t_Hero_Skin } from "../../proxy/t_Hero_Skin";

export class HeroItem extends ui.views.hero.ui_heroItemUI{
    private _heroAnim:HeroAvatarView;
    private _wid:number;
    constructor() {
        super();
        this._wid = this.pro.width;
        this.on(Laya.Event.CLICK,this,this.onClick);
        this.on(Laya.Event.UNDISPLAY,this,this.disposeHero);
    }

    private onClick(){
        if(!this._data)return;
        // if(this._data.f_qua <= 3){
        //     E.ViewMgr.Open(EViewType.HeroTip,null,this._data);
        // }else{
        //     E.ViewMgr.Open(EViewType.HeroTip1,null,this._data);
        // }
        // MainModel.Ins.event(TowerMainEvent.ButtonCtlClick,this);
        E.EventMgr.emit(EventID.ButtonCtlClick,this);
        E.ViewMgr.Open(EViewType.HeroTip1,null,this._data);
    }
    private disposeHero() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }
    private _data:Configs.t_Hero_dat;
    public setData(value:Configs.t_Hero_dat){
        if(!value)return;
        this._data = value;
        this.disposeHero();
        let skinId = TowertMainHeroModel.Ins.getSkinIdById(value.f_heroid);
        let cfg = t_Hero_Skin.Ins.getCfgById(skinId);
        let arr = cfg.f_pos_herolist.split("|");
        this._heroAnim = FightFactory.createBigHeroAvatar(value.f_heroid, this,parseInt(arr[0]),parseInt(arr[1]));

        this.img.skin = HeroListProxy.Ins.getQuaSkin(value.f_qua);
        this.lab.text = value.f_hero;
        let data = TowertMainHeroModel.Ins.getHeroById(value.f_heroid);
        this.collectImg.skin = IconUtils.getCollectSkin(data,true);
        this.lab1.text = "LV:" + data.level;
        this.sp.visible = false;
        let nextCfg = HeroListLvProxy.Ins.getNextCfgByIdAndLv(data.id,data.level);
        if(nextCfg){
            this.sp1.visible = true;
            this.mj.visible = false;
            let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(data.id,data.level);
            let arr = cfg.f_consumption.split("|");
            let id = parseInt(arr[0].split("-")[0]);
            let need = parseInt(arr[0].split("-")[1]);
            let count = MainModel.Ins.mRoleData.getVal(id);
            if(count >= need){
                this.pro.width = this._wid;
                this.sp.visible = true;
            }else{
                this.pro.width = count / need * this._wid;
            }
            this.lab2.text = count + "/" + need;
        }else{
            this.sp1.visible = false;
            this.mj.visible = true;
        }
    }
}