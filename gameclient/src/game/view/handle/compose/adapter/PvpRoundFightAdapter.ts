import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { RougeChoose_revc, RougeList_revc } from "../../../../network/protocols/BaseProto";
import { PlayerVoFactory } from "../../main/vos/PlayerVoFactory";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { EPvpRoundReady } from "../PvpRoundReady";
import { EBattle_Config, EHeroQua, t_Battle_Config } from "../t_Battle_Config";
import { IFightHead } from "../views/cells/FightHead";
import { FightPvpRoundHead } from "../views/cells/FightPvpRoundHead";
import { EFightMode } from "../vos/EFightEnum";
import { EPVPRoundFightStatus } from "./FightAdapter";
import { IFightTypeAdapter } from "./FightTypeAdapter";

/**
 * 回合制PVP
 */
export class PvpRoundFightAdapter extends IFightTypeAdapter{
    // protected readonly gambleStartId:number = 66;
    constructor(){
        super(EFightMode.PVP_Round);
    }
    /**是否禁用操作*/
    get disableOperate() {
        if(this.pvpRoundStatus == EPVPRoundFightStatus.Ready){
            return false;
        }
        return true;
    }
    /**是否禁用英雄拖拽 */
    get disableDrag(): boolean {
        let drag = parseInt(t_Battle_Config.Ins.getValueById(75));
        if (!drag) {
            if(this.disableOperate){
                return true;
            }
        }
        return false;
    }
    createVsSkin() {
        return new ui.views.compose.ui_fight_vsUI();
    }

    createFightTop():IFightHead{
        // let skin = new FightHeadCtl();
        let skin = new FightPvpRoundHead();
        return skin;
    }

    get taskTitle():string{
        return "";
    }
    /**祈愿退出 */
    gambleExit(){
        if(this.pvpRoundStatus ==  EPVPRoundFightStatus.Ready){
            E.ViewMgr.Open(EViewType.PvpRoundView);
        }
    }
    /**祈愿打开 */
    gambleOpen(){
        E.ViewMgr.Open(EViewType.Gamble);
        E.ViewMgr.Close(EViewType.PvpRoundView);
        // Laya.timer.callLater(this,this.onClosePvpRoundView);
    }

    // private onClosePvpRoundView(){
    // E.ViewMgr.Close(EViewType.PvpRoundView);
    // }
    fightEnter(){
        // E.ViewMgr.Open(EViewType.PvpRoundView);
    }
    /**肉鸽打开 */
    onRougeOpen(revc: RougeList_revc) {
        E.ViewMgr.Open(EViewType.PvpRoundCard, null, revc);
    }
    /**肉鸽选择 */
    onRougeSelect(revc: RougeChoose_revc) {
        E.ViewMgr.Open(EViewType.PvpRoundCardPop, null, revc);
    }

    onPvpRoundStatusChange(){
        let status: EPVPRoundFightStatus = this.pvpRoundStatus;
        LogSys.Log(`pvpround当前的状态:${status}`);

        switch (status) {
            case EPVPRoundFightStatus.Ready:
                E.ViewMgr.Open(EViewType.PvpRoundReady, null, EPvpRoundReady.AllReady);
                break;

            case EPVPRoundFightStatus.Fight:
            case EPVPRoundFightStatus.StartSelCard:
            case EPVPRoundFightStatus.EndSelCard:
                E.ViewMgr.Close(EViewType.PvpRoundReady);
                break;

            case EPVPRoundFightStatus.SelfReadyComplete:
                E.ViewMgr.Open(EViewType.PvpRoundReady, null, EPvpRoundReady.WaitEmeny);
                break;
        }
        //===================================================================================
        switch(status){
            case EPVPRoundFightStatus.Ready:
                E.ViewMgr.Open(EViewType.PvpRoundView);
                E.ViewMgr.Close(EViewType.PvpRoundFightView);
                break;
            default:
                E.ViewMgr.Close(EViewType.Gamble);
                E.ViewMgr.Close(EViewType.PvpRoundView);
                E.ViewMgr.Open(EViewType.PvpRoundFightView);
                break;
        }
    }

    getSellMoney(heroId: number) {
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        let id: EBattle_Config;
        switch (cfg.f_qua) {
            case EHeroQua.White:
                // return this.getWhiteCost();
                id = 62;
                break;
            case EHeroQua.Blue:
                id = 63;
                break;
            case EHeroQua.Purple:
                id = 64;
                break;
            case EHeroQua.Orange:
                id = 65;
                break;
        }
        let str: string = t_Battle_Config.Ins.getValueById(id);
        return PlayerVoFactory.str2stCellValue(str);
    }
}