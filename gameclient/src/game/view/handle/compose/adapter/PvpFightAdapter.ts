import { ui } from "../../../../../ui/layaMaxUI";
import { stTask } from "../../../../network/protocols/BaseProto";
import { t_Arena } from "../../towertmaincard/proxy/t_Arena";
import { It_MonsterCfg } from "../t_Monster_Template";
import { FightHeadCtl, IFightHead } from "../views/cells/FightHead";
import { EFightMode } from "../vos/EFightEnum";
import { IBattleTaskCfg } from "../vos/t_Battle_Task";
import { IEnemy_WaveCfg } from "../vos/t_Enemy_Wave";
import { IFightTypeAdapter } from "./FightTypeAdapter";

/**
 * Pvp战斗
 */
export class PvpFightAdapter extends IFightTypeAdapter{    
    // vs:string = `o/spine/scene/vs/vs`;
    // centerOffsetY:number = 0;
    // readonly offsetIsoY:number = 0;
    // fightViewY:number = 595;
    // bg:string =  `static/bj_6.jpg`;//`static/fbg.jpg`;
    monsterCfg:It_MonsterCfg;
    waveCfg:IEnemy_WaveCfg;
    battleTask:IBattleTaskCfg;
    topOffsetY:number;
    // checkCount:number;
    constructor(){
        super(EFightMode.PVP);
        // this.monsterCfg = t_MonsterPvp.Ins;//new t_MonsterPvp();
        // this.waveCfg = t_Enemy_Wave.Ins;//new t_Enemy_Wave();
        // this.battleTask = new t_Battle_Task();
        // this.topOffsetY = -ComposeConfig.mapH * ComposeConfig.MapCellH * 5;
        // this.checkCount = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.PVP_MAX_TIPS));
    }
    createVsSkin(){
        return new ui.views.compose.ui_fight_vsUI();
    }
    createFightTop():IFightHead{
        let skin = new FightHeadCtl();
        // skin.heart = false;
        return skin;
    }

    get maxCardCount():number{
        return this.model.cardMaxCount;
    }

    get taskTitle():string{
        let tasks:stTask[] = this.model.curTasks;
        if(tasks.length){
            let _task = tasks[0];
            let cfg = this.model.fightTypeAdaper.battleTask.getByTaskId(_task.taskId);
            if(cfg){
                let _arenaCfg = t_Arena.Ins.getCfgById(cfg.f_arenaid);
                if(_arenaCfg){
                    return _arenaCfg.f_name;
                }
            }
        }
        return "";
    }
   
}