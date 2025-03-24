import { ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { E } from "../../../../G";
import { TaodaePackageItemNode } from "../view/TaodaePackageItemSkin";
import { TaodaeTaskItemNode } from "../view/TaodaeTaskItemSkin";
import { TaoDaeModel } from "./TaoDaeModel";
import { t_Cover_Big_Goose_Pack } from "./t_Cover_Big_Goose_Pack";
import { t_Cover_Big_Goose_Task } from "./t_Cover_Big_Goose_Task";

export enum ETaodaeLingQu{
    /**0不可领取 */
    NotGet = 0,
    /**1可领取 */
    CanGet = 1,
    /**2已经领取 */
    IsGet = 2,
}
//===============================================================================================
export enum ETaoDaeType{
    /**任务 */
    Task = 1,
    /**礼包 */
    Package = 2
}
export class TaodaeFactory{
    
    static renderList(panel: ScrollPanelControl, type: ETaoDaeType, tf: Laya.Label) {
        panel.clear();

        let datalist = [];
        let cls;
        switch(type){
            case ETaoDaeType.Package:
                datalist = E.tableMgr.getTable(t_Cover_Big_Goose_Pack.NAME).List;
                datalist = datalist.sort(TaoDaeModel.Ins.onSortPackage);
                cls = TaodaePackageItemNode;
                break;
            case ETaoDaeType.Task:
                datalist = E.tableMgr.getTable(t_Cover_Big_Goose_Task.NAME).List;
                datalist = datalist.sort(TaoDaeModel.Ins.onSortTask);
                cls = TaodaeTaskItemNode;
                break;
        }
        tf.text = E.getLang("taodaeTitleArr").split("|")[type-1];
        if(cls){
            panel.split(datalist,cls);
        }
        panel.end();
    }
}