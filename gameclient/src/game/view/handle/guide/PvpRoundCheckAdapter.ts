import { ECommonClaimType, MainModel } from "../main/model/MainModel";
import { EGuideMode, IGuideAdapter } from "./PveGuideAdapter1";
/**
 * PVP回合制引导适配
 */
export class PvpRoundCheckAdapter implements IGuideAdapter{
    readonly mode:EGuideMode = EGuideMode.PvpRound;
    
    init() {
        // throw new Error("Method not implemented.");
    }
    push(id: number) {
        // throw new Error("Method not implemented.");
    }
    onInitRevc(){
        this.model.pveChapterId = 4;
    }
    get isRunning(): boolean{
        if(Laya.Utils.getQueryString('pveChapterId')||initConfig.pveChapterId){
            return true;
        }

        let commonTimes = this.model.commonTimes;
        if(commonTimes){
            let guide = commonTimes.find(o => o.flag == ECommonClaimType.PVP_ROUND_GUIDE);
            if(guide){
                //1需要执行新手引导 0不需要执行新手引导
                return guide.times == 1;
            }else{
                return true;
            }
        }

        return false;
    }
    get model(){
        return MainModel.Ins;
    }
}