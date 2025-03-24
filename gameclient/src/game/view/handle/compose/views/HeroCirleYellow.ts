import { ui } from "../../../../../ui/layaMaxUI";
import { stElement } from "../../../../network/protocols/BaseProto";
import { ComposeConfig } from "../ComposeConfig";
import { FightUtils } from "../FightUtils";
/**攻击区域圈 */
export class HeroCirleYellow extends ui.views.compose.fightcell.ui_fight_hero_cirleUI{
    constructor(){
        super();
        this.mouseThrough = true;
        this.mouseEnabled = false;
    }

    show(vo:stElement) {
        // let vo = ComposeModel.Ins.refreshList.find(o => o.uid == uid);
        // if (vo) {
            this.bg.width = this.bg.height = FightUtils.calculateFightRadiu(vo.fid) * 2;
            this.x = ComposeConfig.cellW / 2;
            this.y = ComposeConfig.cellH / 2;
        // } else {
        // this.close();
        // }
    }

    close(){
        this.removeSelf();
    }

}