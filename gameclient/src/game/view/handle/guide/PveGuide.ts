import { E } from "../../../G";
import { SommonHeroCost_revc } from "../../../network/protocols/BaseProto";
import { FightValueConfig } from "../compose/vos/FightValueConfig";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
import { MainModel } from "../main/model/MainModel";
import { ItemProxy } from "../main/proxy/ItemProxy";
import { BaseGuide } from "./BaseGuide";
import { IEnemyHero, IFightGuide } from "./FightGuide";
import { FightGuideUtils } from "./FightGuideUtils";
import { GuidePreCheck } from "./GuidePreCheck";
import { PveGuideData } from "./PveGuideData";
/**PVE新手引导 */
export class PveGuide extends BaseGuide implements IFightGuide{
    // enemyMoney: stCellValue[] = [];
    enemyHeros: IEnemyHero[] = [];
    curWave: number;
    private guidePreCheck:GuidePreCheck;
    /**初始化引导已经召唤了的次数 */
    sommonCount:number;
    clientFresh() {
        let itemId:number = this.curData.sommonPriceItemId;
        if(MainModel.Ins.mRoleData.getVal(itemId) < this.sommonNeedVal){
            E.ViewMgr.ShowMidLabel(E.getLang("itemnotenough",ItemProxy.Ins.getCfg(itemId).f_name));
            return;
        }
        FightGuideUtils.clientFresh(this.ownerHerosPool,this,this.updateSommonHeroCost,this.onSucceedHandler);
    }

    private onSucceedHandler(){
        this.sommonCount++;
    }

    createSelfHero(str: string) {
        return FightGuideUtils.createHeroVo(str,this.selfId);
    }
    // clientWatchHero(uid: number) {
    //     throw new Error("Method not implemented.");
    // }

    curWaveSec: number = FightValueConfig.WaveSec;
    selfId:number;//自己的id
    enemyId:number;//敌方id

    /**每次召唤的价格*/
    private sommonNeedVal:number;
    //==================================================
    // private static _ins: PveGuide;
    // static get Ins() {
    //     if (!this._ins) {
    //         this._ins = new PveGuide();
    //     }
    //     return this._ins;
    // }

    constructor(){
        super();
    }

    clearData(){
        if(this.guidePreCheck){
            this.guidePreCheck.dispose();
            this.guidePreCheck = null;
        }

        // if(this.proxy){
        //     this.proxy.dispose();
        //     this.proxy = null;
        // }

        this.stop();
        if(this.curData){
            this.curData.dispose();
            this.curData = null;
        }
        this.clearEvt();
    }

    initData(){
        this.guidePreCheck = new GuidePreCheck(this);
        FightGuideUtils.clearUID();
        this.sommonCount = 0;
        this.curData = new PveGuideData();
        this.curData.target = this;
        this.curData.init();
        // this.model.curAdapter = this.model.fightPveAdapterGuide;
        this.model.setPveFightAdapter();
        this.model.curAdapter.init();
  
        //=============================================================

        this.selfId = this.curData.selfId;
        this.enemyId = this.curData.enemyId;
   
        //===========================================================================
        // this.waveList = FightGuideUtils.createWaves(this.curData.waveConfigStr);
        this.sommonNeedVal = this.curData.sommonPriceInitVal;//parseInt(sommon[0]);
        this.updateSommonHeroCost();
        //=============================================================
        
        this.onInit();
    }
    
    private updateSommonHeroCost(){
        let revc = new SommonHeroCost_revc();
        revc.moneyInfo = ItemViewFactory.convertCellList(`${this.curData.sommonPriceItemId}-${this.sommonNeedVal}`);
        this.sommonNeedVal += this.curData.sommonOffsetPrice;
        this.model.onSommonHeroCost(revc);
    }
}