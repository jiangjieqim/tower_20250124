import { E } from "../../../../G";
import { MainModel } from "../../main/model/MainModel";
import { ComposeModel } from "../ComposeModel";
// import { t_Monster } from "../t_Monster_Template";
import { ComposeDragGrid } from "../views/ComposeDragGrid";
import { TowerAvatarView } from "../views/TowerAvatarView";
import { FightSkillEffectVo } from "../vos/FightSkillEffectVo";
import { AtkBaseDectorator } from "./AtkBaseDectorator";

/**怪物受击音效装饰器 */
export class MonsterHitSoundDecorator extends AtkBaseDectorator {
    private get model(){
        return ComposeModel.Ins;
    }
    parse(vo: FightSkillEffectVo, _attacker: ComposeDragGrid, _monster: TowerAvatarView) {
        this._source.parse(vo, _attacker, _monster);

        if (_monster && !_monster.isDestory) {

            if (_monster.vo.playerId == MainModel.Ins.mRoleData.AccountId) {
                let tempCfg = this.model.fightTypeAdaper.monsterCfg.getTempCfg(_monster.vo.fid);
                if (tempCfg.f_sound > 0) {
                    E.AudioMgr.PlaySound1(`${tempCfg.f_sound}.mp3`);
                }
            }
        }
    }
}