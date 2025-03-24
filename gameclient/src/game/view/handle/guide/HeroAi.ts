import { MonsterAttack_revc, MonsterBlood_revc, MonsterRemove_revc, stFightSkillEffect, stSubBlood } from "../../../network/protocols/BaseProto";
import { ComposeConfig } from "../compose/ComposeConfig";
import { ComposeModel } from "../compose/ComposeModel";
import { FightUtils } from "../compose/FightUtils";
// import { t_Monster } from "../compose/t_Monster_Template";
import { ComposeDragGrid } from "../compose/views/ComposeDragGrid";
import { TowerAvatarView } from "../compose/views/TowerAvatarView";
import { ClientMonsterBirthVo } from "../compose/vos/EFightEnum";
import { EFightSkillActionType } from "../compose/vos/FightSkillEffectVo";
import { SkillListProxy } from "../skill/proxy/SkillProxy";
import { TowertMainHeroModel } from "../towertmainhero/model/TowertMainHeroModel";
import { HeroListLvProxy, HeroListProxy } from "../towertmainhero/proxy/HeroProxy";
// import { FightGuide } from "./FightGuide";
import { FightGuideUtils } from "./FightGuideUtils";
import { EGuideEvent, GuideModel } from "./GuideModel";
import { SkillColdVo } from "./SkillColdVo";
// import { EFightGuide, t_FightGuideConfig } from "./t_FightGuideConfig";

class HeroVoHurtVo {
    /**伤害值 */
    hurt: number = 0;
    skillCfg: Configs.t_Skill_dat;
}
/**全体加成伤害 */
export class HeroHurtPer{
    playerId:number;
    hurtPer:number;
    constructor(){
        this.hurtPer = 0;
    }
    dispose(){

    }
    /**伤害百分比转化 */
    convertHurt(val:number){
        let old = val;
        val = val * (10000 + this.hurtPer)/10000;
        
        if(old < val){
            // LogSys.Log(`伤害百分比使用伤害:${old}/${val}`);
        }
        return val;
    }
}
/**
1：普攻技能
2：概率触发技能
3：CD技能
4；技能条技能
5：主动技能
6：被动技能
7：英雄特性
 */
export enum ESkillType{
    /**普通技能*/
    Normal = 1,
    /**概率触发技能*/
    Random = 2,
    /**主动技能类型 */
    Initiative = 5,
}
class HurtCountVo{
    uid:number;
    /**当前的使用次数 */
    private curCount:number = 0;
    // curType:ESkillType;
    private checkCount:number;
    private type:ESkillType;
    /**
     * 
     * @param str         // 8-3-2：uid为8的英雄第3次使用类型是2的技能
     */
    parse(str:string){
        let arr = str.split("-");
        this.uid = parseInt(arr[0]);
        this.checkCount = parseInt(arr[1]);
        this.type = parseInt(arr[2]);
    }
    /**获取当前使用的技能类型 */
    getSkinType(_monsterUID:number){
        this.curCount++;
        let _curType:ESkillType;
        if(this.curCount % this.checkCount == 0){ //每x次
        // this.curCount == this.checkCount == 0 //第x次
            _curType = this.type;
            LogSys.Log(`............英雄uid:${this.uid} 第${this.curCount}次使用技能类型为${_curType}的技能攻击怪物uid:${_monsterUID}`);
        }else{
            _curType = ESkillType.Normal;
        }
        return _curType;
    }
}
export class HeroAi {
    /**己方全体伤害加成 */
    selfhurtPer:HeroHurtPer;
    
    private readonly defaultDelayMs:number = 500;
    /**攻击间隔 */
    delayMs: number = 0;

    private _tempTimeMs: number = 0;
    private _hurtList:HurtCountVo[] = [];
    private _skillColdList:SkillColdVo[] = [];
    private get model() {
        return ComposeModel.Ins;
    }
    // private get selfId() {
    //     return FightGuide.Ins.selfId;
    // }

    /**
     * 获取该流水号的英雄使用什么类型的英雄
     */
    private getSkillType(heroUID:number,_monsterUID:number):ESkillType{
        let findHurt = this._hurtList.find(o=>o.uid == heroUID);
        let curSkillType:ESkillType = ESkillType.Normal;
        if(findHurt){
            curSkillType = findHurt.getSkinType(_monsterUID);
        }
        return curSkillType;
    }

    init(str:string){
        this.delayMs = this.defaultDelayMs;
        this._hurtList = [];
        let arr = str.split("|");
        for(let i = 0;i < arr.length;i++){
            let vo:HurtCountVo = new HurtCountVo();
            vo.parse(arr[i]);
            this._hurtList.push(vo);
        }
        //=====================================================================
        this._skillColdList = [];
        this.selfhurtPer = new HeroHurtPer();
        GuideModel.Ins.on(EGuideEvent.ChangeAiSpeed,this,this.onChangeSpeed);
        GuideModel.Ins.on(EGuideEvent.HeroHurtPer, this, this.onHeroHurtPer);
    }

