import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { stTask } from "../../../../network/protocols/BaseProto";
import { ComposeModel } from "../ComposeModel";
import { FightUIFactory } from "../FightUIFactory";
import { EBattleTaskStatus, EBattleTaskType } from "../vos/t_Battle_Task";

/**小任务item */
class Fight_taskLowSmallCell extends RowMoveBaseNode{
    protected clsKey:string = "ui_fight_task_cell1UI";
    protected createSkin(){
        return Laya.Pool.getItemByClass(this.clsKey, ui.views.compose.fightcell.ui_fight_task_cell1UI);
    }
    protected createNode(index) {
        let _skin: ui.views.compose.fightcell.ui_fight_task_cell1UI = this.createSkin();
        let vo:stTask = this.list[index];
        FightUIFactory.setTask(_skin,vo);

        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}
/**大任务item 场上同时存在英雄id1,2,3这三个英雄*/
class Fight_taskLowBigCell extends RowMoveBaseNode{
    protected clsKey:string = "ui_fight_task_cell0UI";
    protected createSkin(){
        return Laya.Pool.getItemByClass(this.clsKey, ui.views.compose.fightcell.ui_fight_task_cell0UI);
    }
    protected createNode(index) {
        let _skin: ui.views.compose.fightcell.ui_fight_task_cell0UI = this.createSkin();
        let vo:stTask = this.list[index];
        FightUIFactory.setTask(_skin,vo);

        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}
enum ETaskFightTab{
    /**所有任务 */
    All = 0,
    /**已经完成 */
    Complete = 1,
}
/**局内任务 */
export class FightTaskView extends ViewBase{
    protected mMask:boolean = true;;
    // protected mMaskClick:boolean = false;
    private _ui:ui.views.compose.ui_fight_taskUI;
    protected autoFree:boolean = true;
    private tabsCtl:TabControl;
    private _panelCtl: ScrollPanelControl;
    private model:ComposeModel;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("task.atlas");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.tabsCtl.dispose();
        this.tabsCtl = null;
        this._panelCtl.clear();
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_fight_taskUI();
            this.bindClose(this._ui.closeBtn);
            this.tabsCtl = new TabControl();
            const tabsSkin = [this._ui.tab0, this._ui.tab1];
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this, this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));
            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel1);
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this._ui.nameTf.text = this.model.fightTypeAdaper.taskTitle;
        this.tabsCtl.selectIndex = 0;
    }
    /**获取任务列表 */
    private getTaskList(v:number):stTask[]{
        let _curList:stTask[] = this.model.curTasks;
        if(v == ETaskFightTab.All){
            let _completeList = [];
            let _notCompleteList = [];
            _curList.forEach((o:stTask)=>{
                if(o.state == EBattleTaskStatus.Complete){
                    _completeList.push(o);
                }else{
                    _notCompleteList.push(o);
                }
            })
            return _notCompleteList.concat(_completeList)
        }else if(v == ETaskFightTab.Complete){
            let _completeList = [];
            _curList.forEach((o:stTask)=>{
                if(o.state == EBattleTaskStatus.Complete){
                    _completeList.push(o);
                }
            });
            return _completeList;
        }
    }
    private onTabSelectHandler(v: number) {
        // LogSys.Log(`onTabSelectHandler:${v}`);
        this._panelCtl.clear();
        let list1 = this.getTaskList(v);
        for (let i = 0; i < list1.length; i++) {
            let _data = list1[i];
            let battleTask = this.model.fightTypeAdaper.battleTask;
            if(battleTask){
                let cfg = battleTask.getByTaskId(_data.taskId);
                if (cfg) {
                    if (cfg.f_task_type == EBattleTaskType.SerachHero) {
                        this._panelCtl.split([_data], Fight_taskLowBigCell);
                    } else {
                        this._panelCtl.split([_data], Fight_taskLowSmallCell);
                    }
                }
                else {
                    E.debugMsgBox(`t_Battle_Task任务配置不存在${_data.taskId}`);
                }
            }
        }
        this._panelCtl.end();
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin:ui.views.compose.fightcell.ui_fight_task_tabUI = tabSkin;
        skin.tf.text = E.getLang("tasktabs").split("|")[index];
        if(sel){
            skin.tf.color = "#FFFFFF";
            skin.tf.stroke = 2;
            skin.tf.strokeColor = "#9F7505";
            skin.img.visible = true;
        }else{
            skin.tf.color = "#E5C491";
            skin.tf.stroke = 2;
            skin.tf.strokeColor = "3A1C17";
            skin.img.visible = false;
        }
    }
}