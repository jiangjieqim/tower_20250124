// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { ELayerType } from "../../../../layer/LayerMgr";
import { LoginClient } from "../../../../network/clients/LoginClient";
import { MonsterScale_revc, RougeChoose_revc, stElement, stFightSkillEffect, stMonsterBirth, stMonsterWalk, stSkillBar, stSubBlood, WaveSettleReward_revc } from "../../../../network/protocols/BaseProto";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { GuideUtils } from "../../guide/GuideUtils";
import { ESystemRefreshTime } from "../../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { GameEvent } from "../../main/model/GameEvent";
import { MainModel } from "../../main/model/MainModel";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { AtkBaseDectorator } from "../decorator/AtkBaseDectorator";
import { AtkBuffDectorator } from "../decorator/AtkBuffDectorator";
import { MonsterEffectDecorator } from "../decorator/MonsterEffectDecorator";
import { MonsterHitSoundDecorator } from "../decorator/MonsterHitSoundDecorator";
import { ShootDectorator } from "../decorator/ShootDectorator";
import { SkillSoundDecorator } from "../decorator/SkillSoundDecorator";
import { FightFactory } from "../FightFactory";
import { FightUIFactory } from "../FightUIFactory";
import { FightUtils } from "../FightUtils";
import { HeroEffectPlayDecorator } from "../HeroEffectPlayDecorator";
import { LoopMonsterCreateMgr } from "../LoopMonsterCreateMgr";
import { EMonsterType, t_Battle_Config } from "../t_Battle_Config";
// import { t_Monster } from "../t_Monster_Template";
import { EComposeUpdateType } from "../vos/EComposeUpdateType";
import { EEffectTarget, EFightLayer, IAddHero, IDelHeroUpdate, IIceMapData, IUpdateHero, newStMonsterBirth } from "../vos/EFightEnum";
import { ESubBloodType } from "../vos/ESubBloodType";
import { FightMainEvent } from "../vos/FightMainEvent";
import { FightSkillEffectVo } from "../vos/FightSkillEffectVo";
import { EMonsterPos, FightValueConfig } from "../vos/FightValueConfig";
import { IFightMainView } from "../vos/IFightMainView";
import { EBattleEffectConfig, EClientEffectUID } from "../vos/t_Battle_Effect";
import { t_HeroAddSubEffect } from "../vos/t_HeroAddSubEffect";
import { BaseDecorator } from "./avatar/BaseDecorator";
// import { BuffDecorator } from "./avatar/BuffDecorator";
import { SunWuKongDecorator } from "./avatar/SunWuKongDecorator";
import { DoorView } from "./cells/DoorView";
import { FrozenIceView } from "./cells/FrozenIceView";
import { GroundCellView } from "./cells/GroundCellView";
import { GuideCell } from "./cells/GuideCell";
import { ComposeDragGrid } from "./ComposeDragGrid";
import { ComposeMain } from "./ComposeMain";
import { ComposeTips } from "./ComposeTips";
import { CutdownView } from "./CutdownView";
import { DragHeroCtl } from "./DragHeroCtl";
import { FightArtScene } from "./FightArtScene";
import { HeroAvatarView } from "./HeroAvatarView";
import { HeroCirleYellow } from "./HeroCirleYellow";
import { IPvproundResult } from "./PvproundResult";
// import { HitAnimationDecorator } from "./HitAnimationDecorator";
import { TopDragYellowView } from "./TopDragYellowView";
import { TowerAvatarView } from "./TowerAvatarView";
import { Trail } from "./Trail";
import { TrailComposeDecorator } from "./TrailComposeDecorator";
import { ITrailDecorator, TrailDecorator } from "./TrailDecorator";
import { TrailSoundDecorator } from "./TrailSoundDecorator";
/**战斗主视图 */
export class FightMainView extends Laya.Sprite implements IFightMainView{
    private isExit:boolean = false;
    get selfPlayerId(){
        return this.model.ownerPlayer.playerId;
    }
    get enemyPlayerId(){
        return this.model.enemyPlayer.playerId;
    }

    monsterList:TowerAvatarView[] = [];
    /**己方最新移除的怪物坐标 */
    private _ownerRemoveMonsterIndex:number = 0;
    // heroCtlLayer:Laya.Sprite;
    /**动物(英雄)和扩展格子 */
    private _gridItemList:ComposeDragGrid[] = [];
    //地板特效列表
    private groundList:GroundCellView[] = [];
    /**英雄容器列表 */
    get gridItemList(){
        return this._gridItemList;
    }
    private model: ComposeModel;
    private composeView:ComposeMain;

    /**光环特效层 */
    private haloLayer:Laya.Sprite;
    /**地板层 */
    private groundLayer:Laya.Sprite;
    /**技能条层级 */
    private skillBarLayer:Laya.Sprite;
    /**怪物层 */
    private monsterLayer:Laya.Sprite;
    /**英雄层 */
    private heroLayer:Laya.Sprite;
    /**弹道层 */
    private shootCon:Laya.Sprite;
    /**血条层 */
    private bloodCon:Laya.Sprite;
    /**场景特效层 */
    private sceneEffectCon:Laya.Sprite;
    /**怪物受击层*/
    private beHitMonsterLayer:Laya.Sprite;
    /**掉血飘字层 */
    private subBloodTxtCon:Laya.Sprite;
    /**底部展示的18个半透明显示格子层 */
    private bottom_18_alphaGridLayer:Laya.Sprite;
    /**顶部拖拽层 */
    topDragLayer:TopDragYellowView;
    /**拖拽控制器 */
    private heroDragCtl:DragHeroCtl = new DragHeroCtl();
    private _heroCirleYellow:HeroCirleYellow;
    private subBloodMS:number = 0;

    /**英雄攻击区域显示 */
    // private _heroCirleYellow:HeroCirleYellow;

    private door0:DoorView;
    private door1:DoorView;
    private _ownerFrozenIce:FrozenIceView;
    private _enemyFrozenIce: FrozenIceView;
    private decList:BaseDecorator[] = [];
    // private _hitAnimationDecorator:HitAnimationDecorator = new HitAnimationDecorator();
    /**悟空特效装饰器 */
    private sunWuKongDecorator:SunWuKongDecorator = new SunWuKongDecorator();
    /**英雄特效装饰器 */
    private heroEffectPlayDecorator:HeroEffectPlayDecorator = new HeroEffectPlayDecorator();
    /**轨迹 */
    private _trailDecorator:ITrailDecorator;
    /**特效表现装饰器 */
    private _atkDectorator:AtkBaseDectorator;

