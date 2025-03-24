import { ui } from "../../../../../ui/layaMaxUI";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";

/**肉鸽Item选项 */
export class RoguelikeComponent extends ui.views.card.ui_roguelike_componentUI{
    private _cardCfg:Configs.t_Function_Card_dat;

    /**当前的品质 */
    get qua(){
        return this._cardCfg.f_qua;
    }

    set cfg(_cfg:Configs.t_Function_Coop_dat){
        let cardCfg = t_Function_Card.Ins.getCfgById(_cfg.f_icon);
        this._cardCfg = cardCfg;
        this.icon.clear();
        this.icon.skin = t_Function_Card.Ins.getIconById(cardCfg.f_card_imageid);
        this.quaImg.skin = `remote/pvpround/q${cardCfg.f_qua}.png`;
    }
}