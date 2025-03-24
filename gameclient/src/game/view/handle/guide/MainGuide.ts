import { stCellValue } from "../../../network/protocols/BaseProto";
import { FightValueConfig } from "../compose/vos/FightValueConfig";
import { ESystemRefreshTime } from "../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../main/ctl/System_RefreshTimeProxy";
import { ERedEnum } from "../main/model/ERedEnum";
import { ECommonClaimType, MainModel } from "../main/model/MainModel";
import { IEnemyHero, IFightGuide } from "./FightGuide";
import { EGuideEvent, GuideModel, t_Tasks_Guide } from "./GuideModel";
import { MainGuideData } from "./MainGuideData";
import { EGuideMode } from "./PveGuideAdapter1";

/**
 * 主线引导
 */
export class MainGuide implements IFightGuide{
    selfId: number;
    enemyId: number;
    curMs: number;
    allMs: number;
    curWave: number;
    clientFresh() {
        // throw new Error("Method not implemented.");
    }
    enemyMoney: stCellValue[];
    createSelfHero(str: string) {
        // throw new Error("Method not implemented.");
    }
    enemyHeros: IEnemyHero[];
    curWaveSec: number;
    //=============================================================
    private proxy:t_Tasks_Guide;

    private curData:MainGuideData;
    private get maxTaskId():number{
        let taskId:number = parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.MAIN_GUIDE_MAX_TASKID));
        return taskId;
    }
    constructor(){
        GuideModel.Ins.on(EGuideEvent.ClearData,this,this.clearData);
    }
    sommonCount: number;
    initData() {
        // throw new Error("Method not implemented.");
        this.curData = new MainGuideData();
        this.curData.maxTaskId = this.maxTaskId;
        this.curData.init();
        // if(!this.proxy){
        // this.proxy = new t_Tasks_Guide("t_Main_Tasks_Guide");
        // }
        this.proxy = GuideModel.Ins.getTable("t_Main_Tasks_Guide");
        GuideModel.Ins.proxy = this.proxy;
        GuideModel.Ins.clear();

        let l = this.proxy.List;
        let cfg:Configs.t_Tasks_Guide_dat = l[l.length-1];
        if(cfg.f_TaskID < this.maxTaskId){
            LogSys.Error(`请检查配置 引导f_TaskID最大值是否溢出...`);
        }

    }
    clearData() {
        // throw new Error("Method not implemented.");
        if(this.curData){
            this.curData.dispose();
            this.curData = null;
        }
        // if(this.proxy){
        //     this.proxy.dispose();
        //     this.proxy = null;
        // }
    }
    private get model(){
        return MainModel.Ins;
    }
    /**引导是否在运行中 */
    get isRunning() {
        if (Laya.Utils.getQueryString("disable_guide")) {
            return false;
        }

        let commonTimes = this.model.commonTimes;
        if (commonTimes) {

            //===========================================================================

            let _guide = this.model.guideAdapter;
            if (_guide) {
                if (_guide.mode == EGuideMode.PveGuide) {

                    let _pveChapter = commonTimes.find(o => o.flag == ECommonClaimType.PVE_GUIDE_STATUS);
                    let guide = commonTimes.find(o => o.flag == ECommonClaimType.USE_PVE_GUIDE);

                    if (!_pveChapter) {
                        return false;
                    }
                    if (!guide) {
                        return false;
                    }

                    if (guide.times == 0 && _pveChapter.times == 0) {
                        return false;//老玩家
                    }

                    if (_pveChapter.times == FightValueConfig.MAX_CHAPTER && guide.times == 1) {
                        return true;
                    }
                }
                else if(_guide.mode == EGuideMode.PvpRound){
                    if(_guide.isRunning){
                        return false;
                    }
                }
            }
            //===========================================================================
            

            let curTaskId: number = this.model.red.getValByID(ERedEnum.PVE_MAIN_GUIDE);
            if (curTaskId == undefined) {
                return true;
            }
            else if (curTaskId < this.maxTaskId) {
                return true;
            }
            return false;

        }
        LogSys.Error(`未初始化commonTimes...`);
    }

    // /**是否是PVE战斗 */
    // get isFightGuide(){
    //     let commonTimes = this.model.commonTimes;;
    //     if (commonTimes) {
    //         let _pveChapter = commonTimes.find(o => o.flag == ECommonClaimType.PVE_GUIDE_STATUS);
    //         let guide = commonTimes.find(o => o.flag == ECommonClaimType.USE_PVE_GUIDE);
    //         if (_pveChapter.times == FightValueConfig.MAX_CHAPTER && guide.times == 1) {
    //             return true;
    //         }
    //     }else{
    //         LogSys.Error(`isFightGuide 未初始化commonTimes...`);
    //     }
    // }
}