import { vectorAngle } from "../../avatar/ShootAvatar";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { MainModel } from "../../main/model/MainModel";
import { ISkillClientEffectCfg } from "../../skill/proxy/SkillProxy";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { EIsoRegion } from "../UnlockVo";
import { ComposeDragGrid } from "../views/ComposeDragGrid";
import { TowerAvatarView } from "../views/TowerAvatarView";
import { EHitAnimatiionType } from "../vos/EHitAnimatiionType";
import { FightSkillEffectVo } from "../vos/FightSkillEffectVo";
import { AtkBaseDectorator } from "./AtkBaseDectorator";
import { EAttackPosType, EEffectPos } from "./EAttackPosType";

/**怪物特效装饰器 */
export class MonsterEffectDecorator extends AtkBaseDectorator {
    constructor() {
        super();
    }
    private get model(){
        return ComposeModel.Ins;
    }
    parse(vo: FightSkillEffectVo, _attacker: ComposeDragGrid, _monster: TowerAvatarView) {
        if (_monster) {
            FightFactory.createNormalHit(_monster);//怪物受击特效
            // LogSys.Log("MonsterEffectDecorator");

            let f_attack_number = vo.skillCfg.f_attack_number;

            let _skillCfg: ISkillClientEffectCfg = vo.convertSkillCfg(_attacker.data.skinId);

            let offsetX: number = 0;
            let offsetY: number = 0;
            if (!StringUtil.IsNullOrEmpty(_skillCfg.f_hit_animation_offset)) {
                let offsetArr = _skillCfg.f_hit_animation_offset.split("|");
                offsetX = parseInt(offsetArr[0]);
                offsetY = parseInt(offsetArr[1]);
            }
            let f_hit_animation = _skillCfg.f_hit_animation;
            if (f_hit_animation) {
                let _monsterSkel: Laya.Sprite = _monster.coreSpine.skeleton;
                let rot: number = 0;
                let sx: number = _monsterSkel.x;
                let sy: number = _monsterSkel.y;
                // let dir:number = 1;
                if (_skillCfg.f_hit_animation_type == EHitAnimatiionType.Road) {
                    //特效需要对称
                    if (_monster.region == EIsoRegion.Left || _monster.region == EIsoRegion.Right) {
                        rot = 90;
                    }
                    // dir = -avatar.dir;
                }
                else if (_skillCfg.f_hit_animation_type == EHitAnimatiionType.Directing) {
                    //指向性打击,特效由发起者触发
                    //二郎神的第三眼位置需要设置offsetY的偏移
                    sx = _attacker.x + 1.5 * ComposeConfig.cellW + offsetX;
                    sy = _attacker.y + 1.5 * ComposeConfig.cellH + offsetY;

                    rot = vectorAngle(_monsterSkel.x - sx, _monsterSkel.y - sy, 1, 0);
                }

                //==============================================================
                switch(f_attack_number){
                    case EAttackPosType.Gird:
                        this.playGridEffect(_monster,_skillCfg);
                        break;
                    default:
                        FightFactory.createHitSkill(_skillCfg.f_hit_animation,_skillCfg.f_hit_animation_scale,sx,sy,rot);
                        break;
                }

            }
        }
    }

    private playGridEffect(_monster:TowerAvatarView,_skillCfg:ISkillClientEffectCfg){
        let o = this.model.getTargetLayerXY(EEffectPos.GridCenter,_monster.vo.playerId);
        if(o){
            let id = _skillCfg.f_hit_animation;
            let url:string = `o/spine/skill/${id}/${id}`;
            SpineEffectMgr.playOnce(url, o.layer,o.curX, o.curY, 0);
        }
    }
}