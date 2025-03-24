// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { stHero } from "../../../../../network/protocols/BaseProto";
import { TowertMainHeroModel } from "../../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../../towertmainhero/proxy/HeroProxy";
import { HeroWeight } from "../../vos/HeroWeight";
/**神话cell */
export class MythosCellView extends ui.views.compose.fightcell.ui_mythos_cell_viewUI{
    private _vo:stHero;
    constructor(){
        super();
    }
    refresh(){
        this._vo = this.dataSource;
        let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(this._vo.id);
        let imageId = TowertMainHeroModel.Ins.getImageIdById(_heroCfg.f_heroid);
        //TowertMainHeroModel.Ins.getDefImageIdById(this._vo.id)
        this.icon.skin = HeroListProxy.Ins.getSmallIconSkin(imageId);
        this.nameTf.text = `${E.getLang("succeedpercent")}${HeroWeight.calPercent(_heroCfg.f_heroid)}%`;
        DebugUtil.drawTF(this,_heroCfg.f_heroid+'');
    }
}