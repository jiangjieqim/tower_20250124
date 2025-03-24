import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { EMonsterType } from "../t_Battle_Config";
// import { t_Monster } from "../t_Monster_Template";
import { ComposeDragGrid } from "../views/ComposeDragGrid";
import { TowerAvatarView } from "../views/TowerAvatarView";
import { ESkillBuffType } from "../vos/ESkillBuffType";
import { FightSkillEffectVo } from "../vos/FightSkillEffectVo";
import { AtkBaseDectorator } from "./AtkBaseDectorator";

/**怪物buff特效装饰器 */
export class AtkBuffDectorator extends AtkBaseDectorator {
    constructor(source: AtkBaseDectorator) {
        super(source);
    }
    get model(){
        return ComposeModel.Ins;
    }
    parse(vo: FightSkillEffectVo, _attacker: ComposeDragGrid, _monster: TowerAvatarView) {
        if (_monster) {
            this._source.parse(vo, _attacker, _monster);
            // LogSys.Log("AtkBuffDectorator");
            let _skillCfg: Configs.t_Skill_dat = vo.skillCfg;

            if (!StringUtil.IsNullOrEmpty(_skillCfg.f_enemy_buff)) {//1-800
                let _enemyBuffArr: string[] = _skillCfg.f_enemy_buff.split("-");
                let _skillBuffType: ESkillBuffType = parseInt(_enemyBuffArr[0]);
                let _skillMs: number = parseInt(_enemyBuffArr[1]);
                
                let cfg = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(_monster.vo.fid);//t_Monster.Ins.getCfgMonsterid(_monster.vo.fid);
                let iceScale: number = 1.5;
                if (cfg.f_monster_type == EMonsterType.Monster) {
                    iceScale = 1.0;
                }

                if (_skillBuffType == ESkillBuffType.Ice) {
                    //怪物被冰冻效果
                    if (_monster.skillBuffList.indexOf(_skillBuffType) == -1) {
                        _monster.skillBuffList.push(_skillBuffType);
                        FightFactory.createIceSkill(_monster, _skillMs, iceScale);
                    }
                    // _monster.stopMove();
                }
                else if (_skillBuffType == ESkillBuffType.Dizzy) {
                    //晕眩
                    if (_monster.skillBuffList.indexOf(_skillBuffType) == -1) {
                        _monster.skillBuffList.push(_skillBuffType);
                        FightFactory.createDizzySkill(_monster, _skillMs, iceScale);
                    }
                    // _monster.stopMove();
                }
            }
        }
    }
}
