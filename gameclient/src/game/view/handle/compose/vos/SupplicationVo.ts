import { stFuncCardEffect } from "../../../../network/protocols/BaseProto";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { IDelEffectCardUid } from "./EFightEnum";
import { ICardEffectVo } from "./ICardEffectVo";
import { t_Battle_Effect } from "./t_Battle_Effect";
/**祈愿按钮特效数据 */
export class SupplicationVo implements ICardEffectVo{
    private cardList: stFuncCardEffect[] = [];
    private _res: string = "";
    constructor() {
        this.model.on(ComposeEvent.DelEffectCardUid, this, this.onDelHandler);
    }

    private onDelHandler(targetObj: IDelEffectCardUid) {
        let _index = this.cardList.findIndex(o => o.serialNum == targetObj.cardSerialNum);
        if (_index != -1) {
            this.cardList.splice(_index, 1);
            this.model.event(ComposeEvent.SupplicationBtnUpdate);
        }
    }
    reset() {
        this.cardList = [];
    }

    private get model() {
        return ComposeModel.Ins;
    }
    update(_data: stFuncCardEffect) {
        let _index = this.cardList.findIndex(o => o.serialNum == _data.serialNum);
        if (_index != -1) {
            this.cardList[_index] = _data;
        } else {
            this.cardList.push(_data);
        }
        this.model.event(ComposeEvent.SupplicationBtnUpdate);
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
            this._res = cfg.f_effect_name;
            switch (len) {
                case 1:
                    _animIndex = cfg.f_effect_anim;
                    break;
                case 2:
                    _animIndex = 2;
                    break;
            }
        }

        return _animIndex;
    }

    get aniRes() {
        let k = this._res;
        return `o/spine/scene/${k}/${k}`;
    }
}