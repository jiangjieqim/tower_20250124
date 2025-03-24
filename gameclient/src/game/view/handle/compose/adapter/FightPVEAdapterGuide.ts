import { FightGuideUtils } from "../../guide/FightGuideUtils";
import { MainModel } from "../../main/model/MainModel";
import { EGambleType } from "../vos/GambleCfgVo";
import { ComposeMythosVo } from "./FightAdapter";
import { FightAdapterGuide } from "./FightAdapterGuide";
/**
 * PVE战斗引导
 */
export class FightPVEAdapterGuide extends FightAdapterGuide{
    get guide() {
        return MainModel.Ins.pveGuide;
    }
    bPvproundTime:boolean = false;

    private get curData(){
        return this.guide.curData;
    }
    
    heroUpgrade(uid: number) {
        FightGuideUtils.clientHeroUpgrade(this.guide.selfId,uid,this.curData.composeHeroConfigStr);
    }

    get clockTimeMs(){
        return this.guide.curMs;
    }

    gamble(type: EGambleType,need:number) {
        let list1:string[]=  this.curData['gambleConfigArr'+type];
        let str:string;
        let succeed:number = 1;
        if(list1.length){
            str = list1.shift();
        }
        if(StringUtil.IsNullOrEmpty(str) && this.guide.ownerGamblePool.length > 0){
            let gambleStr = this.guide.ownerGamblePool.shift();
            let arr = gambleStr.split("|");
            type = parseInt(arr[0]);
            str = arr[1];
            succeed = parseInt(arr[2]);
        }
        FightGuideUtils.gambleCreate(this.guide.selfId,type,str,need,succeed);
    }

    get heroMythos() {
        let s: string = this.curData.heroMythosConfigStr;
        if (StringUtil.IsNullOrEmpty(s) && this.guide.ownerMythosPool.length) {
            s = this.guide.ownerMythosPool.shift();
        }
        return s;
    }

    init(){
        this.mSkillVis = true;
    }

    composeMythos(){
        let outList: ComposeMythosVo[] = [];
        let s1 = this.guide.mythosHerosPool;
        if(!StringUtil.IsNullOrEmpty(s1)){
            let arr = s1.split("|");
            for (let i = 0; i < arr.length; i++) {
                let s = arr[i];
                if (!StringUtil.IsNullOrEmpty(s)) {
                    let cell = new ComposeMythosVo();
                    cell.mythosHeroId = parseInt(s);
                    cell.check();
                    outList.push(cell);
                }
            }
        }
        return outList;
    }
    // protected _haveItemCanUse:boolean = false;
    
    set haveItemCanUse(value:boolean){
        this._haveItemCanUse = value;
    }
    get haveItemCanUse(){
        // return this.model.bSommonEnough || this.model.bGambleHaveOneEnough;
        return this._haveItemCanUse;
    }
}