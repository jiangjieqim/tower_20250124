import { stElement } from "../../../../../network/protocols/BaseProto";
import { FightFactory } from "../../FightFactory";
import { FightMainEvent } from "../../vos/FightMainEvent";
import { BaseDecorator } from "./BaseDecorator";

/**孙悟空分身技能出生特效 */
export class SunWuKongDecorator extends BaseDecorator{

    onInit(){
        this.fight.on(FightMainEvent.SunWuKongDoubleBody,this,this.onSunWuKongDoubleBody);
    }

    private onSunWuKongDoubleBody(o:stElement){
        if (o.clone && o.fid == 23) {
            let id = 23;
            FightFactory.playEffectOnGrid(o.uid, `o/spine/skill/${id}/${id}`);
        }
    }

    onExit(){
        this.fight.off(FightMainEvent.SunWuKongDoubleBody,this,this.onSunWuKongDoubleBody);
    }
}