import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { ItemVo } from "../../main/vos/ItemVo";
import { ComposeModel } from "../ComposeModel";
import { t_Battle_Config } from "../t_Battle_Config";
export enum EGambleType {
    Blue = 1,
    Purple = 2,
    Red = 3
}
/**赌博数据结构 */
export class GambleCfgVo {
    get priceStr(){
        return `${this.priceVo.cfgId}-${this.priceVo.count}`;
    }
    // private model:ComposeModel;
    private get model(){
        return ComposeModel.Ins;
    }
    /**消耗 */
    priceVo: ItemVo;
    /**类型 */
    type: EGambleType;
    /**百分比 */
    percent: number;
    constructor(priceCfgId: number, type: EGambleType) {
        this.type = type;
        let percentCfgId: number = priceCfgId + 3;
        this.priceVo = ItemViewFactory.convertItem(t_Battle_Config.Ins.getValueById(priceCfgId));
        this.percent = parseInt(t_Battle_Config.Ins.getValueById(percentCfgId));
    }

    refresh(){

    }

    /**材料是否满足 */
    get bCostEnough(){
        let needId:number = this.priceVo.cfgId;
        let needCount:number = this.priceVo.count;
        let have = MainModel.Ins.mRoleData.getVal(needId);
        if(have >= needCount){
            return true;
        }
    }

    /**有附属值 */
    get bHasChange() {
        return this.real != this.percent;
    }
    get real(){
        let cell = this.model.gambles.find(o=>o.flag == this.type);
        if(cell){
            return cell.prob;
        }
        return this.percent;
    }
}

export interface IGambleResult {
    succeed: boolean;
    type: EGambleType;
    heroId:number;
}