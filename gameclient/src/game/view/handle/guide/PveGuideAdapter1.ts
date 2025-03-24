import { FightValueConfig } from "../compose/vos/FightValueConfig";
import { ECommonClaimType, MainModel } from "../main/model/MainModel";


export enum EGuideMode {
    PveGuide = 1,
    PvpRound = 2
}

export interface IGuideAdapter {
    mode: number
    init();
    push(id: number);
    /**是否激活该引导 */
    isRunning: boolean;
    onInitRevc();
}
enum EGuideExitType {
    /**PVE引导 */
    PVE = 1,
}
/**
 * PVE引导
 */
export class PveGuideAdapter1 implements IGuideAdapter {
    readonly mode: EGuideMode = EGuideMode.PveGuide;
    private get commonTimes() {
        return MainModel.Ins.commonTimes;
    }
    /**已经完成了的引导类型 */
    private guideFinishList: EGuideExitType[] = [];

    /**是否是PVE引导 */
    get isRunning() {
        if (Laya.Utils.getQueryString('pveChapterId') || initConfig.pveChapterId) {
            return true;
        }

        if (this.guideFinishList.indexOf(EGuideExitType.PVE) != -1) {
            return false;
        }

        if (this.commonTimes) {
            if (MainModel.Ins.pveChapterId > FightValueConfig.MAX_CHAPTER) {
                return false;
            }

            let guide = this.commonTimes.find(o => o.flag == ECommonClaimType.USE_PVE_GUIDE);
            if (guide) {
                if (guide.times == 0) {
                    return false;
                }
                return true;
            }

        }
    }

    init() {
        this.guideFinishList = [];
    }

    push(id: number) {
        if (this.guideFinishList.indexOf(id) == -1) {
            this.guideFinishList.push(id);
        }
    }
    onInitRevc() {
        let _pveChapter = this.commonTimes.find(o => o.flag == ECommonClaimType.PVE_GUIDE_STATUS);
        if (_pveChapter) {
            MainModel.Ins.pveChapterId = _pveChapter.times + 1;
        }
    }
}