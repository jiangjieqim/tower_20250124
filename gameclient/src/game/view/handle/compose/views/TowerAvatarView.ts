import { stMonsterBirth, stMonsterWalk } from "../../../../network/protocols/BaseProto";
import { EAvatarDir } from "../../avatar/AvatarView";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { ComposeEvent } from "../ComposeEvent";
import { FightFactory } from "../FightFactory";
import { FightUtils } from "../FightUtils";
import { EMonsterType } from "../t_Battle_Config";
// import { t_Monster } from "../t_Monster_Template";
import { EEffectTarget, IBaseAvatarCheckTarget, IPlayOnceAvatar, newStMonsterBirth } from "../vos/EFightEnum";
import { ESkillBuffType } from "../vos/ESkillBuffType";
import { EMonsterPos, TowerMoveVo } from "../vos/FightValueConfig";
import { TowerBaseAvatar } from "./avatar/TowerBaseAvatar";
import { BossBloodTxt } from "./BossBloodTxt";
import { BossCutdownView } from "./BossCutdownView";
import { AvatarEffect } from "./cells/AvatarEffect";
import { BloodImg } from "./cells/BloodImg";
import { IAvatarEffectData } from "./cells/GroundCellView";
import { FightMonsterDebug } from "./debug/FightMonsterDebug";
import { ITowerMonster } from "./ITowerMonster";
import { SubBloodFly } from "./SubBloodFly";
import { TowerAvatarCheck } from "./TowerAvatarCheck";

/**塔防中的怪物 */
export class TowerAvatarView extends TowerBaseAvatar{
    monsterType:EMonsterType;
    effects:AvatarEffect[] = [];
    
    bloodFlys: SubBloodFly[] = [];
    skillBuffList: ESkillBuffType[] = [];
    //==================================
    // private offsetTime:number = 0;
    /**怪物出生数据 */
    vo: stMonsterBirth;
    bloodView: BloodImg;//血条
    bloodTxt: BossBloodTxt;//当前血量美术字
    private bossCutdown: BossCutdownView;

    private _vis:boolean = false;
    /**当前的索引 */
    private oldIndex: number = -1;
    private _moveTween: Laya.Tween;
    private _avatarCheck:TowerAvatarCheck;
    tmpWalkVo: stMonsterWalk;
    constructor() {
        super();
        // this.model = ComposeModel.Ins;
        this.model.on(ComposeEvent.AddFrontEffect,this,this.onAvatarEffect);
        this.model.on(ComposeEvent.FightResClear,this,this.dispose);
        this.model.on(ComposeEvent.PlayOnceEffect,this,this.onPlayOnceEffect);
        this.model.on(ComposeEvent.MonsterPlayOnceAnim,this,this.onPlayOnceAnim);
    }
    //=====================================================================
    private monsterPlayAnimOnceBack(){
        this.coreSpine.play(EAvatarAnim.MonsterMove, undefined, undefined, undefined, undefined, undefined, true);
    }
    private onPlayOnceAnim(uid: number, anim: EAvatarAnim) {
        if (this.vo && this.vo.uid == uid) {
            if (this.coreSpine) {
                this.coreSpine.play(anim, this, this.monsterPlayAnimOnceBack);
            }
        }
    }
    //=====================================================================
    get hasIce(){
        if(this.effects){
            for(let i = 0;i < this.effects.length;i++){
                let effect = this.effects[i];
                if(effect.isIce){
                    return true;
                }
            }
        }
        return false;
    }
    /**只播放一次特效 */
    private onPlayOnceEffect(obj:IPlayOnceAvatar){
        if(this.checkTarget(obj)){
            // LogSys.Log(`播放once特效:${JSON.stringify(obj)}`);
            this.playOnceEffect(obj.url,obj.layer,obj.offsetY);
        }
    }

    protected checkTarget(obj:IBaseAvatarCheckTarget){
        if(obj.type == EEffectTarget.Monster && this.vo && obj.uid && obj.uid ==  this.vo.uid){
            return true;
        }
    }
    /**循环播放特效 */
    private onAvatarEffect(data:IAvatarEffectData){
        if(this.checkTarget(data)){
            this.createAvatarEffect(data);
        }
    }

    private createAvatarEffect(data:IAvatarEffectData){
        this.effects.push(FightFactory.createAvatarEffect(this,data));
    }

    stop() {
        this.coreSpine.stop();
    }
    init() {
        this.initEvt();
        this.coreSpine = this.create();
    }

    create():ITowerMonster{
        return FightFactory.createFrameByMonsterBirth(this.vo,this,this.onSpine1Complete);
    }

    protected initEvt() {
        this.model.on(ComposeEvent.MonsterMove, this, this.onMonsterMove);
    }

