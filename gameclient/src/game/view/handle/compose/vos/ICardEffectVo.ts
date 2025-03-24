import { stFuncCardEffect } from "../../../../network/protocols/BaseProto";

export interface ICardEffectVo{
    reset();
    update(_data: stFuncCardEffect);
}