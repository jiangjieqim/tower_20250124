import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { BaseAdmissionShow } from "./BaseAdmissionShow";
/**PVE卡牌特效 */
export class PVECardShow extends BaseAdmissionShow {
    cardId: number;
    showHandler:Laya.Handler;
    constructor() {
        super();
    }
    protected onCompleteHander() {
        super.onCompleteHander();

        this.skel.skeleton.once(Laya.Event.LABEL,this,this.onShowLable);

        let cfg = t_Function_Card.Ins.getCfgById(this.cardId);
        let img: string = t_Function_Card.Ins.getIconById(cfg.f_card_imageid);
        //是卡本体
        this.skel.setSlotImg("Card_back", img);//Card_back Card_front

        //Card_back_1是卡框
        this.skel.setSlotImg("Card_back_1", t_Function_Card.Ins.getQuaSkin(cfg.f_qua));
    }
    /**显示文本 */
    private onShowLable(e){
        if(e.name == "SHOW"){
            // this.updateDesc();
            if(this.showHandler){
                this.showHandler.run();
            }
        }
    }
}