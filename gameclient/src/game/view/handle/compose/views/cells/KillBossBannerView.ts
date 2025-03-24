import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { KillBoss_revc } from "../../../../../network/protocols/BaseProto";
import { NoContainerSimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ComposeModel } from "../../ComposeModel";
import { EBattle_Config, t_Battle_Config } from "../../t_Battle_Config";
// import { t_Monster } from "../../t_Monster_Template";
/**妖王击杀奖励 */
export class KillBossBannerView extends ViewBase{
    private vo:KillBoss_revc;
    private _ui:ui.views.compose.fightcell.ui_kill_bossUI;
    private effect:NoContainerSimpleEffect;
    private model:ComposeModel;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        this.disposeEffect();
        // throw new Error("Method not implemented.");
        Laya.timer.callLater(this,this.onLayer);
    }

    private onLayer(){
        if(this.model.killMsgList.length){
            let vo = this.model.killMsgList.shift();
            this.model.onKillBoss(vo);
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.fightcell.ui_kill_bossUI();
        }
    }
    private disposeEffect(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }
    protected onInit(): void {
        let vo:KillBoss_revc = this.Data;
        this.vo = vo;
        // throw new Error("Method not implemented.");

        // D:\Project1\Client\towertrunk\resource\o\spine\succeed\KillKing
        //o/spine/succeed
        this.disposeEffect();
        // youxianjisha
        let url:string;
        let rewards:string = "";
        // if(vo.firstKill){
        //     url = `o/spine/succeed/youxianjisha/youxianjisha`;
        //     rewards=t_Battle_Config.Ins.getValueById(EBattle_Config.FirstKillBoss);
        // }
        // else{
        //     url = `o/spine/succeed/KillKing/KillKing`;
        //     rewards = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(vo.bossId).f_kill_reward;
        // }

        //===============================================================================================
        switch (vo.firstKill) {
            case 1:
                //1pvp优先击杀
                url = `o/spine/succeed/youxianjisha/youxianjisha`;
                rewards = t_Battle_Config.Ins.getValueById(EBattle_Config.FirstKillBoss);
                break;

            case 2:
                //2pve快速击杀
                url = `o/spine/succeed/youxianjisha/youxianjisha`;
                rewards = t_Battle_Config.Ins.getValueById(EBattle_Config.PVE_FAST_REWARD);
                break;
            default:
                //击杀妖王
                url = `o/spine/succeed/KillKing/KillKing`;
                rewards = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(vo.bossId).f_kill_reward;
                break;
        }
        //===============================================================================================
        this._ui.con1.visible = false;
        ItemViewFactory.renderItemSlots(this._ui.con1,rewards);
        this.effect = SpineEffectMgr.createNoSimpleEffect(url,this._ui,this._ui.width/2,this._ui.height/2 + 100,0);
        this.effect.on(Laya.Event.LABEL,this,this.onLabelEvt);
        this.effect.play(0, false, this, this.onPlayEnd);
    }

    private onLabelEvt(e) {
        if (e.name == 'show') {
            this._ui.con1.visible = true;
        }
        else if(e.name == "OUT"){
            this._ui.con1.visible = false;
        }
    }
 
    private onPlayEnd(){
        this.Close();
    }
}