    private onMonsterMove(vo: stMonsterWalk) {
        if (vo.uid == this.vo.uid) {

            //=================================================================
            if (!this.visible) {
                let _newBir: newStMonsterBirth = this.vo as newStMonsterBirth;
                if (_newBir) {
                    let sub = _newBir.birthTime - this.model.curAdapter.clockTimeMs
                    if (sub > 0) {
                        _newBir.birthTime = this.model.curAdapter.clockTimeMs;
                        
                        // LogSys.Warn(`出生时间纠正 uid:${this.vo.uid}  sub:${sub}`);

                        // this.visible = true;
                        if (this.model.fightView) {
                            this.model.fightView.updateMonsterCount();
                        }
                    }
                }
            }

            this.moveTo(vo);
        }
    }

    protected addAvatarCheck() {
        this._avatarCheck = this.coreSpine.skeleton.addComponent(TowerAvatarCheck);
        this._avatarCheck.avatar = this;
    }

    /**停止移动 */
    stopMove(){
        if (this._moveTween) {
            this._moveTween.clear();
            this._moveTween = null;
        }
    }

    dispose() {
        super.dispose();
        // this.effect = null;
        this.effects = null;
        this.model.off(ComposeEvent.AddFrontEffect,this,this.onAvatarEffect);
        this.model.off(ComposeEvent.FightResClear,this,this.dispose);
        this.model.off(ComposeEvent.MonsterMove, this, this.onMonsterMove);
        this.model.off(ComposeEvent.PlayOnceEffect,this,this.onPlayOnceEffect);
        this.model.off(ComposeEvent.MonsterPlayOnceAnim,this,this.onPlayOnceAnim);
        // this.model.off(ComposeEvent.HeroUpTips,this,this.onHeroUpTips);

        this.bloodFlys = [];
        while (this.skillBuffList.length) {
            this.skillBuffList.shift();
        }
        this.oldIndex = -1;
        this.isLoaded = false;
        if (this.bloodTxt) {
            this.bloodTxt.dispose();
            this.bloodTxt = null;
        }
        if (this.bloodView) {
            this.bloodView.dispose();
            this.bloodView = null;
        }
        if (this.bossCutdown) {
            this.bossCutdown.dispose();
            this.bossCutdown = null;
        }
        this.stopMove();
        if(this._avatarCheck){
            this._avatarCheck.destroy();
            this._avatarCheck = null;
        }
        
        // this._monster.dispose();
    }
    /**添加到舞台 */
    protected addToParent() {
        if(!this.coreSpine){
            LogSys.Error(`....addToParent fail!`);
            return;
        }
        let skel = this.coreSpine.skeleton;
        if (this.chindIndex == -1) {
            this.parent.addChild(skel);
        } else {
            this.parent.addChildAt(skel, this.chindIndex);
        }
        this.updatePlaybackRate();
        this.addDebug();

        //================================================
        let _newObj: newStMonsterBirth = this.vo as newStMonsterBirth;
        if(_newObj && _newObj.scale!=undefined){
            this.updateScale(_newObj.scale);
        }
        //================================================

        //特效补充
        this.reconnectionCheck();
    }

    /**重连出生怪物特效补充 */
    private reconnectionCheck(){
        let _list = this.model.avatarEffectList
        for(let i = 0;i < _list.length;i++){
            let vo = _list[i];
            if(this.checkTarget(vo)){
                _list.splice(i,1);
                this.createAvatarEffect(vo);
            }
        }
    }

    protected onSpine1Complete() {
        this.isLoaded = true;
        if (!this.isDestory) {
            //=================================================
            this.addToParent();
            this.dir = EAvatarDir.Right;
            //=================================================
            this.moveTo(this.tmpWalkVo);

            if (this.vo.blood > 0) {
                this.bloodView = FightFactory.createBloodImg(this);
                // LogSys.Log(`创建怪物${this.vo.uid}显示对象`);
            }

            let monsterType = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(this.vo.fid).f_monster_type;
            this.monsterType = monsterType;
            if (monsterType == EMonsterType.Boss || monsterType == EMonsterType.LimitTimeBoss) {

                //===============================创建倒计时
                let offsetSec:number = this.model.curAdapter.getDisappearTime(this.vo.fid);

                let curTime: number = this.model.curAdapter.clockTimeMs / 1000;

                if (!this.vo.disappearTime) {
                    this.vo.disappearTime = curTime + offsetSec;
                }else{
                    if(this.vo.disappearTime -  curTime > offsetSec){
                        this.vo.disappearTime = curTime + offsetSec;
                    }
                }
                if(!this.model.fightTypeAdaper.cfg.f_disable_boss_cutdown){
                    this.bossCutdown = FightFactory.createCutdownTime(this);
                }
                //====================================
                this.bloodTxt = FightFactory.createFontTxt(this);
            }

            this.addAvatarCheck();

            // this.coreSpine.skeleton.addComponent(TowerMonsterCheckPos).avatar = this;
            //==========================================================
            // this.asynRemove();
            //==========================================================
            
        }
    }

