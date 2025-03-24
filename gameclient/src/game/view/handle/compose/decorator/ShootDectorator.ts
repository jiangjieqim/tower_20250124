import { EAvatarDir } from "../../avatar/AvatarView";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { ISkillClientEffectCfg } from "../../skill/proxy/SkillProxy";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { IBulletView } from "../views/BulletView";
import { ComposeDragGrid } from "../views/ComposeDragGrid";
import { TowerAvatarView } from "../views/TowerAvatarView";
import { EFightLayer } from "../vos/EFightEnum";
import { FightSkillEffectVo } from "../vos/FightSkillEffectVo";
import { FightValueConfig } from "../vos/FightValueConfig";
import { AtkBaseDectorator } from "./AtkBaseDectorator";

/**弹道装饰器 */
export class ShootDectorator extends AtkBaseDectorator{
    parse(vo: FightSkillEffectVo, _attacker: ComposeDragGrid, _monster: TowerAvatarView) {
        // throw new Error("Method not implemented.");
        this._source.parse(vo,_attacker,_monster);

        let avatar = _attacker.animal.getHeroAvatar(vo.index);

        if(avatar){
            if(!this.shootCon){
                return;
            }
            let _skillCfg:ISkillClientEffectCfg = vo.convertSkillCfg(_attacker.data.skinId);
            let offset:Laya.Point = _attacker.animal.randomPos;

            let anim:EAvatarAnim = EAvatarAnim.TowerAtk;
            if(_skillCfg.f_skill_act){
                anim = _skillCfg.f_skill_act;
            }
            avatar.playAtk(anim);//播放攻击动画
            //=========================== 计算动画速率
            if(vo.atktime > 0){
                let atkTime: number = HeroListProxy.Ins.getAtkTime(avatar.heroVo.fid);
                let v:number = vo.atktime / atkTime;
                // let max: number = FightValueConfig.MaxFastRate;
                // if (v >= max) {
                // v = max;
                // }
                avatar.playSpeed = v;
                avatar.updatePlaybackRate();
                // avatar.playbackRate(vo.atktime / atkTime);
            }
            //============================
            let heroCon:Laya.Sprite = _attacker;//.animal.heroCon;
            if(_monster && heroCon){
                let half = ComposeConfig.cellW / 2;
                if(_attacker.parent){
                    //开始移动的坐标
                    let start: Laya.Point = (_attacker.parent as Laya.Sprite).localToGlobal(new Laya.Point(heroCon.x + offset.x + half, heroCon.y + offset.y + half));
                    //结束移动点
                    let end:Laya.Point = (_monster.parent as Laya.Sprite).localToGlobal(new Laya.Point(_monster.coreSpine.skeleton.x,_monster.coreSpine.skeleton.y));
                    
                    if(end.x < start.x){
                        avatar.dir = EAvatarDir.Left;
                    }else{
                        avatar.dir = EAvatarDir.Right;
                    }
    
                    let bullet:IBulletView = FightFactory.createBullet(_skillCfg);
                    if(bullet){
                        //子弹
                        let shootConPos:Laya.Point = (this.shootCon.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.shootCon.x,this.shootCon.y));
                        // let shoot: IBulletView = new BulletView();
                        let _speed:number = FightValueConfig.speedScale;
                        //=============================================
                        let flyTime:number = 0;
                        if(_skillCfg.f_bullet_speed){
                            flyTime = _skillCfg.f_bullet_speed;
                        }else{
                            flyTime = FightValueConfig.FLY_TIME;
                        }
                        bullet.flyTime = flyTime / _speed;//基础飞行时间
                        //=============================================

                        let sx = start.x - shootConPos.x;
                        let sy = start.y - shootConPos.y - ComposeConfig.cellH/2;
                        let ex = end.x- shootConPos.x;
                        let ey = end.y - shootConPos.y;

                        //=====================================================
                        bullet.pass = _skillCfg.f_bullet_spine_pass == 1;
                        //=====================================================

                        bullet.moveAvatar(sx,sy,ex,ey);
                        this.shootCon.addChild(bullet);
                    }
                }
            }
        }else{
            LogSys.Error(`not find destUID:${_attacker.uid}`);
        }
    }
    private get shootCon(){
        let fight = ComposeModel.Ins.fightView;
        if(fight){
            return fight.getLayer(EFightLayer.ShootLayer);
        }
    }
}