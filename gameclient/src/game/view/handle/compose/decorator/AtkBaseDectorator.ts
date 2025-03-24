import { ComposeDragGrid } from "../views/ComposeDragGrid";
import { TowerAvatarView } from "../views/TowerAvatarView";
import { FightSkillEffectVo } from "../vos/FightSkillEffectVo";
/**战斗受击 怪物受击 buff特效表现抽象接口 */
export abstract class AtkBaseDectorator {
    protected _source: AtkBaseDectorator;
    constructor(source?: AtkBaseDectorator) {
        this._source = source;
    }
    abstract parse(vo: FightSkillEffectVo, _attacker: ComposeDragGrid, _monster: TowerAvatarView);
}