    private onHeroHurtPer(vo:HeroHurtPer){
        if(vo.playerId == this.model.ownerPlayer.playerId){
            
            this.selfhurtPer.hurtPer += vo.hurtPer;
            // this.selfhurtPer = vo;
        }
    }

    exit(){
        GuideModel.Ins.off(EGuideEvent.HeroHurtPer, this, this.onHeroHurtPer);
        GuideModel.Ins.off(EGuideEvent.ChangeAiSpeed,this,this.onChangeSpeed);
        if(this.selfhurtPer){
            this.selfhurtPer.dispose();
            this.selfhurtPer = null;
        }
    }

    private onChangeSpeed(ms:number){
        this.delayMs = ms;
    }

    /**随机一个非buff类型的技能 */
    // private getRandomSkill(heroCfg: Configs.t_Hero_dat) {
    //     let skillArr: string[] = heroCfg.f_skillid.split("|");
    //     let _skillList: number[] = [];
    //     for (let i = 0; i < skillArr.length; i++) {
    //         // let skillId:number = parseInt(skillArr[i]);
    //         let a = skillArr[i];
    //         let arr = a.split("-");
    //         let skillId = parseInt(arr[1]);
    //         let cfg = SkillListProxy.Ins.getCfgById(skillId);
    //         if (StringUtil.IsNullOrEmpty(cfg.f_enemy_buff)) {
    //             _skillList.push(skillId);
    //         }
    //     }
    //     if (_skillList.length > 0) {
    //         let skillIndex = Math.floor(Math.random() * _skillList.length);
    //         let skillId = _skillList[skillIndex];
    //         return skillId;
    //     }
    //     return 0;
    // }


    private getSkillByType(heroId:number,f_heroskill:string,type:ESkillType){
        let arr: string[] = f_heroskill.split("|");
        let _skillCfg: Configs.t_Skill_dat;
        for (let i = 0; i < arr.length; i++) {
            let skillId = parseInt(arr[i]);
            let skillCfg = SkillListProxy.Ins.getCfgById(skillId);
            if (skillCfg.f_type == type) {
                _skillCfg = skillCfg;
                break;
            }
        }
        if (!_skillCfg) {
            LogSys.Error(`heroId:${heroId}没有类型${type}的技能!`)
            _skillCfg =  SkillListProxy.Ins.getCfgById(parseInt(arr[0]));
        }
        return _skillCfg;
    }

    private getHurtVo(cfg: Configs.t_Hero_dat,lv:number,type:ESkillType): HeroVoHurtVo {
        let heroId: number = cfg.f_heroid;
        let o = new HeroVoHurtVo();

        let _updateCfg: Configs.t_Hero_upgrade_dat = HeroListLvProxy.Ins.getCfgByIdAndLv(heroId, lv);

        // let type = ESkillType.Normal;
        let _skillCfg = this.getSkillByType(cfg.f_heroid,_updateCfg.f_heroskill,type);
        o.skillCfg = _skillCfg;
        o.hurt = Math.ceil(parseInt(_updateCfg.f_10002.split(":")[1]) * _skillCfg.f_damage_multipler / 10000);
        return o;
    }

    /**是否可以执行技能 */
    private canRunSkill(skillCfg: Configs.t_Skill_dat,uid:number){
        let _obj = this._skillColdList.find(o=>o.uid == uid);
        if(!_obj){
            let cell = new SkillColdVo();
            cell.uid = uid;
            cell.refreshSkillId(skillCfg.f_skillid);
            this._skillColdList.push(cell);
            return true;
        }
        return _obj.check(skillCfg);
    }

