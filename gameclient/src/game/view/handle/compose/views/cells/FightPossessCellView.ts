// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { RowMoveBaseNode } from "../../../../../../frame/view/ScrollPanelControl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { FightPossessVo } from "../../vos/FightPossessVo";
import { t_Battle_StatisticsProxy } from "../../vos/t_Battle_Statistics";

/**标题 */
export class FightPossessCellTitleView extends RowMoveBaseNode {
    protected clsKey: string = "ui_fight_poss_title_cell";
    protected createNode(index: any) {
        // throw new Error("Method not implemented.");
        let _skin: ui.views.compose.fightcell.ui_fight_poss_title_cellUI = Laya.Pool.getItemByClass(this.clsKey, ui.views.compose.fightcell.ui_fight_poss_title_cellUI);
        let title: string = this.list[index];
        _skin.tf.text = title;
        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}
/**内容 */
export class FightPossessCellView extends RowMoveBaseNode {
    protected clsKey: string = "ui_fight_poss_content_cell2";
    private readonly _progressWidth: number = 263;
    protected createNode(index: any) {
        // throw new Error("Method not implemented.");
        let _skin: ui.views.compose.fightcell.ui_fight_poss_content_cell2UI = Laya.Pool.getItemByClass(this.clsKey, ui.views.compose.fightcell.ui_fight_poss_content_cell2UI);
        
        let id:number = this.list[index];
        
        let cfg = t_Battle_StatisticsProxy.Ins.getByType(id);

        let vo: FightPossessVo = new FightPossessVo(cfg);

        _skin.tf.text = cfg.f_des;
        _skin.blueTf.text = vo.leftVal + "";
        _skin.redTf.text = vo.rightVal + ""

        if (vo.leftVal == 0 && vo.rightVal == 0) {
            // _skin.blue.visible = _skin.red.visible = false;
            _skin.blue.width =  _skin.red.width = this._progressWidth/2;
        } else {
            // _skin.blue.visible = _skin.red.visible = true;
            let max: number = vo.leftVal + vo.rightVal;
            let p = vo.leftVal / max;
            _skin.blue.width = p * this._progressWidth;
            _skin.red.width = (1 - p) * this._progressWidth;
        }

        _skin.x = index * _skin.width;
        _skin.y = this.y;

        DebugUtil.drawTF(_skin,`${cfg.f_id}`);
        return _skin;
    }
}