    private _cutdowntime:CutdownView;
    private artScene:FightArtScene;
    /**获取妖王 */
    getSelfBogyBoss() {
        if (this.monsterList) {
            return this.monsterList.find(o => this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(o.vo.fid).f_monster_type == EMonsterType.Boss && this.model.ownerPlayer.playerId == o.vo.playerId);
        }
    }

    //怪物
    // 11-guidemonster-1-3-n30-n70-100-100
    getMonsterCellView(arr:string[]){
        
        let type = parseInt(arr[1]);
        if(type == 1){
            //1-3 uid=3的怪物的倒计时框
            let uid = parseInt(arr[2]);
            let fight = this.model.fightView;
            if(fight){
                let monsterView:TowerAvatarView = fight.monsterList.find(o=>o.vo.uid == uid);
                if(monsterView && monsterView.bloodView){
                    let cell = monsterView.bloodView.guideCell;
                    cell.parse(arr[3],arr[4],arr[5],arr[6]);
                    return cell.monsterRect;
                }
            }
        }
    }

    private _doorGuide:GuideCell;

    //出生点特效
    //11-guidedoor-1-n0-n0-100-100
    guideDoor(arr: string[]) {
        let type = parseInt(arr[1]);
        // let door:DoorView;
        // if(type == 1){
        // door = this.door1;
        // }
        // else{
        // door = this.door0;
        // }
/*
        if (door) {
            let cell = door.cell;
            if (cell) {
                cell.parse(arr[2], arr[3], arr[4], arr[5]);
                return cell.monsterRect;
            }
        }
*/
        if(!this._doorGuide){
            this._doorGuide = new GuideCell(this.sceneEffectCon);
        }
        this._doorGuide.parse(arr[2],arr[3],arr[4],arr[5]);
        return this._doorGuide.monsterRect;
    }
    setCutdown(num:number){
        if(!this._cutdowntime){
            this._cutdowntime = new CutdownView();
        }
        this._cutdowntime.x = 39;
        this._cutdowntime.y = 852;
        (this.parent as Laya.Sprite).addChild(this._cutdowntime);
        this._cutdowntime.time = num;
    }

    /**获取层Sprite */
    getLayer(type: EFightLayer) {
        switch (type) {
            case EFightLayer.BLOOD:
                return this.bloodCon;
            case EFightLayer.HitMonsterLayer:
                return this.beHitMonsterLayer;
            case EFightLayer.HaloLayer:
                return this.haloLayer;
            case EFightLayer.SkillBarLayer:
                return this.skillBarLayer;
            case EFightLayer.Ground:
                return this.groundLayer;
            case EFightLayer.ShootLayer:
                return this.shootCon;
        }
    }

    /**打开英雄的黄色的框 */
    private openCirleYellow(uid: number) {
        let gridList = this.gridItemList;
        let grid = gridList.find(o => o.data.uid == uid);
        if (grid) {
            let vo = grid.data;
            // let vo = this.model.refreshList.find(o => o.uid == uid);
            if (vo) {
                this._heroCirleYellow.show(vo);
                grid.addChild(this._heroCirleYellow);
            } else {
                this._heroCirleYellow.close()
            }
        }
    }
    /**关闭英雄的黄色的框 */
    closeCirleYellow(){
        this._heroCirleYellow.close();
    }

    /*为地板上添加特效*/
    updateEffectGround(cardUID:number,ox: number, oy: number, playerId: number, url: string,layer:EFightLayer) {
        let findIndex: number = this.groundList.findIndex(o => o.url == url && o.playerId == playerId && o.ox == ox && o.oy == oy);
        if(findIndex != -1){
            let obj = this.groundList[findIndex];
            obj.dispose();
            this.groundList.splice(findIndex,1);
        }
        if(!StringUtil.IsNullOrEmpty(url)){
            let cell = FightFactory.createGroundEffect(cardUID,ox,oy,playerId,url,layer);
            this.groundList.push(cell);
        }
    }

    addToBottomLayer(){
        if(!this.bottom_18_alphaGridLayer.parent){
            this.addChildAt(this.bottom_18_alphaGridLayer,this.getChildIndex(this.haloLayer));
        }
    }

    removeBottomLayer(){
        this.bottom_18_alphaGridLayer.removeSelf();
    }