    protected addDebug(){
        if(debug){
            this.coreSpine.skeleton.addComponent(FightMonsterDebug).avatar = this;
        }
    }

    // /**异步移除 */
    // private asynRemove(){
    //     let uid:number = this.vo.uid;
    //     let findIndex = this.model.delFailUids.indexOf(uid);
    //     if(findIndex!=-1){
    //         // this.dispose();
    //         this.model.delFailUids.splice(findIndex,1);
    //         LogSys.Log(`异步移除怪物:${this.vo.uid},${JSON.stringify(this.model.delFailUids)}`);
    //         this.model.event(ComposeEvent.MonsterRemove,uid);
    //     }
    // }

    private onMoveEnd(vo: TowerMoveVo) {
        this.updateDir(vo);
        if(this._moveTween){
            this._moveTween.to(this.coreSpine.skeleton, { x: vo.tx, y: vo.ty }, vo.time);
        }
    }
    private updateDir(vo: TowerMoveVo) {
        if(vo.tx == this.coreSpine.skeleton.x && vo.ty == this.coreSpine.skeleton.y){
            return;
        }
        let v: EAvatarDir;
        if (vo.tx < this.coreSpine.skeleton.x) {
            v = EAvatarDir.Left;
        } else if (vo.tx == this.coreSpine.skeleton.x) {
            let revert: number = 1;
            if (this.owner == EMonsterPos.Owner) {
                revert = -1;
            }
            if (vo.ty < this.coreSpine.skeleton.y) {
                v = EAvatarDir.Left;
            } else {
                v = EAvatarDir.Right;
            }
            v = v * revert;
        } else {
            v = EAvatarDir.Right;
        }
        this.dir = v
    }
    private get owner(){
        return this.model.getOwnerType(this.vo.playerId);
    }
    /**更新缩放比例 */
    updateScale(v:number){
        if(this.coreSpine){
            this.coreSpine.updateScale(v);
        }else{
            LogSys.Warn(`avatar未实例化...uid:${this.vo.uid}`);
        }
    }
    /**
     * 移动 
     */
    private moveTo(_walkVo: stMonsterWalk) {
        // if(this.isDestory){
        //     return;
        // }
        if (!_walkVo) {
            return;
        }
        this.tmpWalkVo = _walkVo;
        if (!this.isLoaded) {
            return;
        }
        let owner: number = this.owner;
        // if(Laya.Utils.getQueryString("walkdebug")){

        // let offsetY:number = 0;
        if (this.oldIndex != -1) {
            let walklist: TowerMoveVo[] = FightUtils.buildWalkList(this.oldIndex, _walkVo, owner);
            if (walklist.length >= 1) {
                let vo = walklist.shift();
                if (!this._moveTween) {
                    this._moveTween = new Laya.Tween();
                }
                let _handler: Laya.Handler;
                if (walklist.length > 0) {
                    _handler = new Laya.Handler(this, this.onMoveEnd, [walklist.shift()]);
                }
                this.updateDir(vo);
                //================================================================
                let timescale = 1;
                this._moveTween.to(this.coreSpine.skeleton, { x: vo.tx, y: vo.ty }, vo.time * timescale, null, _handler);
            }
        } else {
            let walk = FightUtils.getWalkByType(owner);
            let pos = walk.paths[_walkVo.index];
            this.coreSpine.skeleton.x = pos.x;
            this.coreSpine.skeleton.y = pos.y + (owner > EMonsterPos.Owner ? FightUtils.topOffsetY : 0);
        }

        this.oldIndex = _walkVo.index;
    }

    /**当前所在区域 */
    get region(){
        return FightUtils.getRegion(this.owner,this.oldIndex);
    }

    /**当前的坐标索引 */
    get curPosIndex(){
        return this.oldIndex;
    }

    set dir(v: EAvatarDir) {
        this.coreSpine.dir = v;
    }
    get dir(){
        if(this.coreSpine){
            return this.coreSpine.dir;
        }
        return EAvatarDir.Left;
    }
    set visible(v:boolean){
        this._vis = v;
        if(this.coreSpine && this.coreSpine.skeleton){
            this.coreSpine.skeleton.visible = v;
        }
    }

    get visible(){
        return this._vis;
    }
}