    checkAi(selfId:number,brithInfoList:ClientMonsterBirthVo[]) {
        if(Laya.Utils.getQueryString("disableAi")){
            return;
        }
        this._tempTimeMs += Laya.timer.delta;
        if (this._tempTimeMs > this.delayMs) {
            this._tempTimeMs = 0;
            let gridItemList = this.model.fightView.gridItemList;
            let _monsterList = this.model.fightView.monsterList;
            let selfMonster = [];
            let enemyMonster = [];

            for (let i = 0; i < _monsterList.length; i++) {
                let _monster = _monsterList[i];
                if (_monster.vo.playerId == selfId) {
                    selfMonster.push(_monster);
                } else {
                    enemyMonster.push(_monster);
                }
            }
            //#region 攻击效果
            let _atkList: stFightSkillEffect[] = [];
            let _subBloodList: stSubBlood[] = [];
            let _removeMonsterUID: number[] = [];
            for (let i = 0; i < gridItemList.length; i++) {
                let hero: ComposeDragGrid = gridItemList[i];
                // if(hero.data.uid == 5){
                // LogSys
                if (hero.parent) {
                    let heroPos = (hero.parent as Laya.Sprite).localToGlobal(new Laya.Point(hero.x + ComposeConfig.cellW / 2, hero.y + ComposeConfig.cellH / 2));

                    let radiu: number = FightUtils.calculateFightRadiu(hero.data.fid);
                    let heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(hero.data.fid)
                    let herolv:number = 1;
                    let heroVo = TowertMainHeroModel.Ins.getHeroById(hero.data.fid);
                    if(heroVo){
                        herolv = heroVo.level;
                    }
                    let _checkMonsterList: TowerAvatarView[];
                    if (hero.data.playerId == selfId) {
                        _checkMonsterList = selfMonster;
                    } else {
                        _checkMonsterList = enemyMonster;
                    }
                    for (let n = 0; n < _checkMonsterList.length; n++) {
                        let _monster: TowerAvatarView = _checkMonsterList[n];
                        // if(_monster.isDestory){
                        // LogSys.Warn(`monster uid:${_monster.vo.uid} is Destoryed`);
                        // continue;
                        // }
                        // if(_monster.vo.uid == 5){
                        if (_monster.coreSpine && _monster.coreSpine.skeleton && _monster.coreSpine.skeleton.parent) {

                            let monsterSpr = _monster.coreSpine.skeleton;
                            
                            // if (!(monsterSpr.parent as Laya.Sprite)) {
                            //     LogSys.Error(`monsterSpr.parent is null`);
                            //     continue;
                            // }
                            let pos = (monsterSpr.parent as Laya.Sprite).localToGlobal(new Laya.Point(monsterSpr.x, monsterSpr.y));
                            let distance = pos.distance(heroPos.x, heroPos.y);

                            // LogSys.Log(`英雄${hero.data.uid} 距离怪物${_monster.vo.uid}:----->${distance} 英雄可攻击半径${radiu}`);

                            if (distance <= radiu) {
                                // LogSys.Log(`{}可以攻击`);

                                let _monsterUID = _monster.vo.uid;
                                //==========================================================================
                                let curSkillType = this.getSkillType(hero.data.uid,_monsterUID);
                                let hurtVo = this.getHurtVo(heroCfg,herolv,curSkillType);
                                
                                if(!this.canRunSkill(hurtVo.skillCfg,hero.data.uid)){
                                    return;
                                }

                                let hurt: number = hurtVo.hurt;
                                if(hero.data.playerId == selfId){
                                    hurt = this.selfhurtPer.convertHurt(hurt);
                                }
                                //组装攻击效果
                                let _effect = new stFightSkillEffect();
                                _effect.attackerUid = hero.data.uid;
                                _effect.targetUids = [_monsterUID];//攻击的怪物uid
                                _effect.index = 0;
                                let atkTime:number = 0;//攻击的速度
                                _effect.params = [hurtVo.skillCfg.f_skillid,atkTime];//技能参数

                                _effect.type = EFightSkillActionType.Skill;
                                _atkList.push(_effect);
                                //=====================================
                                //组装掉血效果
                                let _subBlood = new stSubBlood();
                                _subBlood.targetUid = _monsterUID;
                                _subBlood.type = hurtVo.skillCfg.f_hurt_type;//f_hurt_type
                                _subBlood.value = hurt;
                                _subBloodList.push(_subBlood);
                                let curinfo = brithInfoList.find(o => o.uid == _monsterUID);
                                if(Laya.Utils.getQueryString("largeHurt")){
                                    hurt = 10000000;
                                }
                                if (curinfo) {
                                    curinfo.curBlood -= hurt;
                                }
                                //杀死怪物
                                if (curinfo && curinfo.curBlood <= 0) {

                                    if(Laya.Utils.getQueryString("nokill")){
                                        return;
                                    }

                                    _removeMonsterUID.push(_monsterUID);
                                    //  _monster.vo.fid

                                    //击杀奖励
                                    if (selfId == _monster.vo.playerId) {
                                        let monsterCfg = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(_monster.vo.fid);
                                        FightGuideUtils.updateMoney(monsterCfg.f_kill_reward, true);
                                    }
                                }
                                break;


                            }
                        }
                    }
                }
            }
            //#endregion

            //攻击效果更新
            if (_atkList.length > 0) {
                let atk_revc = new MonsterAttack_revc();
                atk_revc.datalist = _atkList;
                this.model.onMonsterAttack(atk_revc);
            }

            //血量更新
            if (_subBloodList.length > 0) {
                let _monsterBloodRevc: MonsterBlood_revc = new MonsterBlood_revc();
                _monsterBloodRevc.datalist = _subBloodList;
                this.model.onMonsterBlood(_monsterBloodRevc);
            }
            //移除怪物
            if (_removeMonsterUID.length > 0) {
                for (let i = 0; i < _removeMonsterUID.length; i++) {
                    let uid = _removeMonsterUID[i];
                    let remove = new MonsterRemove_revc();
                    remove.targetUid = uid;
                    this.model.onMonsterRemove(remove);
                }
            }
        }
    }

}