    private initLayer(){

        // this.mapLayer = new Laya.Sprite();
        // this.mapLayer.x = ComposeConfig.cellW;
        // this.mapLayer.y = ComposeConfig.cellH;
        // this.addChild(this.mapLayer);
        this.haloLayer = new Laya.Sprite();
        this.haloLayer.x = ComposeConfig.cellW;
        this.haloLayer.y = ComposeConfig.cellH;
        this.addChild(this.haloLayer);

        this.door0 = new DoorView();

        this.door1 = new DoorView();
        this.door1.setPos(this.haloLayer, -ComposeConfig.cellW / 2, ComposeConfig.cellH * 3.5);

        DebugUtil.draw(this,"#00FFFF",ComposeConfig.cellW * 8,ComposeConfig.cellH * 5,undefined,undefined,undefined,2);

        this.bottom_18_alphaGridLayer = new Laya.Sprite();
        this.bottom_18_alphaGridLayer.x = ComposeConfig.cellW;
        this.bottom_18_alphaGridLayer.y = ComposeConfig.cellH;
        // this.addChild(this.bottomGridLayer);
        this.initbottomGridLayer();

        //地板层
        this.groundLayer = new Laya.Sprite();
        this.groundLayer.x = ComposeConfig.cellW;
        this.groundLayer.y = ComposeConfig.cellH;
        // debug && this.groundLayer.graphics.drawRect(0,0,100,100,null,'#ff0000');
        this.addChild(this.groundLayer);

        //底座技能条层
        this.skillBarLayer = new Laya.Sprite();
        this.skillBarLayer.x = ComposeConfig.cellW;
        this.skillBarLayer.y = ComposeConfig.cellH;
        this.addChild(this.skillBarLayer);

        //怪物层
        this.monsterLayer = new Laya.Sprite();
        this.addChild(this.monsterLayer);

        //英雄层
        this.heroLayer = new Laya.Sprite();
        this.heroLayer.x = ComposeConfig.cellW;
        this.heroLayer.y = ComposeConfig.cellH;
        this.addChild(this.heroLayer);

        this.heroDragCtl.setContainer(this.heroLayer);//默认的

        //怪物受击层
        this.beHitMonsterLayer = new Laya.Sprite();
        this.addChild(this.beHitMonsterLayer);

        //掉血字层
        this.subBloodTxtCon = new Laya.Sprite();
        this.addChild(this.subBloodTxtCon);

        //弹道层
        this.shootCon = new Laya.Sprite();
        this.addChild(this.shootCon);

        //血条层
        this.bloodCon = new Laya.Sprite();
        this.addChild(this.bloodCon);

        //场景层
        this.sceneEffectCon = new Laya.Sprite();
        this.addChild(this.sceneEffectCon);
        this.artScene = new FightArtScene(this.sceneEffectCon);
        //=======================================================

        this.topDragLayer = new TopDragYellowView();
        this.topDragLayer.x = ComposeConfig.cellW;
        this.topDragLayer.y = ComposeConfig.cellH;
        this.addChild(this.topDragLayer);

        this._heroCirleYellow = new HeroCirleYellow();

        this.subBloodMS = parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.FIGHT_SUB_BLOOD_MS));

    }
    private gcTicket: number = 0;
    private onGcHandler() {
        let val = System_RefreshTimeProxy.Ins.getVal(98);
        if (!StringUtil.IsNullOrEmpty(val)) {
            Laya.timer.once(10, this, this.onGcHandler);
            if (this.gcTicket % parseInt(val) == 1) {
                // LogSys.Log("GC...");
                // Laya.Scene.gc();//gc会终止动画回调
            }
        }
        this.gcTicket++;
    }

    private openOwnerIce(v:boolean,uid:number){
        if(v){
            if(!this._ownerFrozenIce){
                this._ownerFrozenIce = new FrozenIceView(EMonsterPos.Owner);
            }
            this._ownerFrozenIce.playerId = this.model.ownerPlayer.playerId;
            this._ownerFrozenIce.uid= uid;
            this.addChildAt(this._ownerFrozenIce,0);
            this._ownerFrozenIce.layout();
        }else{
            if(this._ownerFrozenIce){
                this._ownerFrozenIce.hide();
            }
        }
    }

    /**棋盘是否无法操作 */
    private get bIceMapCdCold(){
        return this._ownerFrozenIce && this._ownerFrozenIce;
    }

    private openEnemyIce(v:boolean,uid:number){
        if(v){
            if(!this._enemyFrozenIce){
                this._enemyFrozenIce = new FrozenIceView(EMonsterPos.OtherPlayer);
            }
            this._enemyFrozenIce.playerId = this.model.enemyPlayer.playerId;
            this._enemyFrozenIce.uid = uid;
            this.addChildAt(this._enemyFrozenIce,0);
            this._enemyFrozenIce.layout();
        }else{
            if(this._enemyFrozenIce){
                this._enemyFrozenIce.hide();
            }
        }
    }


    /**点击其他区域 */
    private onBgClickHandler(e:Laya.Event){
        // console.log(Math.random() + "...");
        // this.model.closeComposeTips();
        // this.closeCirleYellow();
        E.ViewMgr.Close(EViewType.FuncCardShow);
    }

    private initbottomGridLayer(){
        let showgrid: Laya.Sprite = this.bottom_18_alphaGridLayer;
        showgrid.alpha = 0.1;
        let offset: number = 3;
        for (let i = 0; i < ComposeConfig.mapH; i++) {
            for (let n = 0; n < ComposeConfig.mapW; n++) {

                showgrid.graphics.drawRect(
                    n * ComposeConfig.cellW + offset,
                    ComposeConfig.cellH * (ComposeConfig.mapH - i - 1) + offset,
                    ComposeConfig.cellW - offset * 2, ComposeConfig.cellH - offset * 2,
                    "#000000");
            }
        }
    }
    onShow(){
        LogSys.Log("fightView is onShow...");
        this.onPvpRoundStatusChange();
        this.onRougeOpen();
        this.addLine();
        this.model.event(ComposeEvent.FightViewOnShow);
    }
    constructor() {
        super();
        this.model = ComposeModel.Ins;
        this._trailDecorator = new TrailDecorator();
        this._trailDecorator = new TrailComposeDecorator(this._trailDecorator);
        this._trailDecorator = new TrailSoundDecorator(this._trailDecorator);

        // GuideUtils.gridItemList = this._gridItemList;
        GuideUtils.fight = this;
        // LayerMgr.Ins.fightLayer = this;
        E.ViewMgr.Reg(new ComposeTips(EViewType.CompSell,ELayerType.subFrameLayer));//ELayerType.fightLayer
        this.composeView = this.model.composeView;//E.ViewMgr.Get(EViewType.ComposeMain) as ComposeMain;
        //===========================================
        //初始化层级
        this.initLayer();
        //===========================================
        // this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        // this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);       
        //初始化特效表现装饰器
        this._atkDectorator = new MonsterEffectDecorator();
        this._atkDectorator = new SkillSoundDecorator(this._atkDectorator);
        this._atkDectorator = new AtkBuffDectorator(this._atkDectorator);
        this._atkDectorator = new ShootDectorator(this._atkDectorator);
        this._atkDectorator = new MonsterHitSoundDecorator(this._atkDectorator);
    }

    private onMonsterDel(monster:TowerAvatarView){
        monster.dispose();
    }

    /**怪物移除 */
    onRemoveMonster(uid:number){
        // console.log("移除"+uid);
        let _index =  this.monsterList.findIndex(o=>o.vo.uid == uid);
        if(_index!=-1){
            let monster = this.monsterList[_index];
            if(monster.vo.playerId == MainModel.Ins.mRoleData.AccountId){
                this._ownerRemoveMonsterIndex = monster.curPosIndex;
                // LogSys.Log(`当前移除的己方怪物坐标索引为:${this.ownerMonsterIndex}`);
            }
            monster.stopMove();
            if(monster.coreSpine){
                monster.coreSpine.play(EAvatarAnim.MonsterBeHit,this,this.onMonsterDel,monster);
            }else{
                monster.dispose();
            }
            this.monsterList.splice(_index,1);
        }else{
            // LogSys.Warn("移除怪物:"+uid+"失败");
            // if(this.model.delFailUids.indexOf(uid) == -1){
            //     this.model.delFailUids.push(uid);
            // }
        }
        // this.updateMonsterCount();
    }

    // private monsterPlayAnimOnceBack(monster:TowerAvatarView){
    //     monster.coreSpine.play(EAvatarAnim.MonsterMove, undefined, undefined, undefined, undefined, undefined, true);
    // }
    // monsterPlayAnimOnce(uid:number,anim:EAvatarAnim){
    //     let _index =  this.monsterList.findIndex(o=>o.vo.uid == uid);
    //     if(_index!=-1){
    //         let monster = this.monsterList[_index];
    //         if(monster.coreSpine){
    //             monster.coreSpine.play(anim,this,this.monsterPlayAnimOnceBack,monster);
    //         }
    //     }
    // }

    /**单个攻击行为 */
    private onAtkCell(vo: FightSkillEffectVo, _attacker: ComposeDragGrid, targetUID: number) {
        let _monster: TowerAvatarView = this.monsterList.find(o => o.vo.uid == targetUID);//怪物

        if(debug){
            if(!_monster){
                LogSys.Warn(`行为攻击者 uid:${_attacker.data.uid} fid:${_attacker.data.fid} 怪物${targetUID}已经死亡`);
            }
        }

        if (targetUID == 0 || _monster && _monster.isLoaded) {            
            //受击特效 =======================================================================
            this._atkDectorator.parse(vo, _attacker, _monster);
        
            // if(initConfig.memoryDebugCount){
            //     for(let i = 0;i < initConfig.memoryDebugCount;i++){
            //         this._atkDectorator.parse(vo, _attacker, _monster);
            //     }
            // }
        }

    }

    clearTopDragLayer(){
        this.topDragLayer.clear(`clearTopDragLayer`);
    }

    /**受击 */
    onAtk(_l: stFightSkillEffect[]) {
        // console.log(`受到攻击:`,_l);
        for (let i = 0; i < _l.length; i++) {
            let _data = _l[i];
            let _vo = new FightSkillEffectVo(_data);
            let destUID: number = _data.attackerUid;//攻击者
            let l = this.gridItemList;
            let _attacker: ComposeDragGrid = l.find(o => o.uid == destUID);
            if (_attacker) {

                if (debug && _vo.skillCfg) {
                    FightFactory.createFlyLabel(`${_vo.skillCfg.f_skillid}`, _attacker);
                }
                if(_data.targetUids.length > 0){
                    for (let n = 0; n < _data.targetUids.length; n++) {
                        let targetUID = _data.targetUids[n];//受击者uid
                        this.onAtkCell(_vo, _attacker, targetUID);
                    }
                }else{
                    this.onAtkCell(_vo, _attacker, 0);
                }
            }
        }
    }
    // private readonly DEl_TIME:number = 500;
    /**英雄删除 */
    private onHeroDelByUID(obj: IDelHeroUpdate) {
        if(!this.model.ownerPlayer){
            return;
        }
        let uid = obj.uid;
        let self:boolean;
        let index = this._gridItemList.findIndex(o => o.uid == uid);
        if (index != -1) {
            let _grid = this._gridItemList[index];
            // LogSys.Log(`删除英雄 uid:${uid}`);
            let delayTime:number = obj.delayTime;
            if(_grid.data.playerId == this.model.ownerPlayer.playerId){
                self = true;
            }
            /*
            
            */
            // Laya.timer.once(delayTime,_grid,_grid.dispose);
            if (delayTime > 0) {
                let timer: Laya.Timer = new Laya.Timer();
                timer.once(delayTime, _grid, _grid.dispose);
            } else {
                _grid.dispose();
            }
            this._gridItemList.splice(index, 1);
        }
        this.onUpdateHeroCount(self);
    }

    private onUpdateHeroCount(self:boolean){
        // this.composeView.onUpdateHeroCount();
        this.model.event(ComposeEvent.UpdateOwnerHeroCount,self);
    }

    private clientHeroMove(uid:number,x:number,y:number){
        if(this.bIceMapCdCold){
            //地图锁定
            return;
        }
        let hero = this.gridItemList.find(o=>o.uid == uid);
        if(hero && hero.animal){
            let l = hero.animal.heroList;
            for(let i = 0;i < l.length;i++){
                let cell = l[i];
                // if(cell && cell.effect && cell.effect.isIce){
                if(cell && cell.hasIce){
                    //冰块锁定英雄
                    return;
                }
            }
        }

        this.model.curAdapter.clientHeroMove(this, uid, x, y);
    }

    /**交换英雄 */
    switchHero(a: number, b: number) {
        let _agrid = this.gridItemList.find(o => o.uid == a);
        if (_agrid) {
            let _bgrid = this.gridItemList.find(o => o.uid == b);
            if (_bgrid) {
                let oldx = _agrid.data.x;
                let oldy = _agrid.data.y;
                this.clientHeroMove(b, oldx, oldy);
                this.clientHeroMove(a, _bgrid.data.x, _bgrid.data.y);
            }
        }
    }

    /**英雄更新 */
    onHeroUpdate(obj:IUpdateHero){
        this.heroUpdate(obj);
        // this.model.heroMgr.onHeroUpdate(obj);
    }

    /** 英雄更新2*/
    private heroUpdate(obj:IUpdateHero){
        if(!this.model.ownerPlayer){
            return;
        }
        let _vo:stElement = obj.vo;
        let _grid = this.gridItemList.find(o=>o.uid== _vo.uid);
        let needTime:number = 0;
        let needUpdate:boolean = true;
        if(_grid){
            // this.fightView.topDragYellow.clear();
            let oldVo = _grid.data;
            let oldFid:number = _grid.data.fid;
            // console.log(`old:${oldFid} newfid:${_grid.data.fid}`);
            _grid.data = _vo;

            if(obj.type == EComposeUpdateType.CreateIceGrid){
                this.model.createLoopEffect(EBattleEffectConfig.ICE,EEffectTarget.Hero,_vo.playerId,_vo.uid,EClientEffectUID.ICE_UID);
            }
            else if(obj.type == EComposeUpdateType.DelIceGrid){
                this.model.delLoopEffect(_vo.playerId,EClientEffectUID.ICE_UID,[_vo.uid]);
            }
            else if(oldVo.x!=_vo.x || oldVo.y!=_vo.y){
                //移动
                needTime = _grid.moveTo(_vo.x, _vo.y);
            }
            else if(oldFid != _vo.fid){
                //删除操作

                //     if(_grid.animal){
                //         _grid.animal.delOneHero();
                //         _grid.animal.addOneHero(_vo);
                //     }
                if(_grid.animal){
                    _grid.animal.clearHero();
                    let len = _vo.num;
                    for(let i = 0;i < len;i++){
                        _grid.animal.addOneHero(_vo);
                    }
                }

                // LogSys.Log(`uid:${_vo.uid}----> 形象${oldVo.fid}变化为形象${_vo.fid}`);
            }
            else if(oldVo.num!=_vo.num){
                // LogSys.Log(`坐标x:${_vo.x} y:${_vo.y}英雄 uid:${_vo.uid} 数量${oldVo.num}变化为${_vo.num}`);

                let _count = _vo.num - oldVo.num;
                // let cardCfg = t_Function_Card.Ins.getCfgById(obj.cardId);
                let target:EEffectTarget = EEffectTarget.Hero;
                if(_count >  0){
                    for(let i = 0;i < _count;i++){
                        //数量变化进行更新
                        let useTime:number = 0;
                        if(_vo.playerId == MainModel.Ins.mRoleData.AccountId){
                            useTime = Trail.useTime;
                            this._trailDecorator.play(_vo,obj.type,obj.delList,false);
                        }
                        needTime = useTime;
                        let timer = new Laya.Timer();
                        timer.once(useTime,this,this.onAddHero,[_grid,_vo]);
                    }
                }
                else if(_count < 0){
                    target = EEffectTarget.Grid;
                    let _len = Math.abs(_count);
                    for(let i = 0; i < _len;i++){
                        _grid.animal.delOneHero();//删除英雄
                    }
                }
                else{
                    let err = `${_vo.uid} 缺少实现...`;
                    // throw new Error(err);
                    LogSys.Error(err);
                }

                if(obj.type == EComposeUpdateType.FuncCard){ 
                    this.playOnceInHero(obj.cardId,_vo.uid,_vo.playerId,obj.cardSerialNum,target,_count > 0);
                }
            }
            else{
                needUpdate = false;
            }
        }else{
            LogSys.Warn(`onHeroUpdate未找到!!!${JSON.stringify(_vo)}`);
        }
        if(needUpdate){
            this.onUpdateHeroCount(_vo.playerId == this.model.ownerPlayer.playerId);
            this.updateZOrderNeedMS(needTime);
        }
    }

    private updateZOrderNeedMS(ms:number){
        Laya.timer.once(ms,this,this.updateGridZSort);
    }

    private onZOrderSortHander(a:ComposeDragGrid,b:ComposeDragGrid){
        if(a.y > b.y){
            return 1;
        }
        else if(a.y < b.y){
            return -1;
        }
        return 0;
    }

    /**更新Zorder */
    updateGridZSort(){
        this._gridItemList.sort(this.onZOrderSortHander);
        let _l = this._gridItemList;
        for(let i = 0;i < _l.length;i++){
            let o = _l[i];
            o.zOrder = i;
        }
        // LogSys.Log("更新ZOrder...");
        // this.heroLayer.updateZOrder();
    }

    private onAddHero(_grid:ComposeDragGrid,_vo:stElement){
        // LogSys.Log(`onAddHero英雄!!!!!`+JSON.stringify(_vo));
        if(_grid && _grid.animal){
            _grid.animal.addOneHero(_vo);
        }
    }
    
    /**添加英雄到舞台 */
    addHeroToStage(_grid:ComposeDragGrid,obj:IAddHero,o:stElement){

        this.heroLayer.addChild(_grid);
        // LogSys.Log(`onLaterCreateHero增加英雄到舞台 ${JSON.stringify(_grid.data)}`);

        switch(obj.type){
            case EComposeUpdateType.FuncCard:
                this.playOnceInHero(obj.cardId,o.uid,o.playerId,obj.cardSerialNum,EEffectTarget.Hero,true);
                break;
            case EComposeUpdateType.DoubleBody:
                this.event(FightMainEvent.SunWuKongDoubleBody,o);
                break;
        }
    }

    /**
     * 创建一个格子
     */
    private createGird(o: stElement) {
        let grid = new ComposeDragGrid();
        grid.data = o;
        grid.uid = o.uid;
        grid.load();
        grid.curIsoX = o.x;
        grid.curIsoY = o.y;
        grid.refresh();
        return grid;
    }
    private onIceMap(vo: IIceMapData) {
        if (vo.playerId == this.model.ownerPlayer.playerId) {
            this.openOwnerIce(vo.status, vo.cardUid);
        } else {
            this.openEnemyIce(vo.status, vo.cardUid);
        }
    }

    /**在英雄前层播放一个特效 */
    private playOnceInHero(cardId:number,heroUID:number,playerId:number,cardSerialNum:number,target:EEffectTarget,isAdd:boolean){
        let cardCfg = t_Function_Card.Ins.getCfgById(cardId);
        let effectId:number = 0;
        let cfg =  t_HeroAddSubEffect.Ins.getByCardId(cardId);
        if(cfg){
            if(isAdd){
                effectId = cfg.f_addid;
            }else{
                effectId = cfg.f_subid;
            }
        }else{
            effectId =  cardCfg.f_effect_id;
        }
        if(effectId > 0){
            LogSys.Log(`播放特效: heroUID ${heroUID}----->cardId: ${cardId} 目标类型:${target}`);
            this.model.playCardOnce(heroUID,cardId,target,playerId,cardSerialNum,effectId);
        }else{
            // LogSys.Log(`playOnceInHero cardId:${cardId}` + cardId +" heroUID:" + heroUID + " playerId:" +playerId + " cardSerialNum:"+ cardSerialNum +  "target:" + target + " isAdd:" + isAdd);
        }
    }

    /**英雄增加 */
    onHeroAdd(obj:IAddHero){
        if(initConfig.disable_hero){
            return;
        }

        if(!this.model.ownerPlayer){
            return;
        }
        
        let l = obj.heroList;
        let needMs:number = 0;
        let self:boolean;
        for(let i = 0;i < l.length;i++){
            let o = l[i];
            let _useTime:number = 0;
            // LogSys.Log(`onHeroAdd增加英雄 ${JSON.stringify(o)}`);

            let _grid:ComposeDragGrid = this.createGird(o);
            this.gridItemList.push(_grid);
            
            if(o.playerId == this.model.ownerPlayer.playerId){
                self = true;
                this._trailDecorator.play(o,obj.type,obj.delList,obj.isInit);
                _useTime = Trail.useTime;
            }else{
                // //敌方数据
                // if(initConfig.disable_enemy){
                //     continue;
                // }
            }
            if(_useTime > needMs){
                needMs = _useTime;
            }
            if(MainModel.Ins.isInsideGuide){
                _useTime = 0;
            }
            this.model.heroMgr.addChildHero(_grid,obj,o,this.model.curAdapter.clockTimeMs + _useTime);
        }
        this.onUpdateHeroCount(self);
        this.updateZOrderNeedMS(needMs);
    }

    onPlaybackRate(){
        let grids = this._gridItemList;
        for(let i = 0;i < grids.length;i++){
            let cell = grids[i];
            if(cell.animal && cell.animal.heroList){
                let heros = cell.animal.heroList;
                for(let n = 0;n < heros.length;n++){
                    heros[n].updatePlaybackRate();
                }
            }
        }
        for(let i = 0;i < this.monsterList.length;i++){
            let monster:TowerAvatarView = this.monsterList[i];
            monster.updatePlaybackRate();
        }
    }
    private onPvproundResult(o:IPvproundResult){
        E.ViewMgr.Open(EViewType.PvproundResult,null,o)
    }
    private initEvt(){
        this.on(Laya.Event.CLICK,this,this.onBgClickHandler);
        GuideModel.Ins.on(EGuideEvent.GuidePlayEffect,this,this.onGuidePlayEffect);
        this.model.on(ComposeEvent.HeroDelByUID,this,this.onHeroDelByUID);
        this.model.on(ComposeEvent.MonsterRemove,this,this.onRemoveMonster);
        this.model.on(ComposeEvent.MonsterNum,this,this.onMonsterNum);
        this.model.on(ComposeEvent.PvpRoundStatusChange,this,this.onPvpRoundStatusChange);
        this.model.on(ComposeEvent.RougeOpen,this,this.onRougeOpen);
        this.model.on(ComposeEvent.RougeSelect,this,this.onRougeSelect);
        this.model.on(ComposeEvent.PvproundResult,this,this.onPvproundResult);
        this.model.on(ComposeEvent.WaveSettleReward,this,this.onWaveSettleReward);
        E.EventMgr.on(GameEvent.MonsterScale,this,this.onMonsterScale);
    }

    /**怪物缩放 */
    private onMonsterScale(revc:MonsterScale_revc){
        let l = revc.datalist;
        for(let i = 0;i < l.length;i++){
            let vo = l[i];
            let scale = vo.scale/10000;
            let monster = this.monsterList.find(o=>o.vo.uid == vo.uid);
            if(monster){
                monster.updateScale(scale);
            }else{
                LogSys.Warn(`onMonsterScale 未找到怪物${vo.uid}`);
            
                let mgr:LoopMonsterCreateMgr = this.model.monsterCreateTimeMgr as any;
                if(mgr){
                    mgr.updateScale(vo.uid,scale);
                }
            }
        }
    }

    onInit(){
        this.isExit = false;
        this.door0.setPos(this.haloLayer, -ComposeConfig.cellW / 2, ComposeConfig.cellH * (-5.5 + this.model.fightTypeAdaper.offset_ISO_Y));

        GuideModel.Ins.clear();
        this.pos(FightValueConfig.fightViewX,FightValueConfig.fightViewY);
        FightUIFactory.createDebugGrid(FightUtils.topOffsetY,this.composeView._ui);
        
        // E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,`匹配超时`);
        E.ViewMgr.Close(EViewType.MsgBox);

        this.model.fightView = this;
        //================================================
        this.decList.push(this.sunWuKongDecorator,this.heroEffectPlayDecorator);
        for(let i = 0;i < this.decList.length;i++){
            let cell = this.decList[i];
            cell.onInit();
        }
        //================================================
        this.model.on(ComposeEvent.IceMap,this,this.onIceMap);
        let mapList = this.model.mapEffect;
        while(mapList.length){
            let vo = mapList.shift();
            this.onIceMap(vo);
        }
        this.initEvt();
        let p = this.parent as Laya.Sprite;
        let pos = p.localToGlobal(new Laya.Point(this.x,this.y));
        this.hitArea = new Laya.Rectangle(-pos.x,-pos.y,Laya.stage.width,Laya.stage.height);
        this.initScene();
        this.model.monsterCreateTimeMgr.start();
        this.model.heroMgr.start();
        this.artScene.onInit();

        LoginClient.Ins.startPlayAudio();
        LogSys.Log("FightMainView onInit...");
        this.onGcHandler();
    }
    private line:Laya.Sprite;
    private addLine(){
        let pos1:Laya.Point = this.getCenterXY();
        if(debug && pos1){
            if(!this.line){
                this.line = new Laya.Sprite();
                Laya.stage.addChild(this.line);
            }
            this.line.pos(0,pos1.y);
            this.line.graphics.clear();
            this.line.graphics.drawRect(0,0,Laya.stage.width,1,"#0000FF");
        }
    }
    /**更新怪物数量 */
    private onMonsterNum(){
        this.updateMonsterCount();
    }
    //private curTime:number;
    private onGuidePlayEffect(param:string){
        let url:string = param;
        let owner = EMonsterPos.Owner;
        let walk = FightUtils.getWalkByType(owner);
        let pos = walk.paths[this._ownerRemoveMonsterIndex];
        let ox = pos.x;
        let oy = pos.y + (owner > EMonsterPos.Owner ? FightUtils.topOffsetY : 0);
        // this.curTime = Laya.timer.currTimer;
        SpineEffectMgr.playOnceEnd(url,this.beHitMonsterLayer,null,ox,oy);
    }

    // private onGuidePlayNext(){
    // LogSys.Log(`onGuidePlayEffect 播放耗时为${Laya.timer.currTimer - this.curTime} ms`);
    // GuideModel.Ins.nextGuideStep();//bug
    // }

     /**初始化场景 */
     private initScene(){
        //===============================================
        let o:IAddHero = {} as IAddHero;
        o.isInit = true;
        o.cardSerialNum = 0;
        o.heroList = this.model.refreshList;
        o.type = EComposeUpdateType.Compose;
        o.cardId = 0;
        this.onHeroAdd(o);
        //===============================================
        if(this.model.sceneInfo){
            let monsters = this.model.sceneInfo.monsters;
            if(monsters.length > 0){
                // LogSys.Log(`怪物出生信息,初始化场景时的 创建怪物的数量${monsters.length}`);
                this.model.monsterCreateTimeMgr.createMonsters(monsters);
            }
        }else{
            LogSys.Log("场景数据为空...");
        }
    }
    private onRougeOpen(){
        if(this.model.rougeList){
            this.model.fightTypeAdaper.onRougeOpen(this.model.rougeList);
        }
    }
    private onRougeSelect(revc:RougeChoose_revc){
        this.model.fightTypeAdaper.onRougeSelect(revc);
    }
    private clearEvt(){
        this.off(Laya.Event.CLICK,this,this.onBgClickHandler);
        GuideModel.Ins.off(EGuideEvent.GuidePlayEffect,this,this.onGuidePlayEffect);
        this.model.off(ComposeEvent.RougeOpen,this,this.onRougeOpen);
        this.model.off(ComposeEvent.RougeSelect,this,this.onRougeSelect);
        this.model.off(ComposeEvent.PvpRoundStatusChange,this,this.onPvpRoundStatusChange);
        this.model.off(ComposeEvent.IceMap,this,this.onIceMap);
        this.model.off(ComposeEvent.HeroDelByUID,this,this.onHeroDelByUID);
        this.model.off(ComposeEvent.MonsterRemove,this,this.onRemoveMonster);
        this.model.off(ComposeEvent.MonsterNum,this,this.onMonsterNum);
        this.model.off(ComposeEvent.PvproundResult,this,this.onPvproundResult);
        this.model.off(ComposeEvent.WaveSettleReward,this,this.onWaveSettleReward);
        E.EventMgr.off(GameEvent.MonsterScale,this,this.onMonsterScale);
    }

    private onWaveSettleReward(revc:WaveSettleReward_revc){
        let time: number = parseInt(t_Battle_Config.Ins.getValueById(73));
        Laya.timer.once(time, this, this.onWaveSettleRewardLater,[revc]);
    }

    private onWaveSettleRewardLater(revc:WaveSettleReward_revc){
        if(this.isExit){
            return;
        }
        E.ViewMgr.Open(EViewType.PvpRoundReward,null,revc);
    }

    /**PVP回合制状态变化 */
    private onPvpRoundStatusChange() {
       this.model.fightTypeAdaper.onPvpRoundStatusChange();
    }
    onExit(){
        this.isExit = true;
        this.gcTicket = 0;
        Laya.timer.clear(this,this.onGcHandler);
        if(this._doorGuide){
            this._doorGuide.dispose();
            this._doorGuide = null;
        }
        while(this.decList.length){
            let cell = this.decList.shift();
            cell.onExit();
        }
        this.speedScale = 1;
        // Laya.timer.callLater(this,this.onCallLater);
        //=================================================
        this._ownerRemoveMonsterIndex = 0;
        this.artScene.onExit();
        this.openOwnerIce(false,0);
        this.openEnemyIce(false,0);
        this.disposeGridList();
        this.clearEvt();
        while(this.monsterList.length){
            let _monster = this.monsterList.shift();
            _monster.dispose();
        }
        while(this.groundList.length){
            let _cell = this.groundList.shift();
            _cell.dispose();
        }
        this.topDragLayer.clear(``);
        this.model.clearFight();
        // MainModel.Ins.guideInit();
        LogSys.Log("FightMainView onExit...");
        //=================================================
    }
    /**设置播放速度比 */
    set speedScale(v: number) {
        FightValueConfig.speedScale = v;
        this.onPlaybackRate();
    }

    /**技能条 */
    onSkillBar(_l: stSkillBar[]) {
        let gridList = this.gridItemList;

        for (let i = 0; i < _l.length; i++) {
            let vo = _l[i];
            let _monster: ComposeDragGrid = gridList.find(o => o.uid == vo.uid);
            if(_monster){
                if (_monster.animal) {
                    let hero: HeroAvatarView = _monster.animal.getHeroIndex(0);
                    if (hero) {
                        
                        if (hero.heroVo && HeroListProxy.Ins.getCfgById(hero.heroVo.fid).f_magic) {
                            if (!hero.skillBar) {
                                hero.skillBar = FightFactory.createSkillBar(hero);
                            }
                            hero.skillBar.setData(vo);
                        }else{
                            LogSys.Warn(`heroId:${hero.heroVo.fid},该英雄${vo.uid}没有技能条`);
                        }
                    }
                }else{
                    LogSys.Warn(`onSkillBar uid:${vo.uid} anim is not init...`);
                }
            }else{
                LogSys.Warn(`onSkillBar uid:${vo.uid} not find`);
            }
        }
    }
    /**掉血 */
    onSubBlood(_l:stSubBlood[]){
        for(let i = 0;i < _l.length;i++){
            let vo = _l[i];
            //LogSys.Log(`sub:` + JSON.stringify(vo));
            let _monster:TowerAvatarView = this.monsterList.find(o => o.vo.uid == vo.targetUid);
            if (_monster && _monster.isLoaded) {
                if(_monster.bloodView){
                    _monster.bloodView.setSubData = vo;
                }

                if(_monster.bloodTxt){
                    _monster.bloodTxt.setCurValue(_monster.vo.curBlood);
                }

                if (vo.type == ESubBloodType.RecoverBlood) {
                    //回复血量
                } else {
                    if (!this.model.isFork) {
                        if (_monster.coreSpine && _monster.coreSpine.skeleton) {
                            let useTime: number = 0;
                            if (_monster.bloodFlys.length > 0) {
                                useTime = this.subBloodMS * _monster.bloodFlys.length;
                            }
                            FightFactory.createSubBlood(this.subBloodTxtCon, _monster, vo, useTime);
                        }
                    }
                }
            }
        }
    }

    private onBossCreateWave(f_monsterid:number){
        let wave = this.model.curAdapter.wave;
        LogSys.Log("怪物来袭" + wave);
        FightFactory.createBossBannerShow(f_monsterid,wave);
    }

    onCreateMonsterList(list1:stMonsterBirth[]){
        if(initConfig.disable_monster){
            return;
        }

        while(list1.length>0){
            let cell = list1.shift();
            // LogSys.Log("++++++++ monsterId:"+cell.fid);
            this.onCreateMonster(cell);
        }
    }

    /**创建怪物 */
    private onCreateMonster(vo:stMonsterBirth){
        // LogSys.Log(`onCreateMonster 创建怪物:${JSON.stringify(vo)}`);

        let monster: TowerAvatarView = new TowerAvatarView();
        let walk = new stMonsterWalk();
        walk.uid = vo.uid;
        // t_Hero.Ins.getByHeroId(vo.fid).f_heroid
        let cfg = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(vo.fid);
        if(cfg){
            // let tempCfg = t_Monster_Template.Ins.getMonsterTemplate(cfg.f_monster_template_id);  // parseInt(tempCfg.f_10003.split(":")[1]);
            walk.time = this.model.fightTypeAdaper.monsterCfg.getTempSpeed(vo.fid);
            if(vo.index == 0 && cfg.f_monster_type == EMonsterType.Boss){
                Laya.timer.callLater(this,this.onBossCreateWave,[cfg.f_monsterid]);
            }

        }else{
            LogSys.Warn(`t_Monster'f_monsterid ${vo.fid} not found.`);
        }
        
        walk.index = vo.index;
        monster.tmpWalkVo = walk;
        // monster.updateScale(vo.)
        monster.parent = this.monsterLayer;
        monster.vo = vo;
        // monster.owner = this.model.getOwnerType(vo.playerId);
        monster.init();
        this.monsterList.push(monster);
        // this.updateMonsterCount();
        // LogSys.Log(`时钟${this.model.curAdapter.clockTimeMs} 创建怪物 heroId:${vo.fid} uid:${vo.uid}`);
    }

    /**怪物数量更新 */
    updateMonsterCount(){
        // if(this.model.bFightResustShow){
            // if(this.model.fightResultVo){
            //     let old = this.model.ownerMonsterCount;
            //     // LogSys.Log(`old monsterNum: ${}`);
            //     this.model.ownerMonsterCount = this.model.fightResultVo.owner.monsterNum;
            //     LogSys.Log(`old:${old} new monsterNum: ${this.model.ownerMonsterCount} --->${this.model.fightResultVo.owner.monsterNum}/${this.model.fightResultVo.enemy.monsterNum}`);
                
            //     let cnt:number = this.model.fightResultVo.enemy.monsterNum;
            //     if(this.model.fightTypeAdaper.mode == EFightMode.PVE){
            //         cnt = 0;
            //     }
            //     this.composeView.updateMonsterCount(this.model.ownerMonsterCount,cnt);
            // }   
            // return;
        // }
        if(!this.model.ownerPlayer){
            return;
        }
        let _ownerCount:number = 0;
        let _pvpCount:number = 0;
        for(let i = 0;i < this.monsterList.length;i++){
            let _monster = this.monsterList[i];
            let cfg = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(_monster.vo.fid);

            let _newBir:newStMonsterBirth = _monster.vo as newStMonsterBirth;
            let _showAvatar:boolean = false;
            
            if(_newBir.birthTime == undefined){
                LogSys.Error("uid:"+_monster.vo.uid+' brithTime is undefined...');
            }

            let sub: number = _newBir.birthTime - this.model.curAdapter.clockTimeMs;
            if( 
                // _newBir.birthTime == undefined ||//没有出生时间说明是断线重连的怪物,怪物已经出生在场景中移动
                sub <= 0)
            {
                if(cfg.f_monster_type == EMonsterType.Monster){
                    if(_monster.vo.playerId == MainModel.Ins.mRoleData.AccountId){
                        _ownerCount++;
                    }else{
                        _pvpCount++;
                    }
                }
                _showAvatar = true;
            }else{
                // LogSys.Warn(`怪物${_monster.vo.uid} 还需要${Math.abs(sub)}才能出生`);
            }
            _monster.visible = _showAvatar;
        }

        //======================================================
        this.updateMonsterNum(_ownerCount,_pvpCount);
        //======================================================
    }

    private updateMonsterNum(_ownerCount:number,_pvpCount:number){
        // let _ownerCount: number = 0;
        // let _pvpCount: number = 0;
        if (!this.model.curAdapter.isGuide && this.model.monsterNum) {
            //后端怪数实时数量
            let list = this.model.monsterNum.datalist;
            if (this.model.ownerPlayer) {
                let vo = list.find(o => o.playerId == this.model.ownerPlayer.playerId);
                if (vo) {
                    _ownerCount = vo.monsterNum;
                }
            }
            if (this.model.enemyPlayer) {
                let enemy = list.find(o => o.playerId == this.model.enemyPlayer.playerId);
                if (enemy) {
                    _pvpCount = enemy.monsterNum;
                }
            }
        }

        // if (_ownerCount >= this.model.ownerPlayer.maxMonster){
        //     _ownerCount = this.model.ownerPlayer.maxMonster;
        // }
        // if(_pvpCount >= this.model.enemyPlayer.maxMonster){
        //     _pvpCount = this.model.enemyPlayer.maxMonster;
        // }
        // this.model.ownerMonsterCount = _ownerCount;
        this.composeView.updateMonsterCount(_ownerCount,_pvpCount);
    }

    private disposeGridList(){
        while(this._gridItemList.length){
            let cell = this._gridItemList.shift();
            cell.dispose();
        }
    }
    
    heroMove(uid:number,isoX:number,isoY:number){
        this.model.curAdapter.move(uid, isoX, isoY);
        this.clientHeroMove(uid,isoX,isoY);
        this.clearTopDragLayer();
    }
    outSideUpdate(uid: number) {
        let topLayer = this.topDragLayer;
        if (topLayer && topLayer.isInStage) {
            if(!this.model.curAdapter.canSwitchHero){
                let cell = this.model.refreshList.find(o=>o.x == topLayer.endIsoX && o.y == topLayer.endIsoY);
                if(cell){
                    this.topDragLayer.clear("outSideUpdate");
                    return;
                }
            }
                        
            this.heroMove(uid, topLayer.endIsoX, topLayer.endIsoY);
        }
    }

    /**战斗视图中心坐标 */
    getCenterXY() {

        if (!this.displayedInStage) {
            LogSys.Warn(`fightview is not in stage!`);
        }

        if (this.parent) {
            let _tagPos = (this.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.x, this.y));
            // this.centerOffsetY = ComposeConfig.cellH * cfg.f_centerOffsetY;
            let val: number = this.model.fightTypeAdaper.offset_ISO_Y / 2 + this.model.fightTypeAdaper.cfg.f_centerY;
            // cfg.f_centerOffsetY;
            return new Laya.Point(_tagPos.x + ComposeConfig.cellW * 4, _tagPos.y + val * ComposeConfig.cellH);
        }
    }

    /**合成售卖小菜单 */
    private showSellTips(uid:number){
        let vo = this.model.refreshList.find(o=>o.uid == uid);
        if(!vo){
            return;
        }
        let type = EViewType.CompSell;
        if(E.ViewMgr.isOpenReg(type)){
            (E.ViewMgr.Get(type) as ComposeTips).updateView(vo);
        }else{
            E.ViewMgr.Open(type,null,vo);
        }
    }

    openHeroTips(uid: number) {
        // LogSys.Log(`button disable: ${ButtonCtl.disable} uid:${uid}`);
        this.model.event(ComposeEvent.HidePvpRoundTips);
        this.showSellTips(uid);
        //==============================================
        E.ViewMgr.Open(EViewType.TopHeroTips, null, uid);
        this.clearTopDragLayer();
        //==============================================
        this.openCirleYellow(uid);

        E.EventMgr.emit(EventID.ButtonCtlClick, this.gridItemList.find(o => o.data.uid == uid));
    }

    onCenter(){
        this.artScene && this.artScene.onCenter();
    }
}