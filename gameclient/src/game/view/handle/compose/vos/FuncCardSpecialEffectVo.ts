import { E } from "../../../../G";
import { CardMsgVo } from "./CardMsgVo";

export class FuncCardSpecialEffectVo extends CardMsgVo{
    constructor(){
        super();
    }
    get desc(){
        let _str = E.getLang("cardinvalid");
        // let playerName1:string = "";
        // let playerName2:string = "";
        // if(this.playerId == this.model.ownerPlayer.playerId){
        //     playerName1 = this.model.ownerPlayer.nickName;
        //     playerName2 = this.model.enemyPlayer.nickName;
        //     this.headUrl = this.model.ownerPlayer.headUrl;
        // }else{
        //     playerName1 = this.model.enemyPlayer.nickName;
        //     playerName2 = this.model.ownerPlayer.nickName;
        //     this.headUrl = this.model.enemyPlayer.headUrl;
        // }
        this.updateData();
        _str = _str.replace('{-1}',this.playerName1);
        _str = _str.replace('{-2}',this.playerName2);
        _str = _str.replace(`{1}`,this.cfg.f_card_name);
        return _str;
    }
}