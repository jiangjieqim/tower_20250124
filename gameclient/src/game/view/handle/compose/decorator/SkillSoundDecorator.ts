import { E } from "../../../../G";
import { MainModel } from "../../main/model/MainModel";
import { ComposeDragGrid } from "../views/ComposeDragGrid";
import { TowerAvatarView } from "../views/TowerAvatarView";
import { FightSkillEffectVo } from "../vos/FightSkillEffectVo";
import { AtkBaseDectorator } from "./AtkBaseDectorator";

/**技能音效装饰器 */
export class SkillSoundDecorator extends AtkBaseDectorator {

    parse(vo: FightSkillEffectVo, _attacker: ComposeDragGrid, _monster: TowerAvatarView) {
        this._source.parse(vo,_attacker,_monster);
        let _skillCfg: Configs.t_Skill_dat = vo.skillCfg;
        // E.AudioMgr.PlaySound1(`hit${(_skillCfg.f_sound_id || 0)}.mp3`);
        if(_skillCfg.f_sound_id > 0){
            if(_attacker &&  _attacker.data && _attacker.data.playerId == MainModel.Ins.mRoleData.AccountId){
                E.AudioMgr.PlaySound1(`${_skillCfg.f_sound_id}.mp3`);
            }
        }
    }
}