// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { MainModel } from "../../../main/model/MainModel";
import { CardMsgVo } from "../../vos/CardMsgVo";

export interface ICardCellSkin extends Laya.Sprite{
    clickImg: Laya.Image;
    bg: Laya.Image;
    headicon: Laya.Image;
    tf: Laya.Label;
}

export class CardCellMsgCtl {
    private _skin: ICardCellSkin;
    constructor(_skin: ICardCellSkin) {
        this._skin = _skin;
        DebugUtil.draw(_skin);
    }

    refresh(vo:CardMsgVo){
        DebugUtil.drawTF(this._skin,vo.cardId+"","#ffffff");
        this._skin.tf.text = vo.desc;
        let url:string = MainModel.Ins.convertHead(vo.headUrl);
        MainModel.Ins.setTTHead(this._skin.headicon,url);
        if(vo.isSelf){
            this._skin.bg.skin = `remote/fight/img_wf.png`;
        }else{
            this._skin.bg.skin = `remote/fight/img_df.png`;
        }
    }

    dispose(){
        this._skin = null;
    }
}