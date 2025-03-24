import { ui } from "../../../../../../ui/layaMaxUI";
import { PieAniPieCtl } from "../../../compose/views/cells/PieAniPieCtl";
import { t_Function_Card } from "../../proxy/t_Function_Card";

/**卡牌组件 */
export class CardComponent extends ui.views.card.ui_card_componentUI{
    set cfg(cfg: Configs.t_Function_Card_dat){
        DebugUtil.drawTF(this.parent as Laya.Sprite,`${cfg.f_cardid} ${cfg.f_rank}`);
        this.icon.clear();
        this.icon.skin = t_Function_Card.Ins.getIconById(cfg.f_card_imageid);
        this.qua.clear();
        this.qua.skin = t_Function_Card.Ins.getQuaSkin(cfg.f_qua);
    }
}
/**局内战斗卡牌 */
export class FightCardCell extends ui.views.compose.fightcell.ui_fight_card_cellUI{
    pieCtl:PieAniPieCtl;
    btnCtl: ButtonCtl;
    constructor(){
        super();
        this.pieCtl = new PieAniPieCtl();
        this.pieCtl.callBack = new Laya.Handler(this,this.onStateUpdate);
        this.pieCtl.img=this.qua;
    }
    private onStateUpdate(v:boolean){
        this.btnCtl.mouseEnable = v;
    }
    set cfg(cfg: Configs.t_Function_Card_dat){
        this.qua.clear();
        this.qua.skin = t_Function_Card.Ins.getQuaSkin(cfg.f_qua);
        this.nameTf.text = cfg.f_card_name;
        this.icon.clear();
        this.icon.skin = t_Function_Card.Ins.getIconById(cfg.f_card_imageid);
        this.frameIcon.skin = `remote/fight/bottom_kp_0${cfg.f_qua}.png`;
    }
    playPie(cd:number){
        this.pieCtl.play(this.qua.width,this.qua.height,cd);
    }
}