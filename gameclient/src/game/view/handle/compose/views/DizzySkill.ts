import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { FightFactory } from "../FightFactory";
import { ESkillBuffType } from "../vos/ESkillBuffType";
import { IceSkill } from "./IceSkill";
import { ITowerMonster } from "./ITowerMonster";

/**晕眩特效 */
export class DizzySkill extends IceSkill {
    protected _frameAvatr: ITowerMonster;
    protected curType: ESkillBuffType = ESkillBuffType.Dizzy;
    protected onInit() {
        this._frameAvatr = FightFactory.createDefaultFrame(`res/atlas/hit/1`,this._scale);
        this._frameAvatr.play(EAvatarAnim.TowerIdle, undefined, undefined, undefined, undefined, undefined, true);
    }

    dispose() {
        if (this._frameAvatr) {
            // this.coreSpine.off(Laya.Event.COMPLETE,this,this.onCompleteHandler);
            this._frameAvatr.dispose();
            this._frameAvatr = null;
        }
        super.dispose();
    }

    protected setView() {
        let heroSkel: Laya.Sprite = this._target.coreSpine.skeleton;
        let curLayer = this.layer;
        if (!curLayer) {
            return;
        }
        if (this._frameAvatr && this._frameAvatr.skeleton) {
            let _dizzy = this._frameAvatr.skeleton;

            if (!_dizzy.parent) {
                curLayer.addChild(_dizzy);
            }
            let pos = (heroSkel.parent as Laya.Sprite).localToGlobal(new Laya.Point(heroSkel.x, heroSkel.y));
            let offset = (curLayer.parent as Laya.Sprite).localToGlobal(new Laya.Point(curLayer.x, curLayer.y));
            _dizzy.pos(pos.x - offset.x, pos.y - offset.y);
        }
    }
}