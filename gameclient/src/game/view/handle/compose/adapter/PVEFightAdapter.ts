import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { RougeChoose_revc, RougeList_revc, stTask } from "../../../../network/protocols/BaseProto";
import { IFightHead } from "../views/cells/FightHead";
import { FightHeadFriend } from "../views/cells/FightHeadFriend";
import { EFightMode } from "../vos/EFightEnum";
import { IFightTypeAdapter } from "./FightTypeAdapter";
/**合作模式战斗 */
export class PVEFightAdapter extends IFightTypeAdapter {
    constructor(_mode: EFightMode){
        super(_mode);
    }

    createVsSkin(){
        return new ui.views.compose.ui_fight_pve_vsUI();
    }
    
    createFightTop(): IFightHead {
        return new FightHeadFriend();
    }

    get taskTitle():string{
        let tasks:stTask[] = this.model.curTasks;
        if(tasks.length){
            let _task = tasks[0];
            let cfg = this.model.fightTypeAdaper.battleTask.getByTaskId(_task.taskId);
            if(cfg){
                return E.getLang(`pvename${cfg.f_arenaid}`);
            }
        }
        return "";
    }

    /**肉鸽打开 */
    onRougeOpen(revc: RougeList_revc) {
        E.ViewMgr.Open(EViewType.GiftView, null, revc);
    }
    /**肉鸽选择 */
    onRougeSelect(revc: RougeChoose_revc) {
        E.ViewMgr.Open(EViewType.GiftViewPop, null, revc);
    }
}