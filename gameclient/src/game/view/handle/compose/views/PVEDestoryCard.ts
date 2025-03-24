import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { BaseAdmissionShow } from "./BaseAdmissionShow";
/**PVE卡牌特效销魂 */
export class PVEDestoryCard extends BaseAdmissionShow {
    cardId: number;
    constructor() {
        super();
    }
    protected onCompleteHander() {
        super.onCompleteHander();
        let cfg = t_Function_Card.Ins.getCfgById(this.cardId);
        // let img: string = t_Function_Card.Ins.getIconById(this.cardId);
        // //是卡本体
        // this.skel.setSlotImg("Card_back", img);//Card_back Card_front

        // //Card_back_1是卡框
        // this.skel.setSlotImg("Card_back_1", t_Function_Card.Ins.getQuaSkin(cfg.f_qua));
    }

}