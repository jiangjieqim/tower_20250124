import { stFuncCardEffect } from "../../../../network/protocols/BaseProto";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { CardUiEffectVo, IDelEffectCardUid } from "./EFightEnum";
import { ICardEffectVo } from "./ICardEffectVo";
import { BaseBtnDecorator } from "./SupplicatiorDecorator";
import { t_Battle_Effect } from "./t_Battle_Effect";

/**卡牌增益减益效果 */
export class GainVo implements ICardEffectVo{

    /**卡牌翻倍列表 */
    private cardPriceDoubles:CardUiEffectVo[] = [];
    get priceDoubles(){
        let l = this.cardPriceDoubles;
        let n:number = 0;
        for(let i = 0;i < l.length;i++){
            let o:CardUiEffectVo = l[i];
            n+=o.priceDouble;
        }
        if(l.length > 0){
            return n;
        }
        return 1;
    }
    private cardList: stFuncCardEffect[] = [];
    private skelURL: string = "";

    protected get model() {
        return ComposeModel.Ins;
    }

    constructor(){
        this.model.on(ComposeEvent.DelEffectCardUid, this, this.onDelHandler);
    }
    private onDelHandler(targetObj: IDelEffectCardUid) {
        let _index = this.cardList.findIndex(o => o.serialNum == targetObj.cardSerialNum);
        if (_index != -1) {
            this.cardList.splice(_index, 1);
            this.model.event(ComposeEvent.GainBtnUpdate);
        }
        let u = this.cardPriceDoubles.findIndex(o=>o.cardSerialNum == targetObj.cardSerialNum);
        if(u != -1){
            this.cardPriceDoubles.splice(u,1);
        }
    }
    reset() {
        this.cardList = [];
        this.cardPriceDoubles = [];
    }
    update(_data: stFuncCardEffect) {
        // this._data = _data;
        let _index = this.cardList.findIndex(o => o.serialNum == _data.serialNum);
        if (_index != -1) {
            this.cardList[_index] = _data;
        } else {
            this.cardList.push(_data);
        }


        let u = this.cardPriceDoubles.findIndex(o=>o.cardSerialNum == _data.serialNum);
        if(u != -1){
            this.cardPriceDoubles.splice(u,1);
        }
        let vo = new CardUiEffectVo();
        vo.cardSerialNum = _data.serialNum;
        vo.status = _data.state;
        vo.cardId = _data.cardId
        this.cardPriceDoubles.push(vo);


        this.model.event(ComposeEvent.GainBtnUpdate);
        this.model.event(ComposeEvent.CardPriceDoubles);
    }

      /**
     * 当前的动作索引
     */
    get animIndex() {
        let effectIds: number[] = [];
        for (let i = 0; i < this.cardList.length; i++) {
            let cell = this.cardList[i];
            let cfg = t_Function_Card.Ins.getCfgById(cell.cardId);
            if (effectIds.indexOf(cfg.f_effect_id) == -1) {
                effectIds.push(cfg.f_effect_id);
            }
        }

        let len = effectIds.length;
        let _animIndex: number = -1;
        if (len > 0) {
            let cfg = t_Battle_Effect.Ins.getByEffectId(effectIds[len - 1]);
            let k = cfg.f_effect_name;
            this.skelURL = `${cfg.f_spine_path}/${k}/${k}`;
            return cfg.f_effect_anim;
        }

        return _animIndex;
    }

    get aniRes() {
        return this.skelURL;
    }
}

/**增益按钮装饰器 */
export class GainDecorator extends BaseBtnDecorator{
    constructor(btnSkin: Laya.Sprite) {
        super(btnSkin);
    }
    
    onInit() {
        this.model.on(ComposeEvent.GainBtnUpdate, this, this.onRefresh);
        this.onRefresh();
    }

    private onRefresh() {
        let gainVo = this.model.gainVo;
        let animIndex: number = gainVo.animIndex;
        this.startPlay(animIndex,gainVo.aniRes);
    }

    onExit() {
        this.model.off(ComposeEvent.GainBtnUpdate, this, this.onRefresh);
        this.disposeEffect();
    }
}
