// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { ui } from "../../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { MainModel } from "../../../main/model/MainModel";
import { ItemVo } from "../../../main/vos/ItemVo";
import { FightUIFactory } from "../../FightUIFactory";
import { FightTaskHeroCellVo } from "../../vos/FightTaskHeroCellVo";

/**局内任务元素 */
export class FightTaskHeroCell extends ui.views.compose.fightcell.ui_fight_task_hero_cellUI {
    public static CLS_KEY: string = "FightTaskHeroCell";
    setData(str:string|FightTaskHeroCellVo) {
        // let arr = str.split("-");
        if(str instanceof FightTaskHeroCellVo){
            //英雄id
            let _vo = str as FightTaskHeroCellVo;
            let heroId = _vo.heroId;
            
            // let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(heroId);
            // let imageId = TowertMainHeroModel.Ins.getDefImageIdById(heroId)
            // this.icon.skin = HeroListProxy.Ins.getSmallIconSkin(imageId);
            // this.qua.skin = HeroListProxy.Ins.getSmallQuaSkin(_heroCfg.f_qua);

            FightUIFactory.setDefaultHeroIcon(this,heroId);

            if(_vo.count > 0){
                this.gouicon.visible = true;
            } else {
                this.gouicon.visible = false;
            }
            this.countTf.visible = false;
            DebugUtil.drawTF(this,heroId+"");
        }
        else{
            let _needitemVo:ItemVo = ItemViewFactory.convertItem(str);
            this.qua.skin = _needitemVo.quaIcon();
            this.icon.skin = _needitemVo.getIcon();
            if(MainModel.Ins.mRoleData.getVal(_needitemVo.cfgId) >= _needitemVo.count){
                this.gouicon.visible = true;
            }else{
                this.gouicon.visible = false;
            }
            this.countTf.visible = true;
            this.countTf.text = _needitemVo.count > 1 ? (_needitemVo.count + "") : "";
            DebugUtil.drawTF(this,str);
        }
    }
}