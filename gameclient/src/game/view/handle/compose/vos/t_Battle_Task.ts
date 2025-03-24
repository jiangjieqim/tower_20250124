import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export interface IBattleTaskCfg{
    getByTaskId(taskId:number):Configs.t_Battle_Task_dat;
}
/**
 * Pvp局内任务
 */
export class t_Battle_Task extends BaseCfg{
    static NAME:string = "t_Battle_Task";
    GetTabelName(){
        return t_Battle_Task.NAME;
    }
    // private static _ins: t_Battle_Task;
    // public static get Ins() {
    //     if (!this._ins) {
    //         this._ins = new t_Battle_Task();
    //     }
    //     return this._ins;
    // }
    getByTaskId(taskId:number):Configs.t_Battle_Task_dat{
        let l:Configs.t_Battle_Task_dat[] = this.List;
        // return l.find(o=>o.f_TaskID == taskId);
        return l.find(o=>o.f_id == taskId);
    }
}
/**
 * Pve局内任务
 */
export class t_Battle_Task_Coop extends t_Battle_Task{
    static NAME:string = "t_Battle_Task_Coop";

    GetTabelName(){
        return t_Battle_Task_Coop.NAME;
    }
}

export class t_Battle_Task_Template extends BaseCfg{
    GetTabelName(){
        return "t_Battle_Task_Template";
    }
    private static _ins: t_Battle_Task_Template;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Battle_Task_Template();
        }
        return this._ins;
    }
    getCfgByType(type:number){
        let l:Configs.t_Battle_Task_Template_dat[] = this.List;
        return l.find(o=>o.f_task_type == type);
    }
}
export enum EBattleTaskType{
    /**场上同时存在英雄id1,2,3这三个英雄 */
    SerachHero = 1
}

export enum EBattleTaskStatus{
    /**0未完成 */
    NotComplete = 0,
    /**1已完成（奖励再任务完成时自动发放） */
    Complete = 1
}