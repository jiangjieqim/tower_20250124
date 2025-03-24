import { E } from "../../../G";
import { FightChat_revc, stElement, stMonsterBirth, stSubBlood } from "../../../network/protocols/BaseProto";
import { SpineCoreSkel } from "../avatar/spine/SpineCoreSkel";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
import { EAvatarAnim } from "../avatar/vos/EAvatarAnim";
import { ISkillClientEffectCfg } from "../skill/proxy/SkillProxy";
import { t_Function_Card } from "../towertmaincard/proxy/t_Function_Card";
import { TowertMainHeroModel } from "../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../towertmainhero/proxy/HeroProxy";
import { t_Hero_Skin } from "../towertmainhero/proxy/t_Hero_Skin";
import { ComposeConfig } from "./ComposeConfig";
import { ComposeModel } from "./ComposeModel";
import { FightUtils } from "./FightUtils";
import { EHeroQua, EMonsterType } from "./t_Battle_Config";
import { EInnerSoundType, t_Inner_Sound } from "./t_Inner_Sound";
import { t_Monster_Template } from "./t_Monster_Template";
// import { t_Monster, t_Monster_Template } from "./t_Monster_Template";
import { AdmissionShow } from "./views/AdmissionShow";
import { ImageSkinAvatarDecorator } from "./views/avatar/ImageSkinAvatarDecorator";
import { NormalAvatarEffect } from "./views/avatar/NormalAvatarEffect";
import { TowerBaseAvatar } from "./views/avatar/TowerBaseAvatar";
import { BaseAdmissionShow, SlotImgs } from "./views/BaseAdmissionShow";
import { BossBannerShow } from "./views/BossBannerShow";
import { BossBloodTxt } from "./views/BossBloodTxt";
import { BossCutdownView } from "./views/BossCutdownView";
import { BulletView, IBulletView } from "./views/BulletView";
import { BulletViewSpine } from "./views/BulletViewSpine";
import { AvatarEffect } from "./views/cells/AvatarEffect";
import { BloodImg } from "./views/cells/BloodImg";
import { DrawHaloView, IHaloEffect, SpineHaloLoad } from "./views/cells/DrawHaloView";
import { GroundCellView, IAvatarEffectData } from "./views/cells/GroundCellView";
import { NumRed } from "./views/cells/NumRed";
import { SkillBarView } from "./views/cells/SkillBarView";
import { SkillEffect } from "./views/cells/SkillEffect";
import { ComposeDragGrid } from "./views/ComposeDragGrid";
import { DizzySkill } from "./views/DizzySkill";
import { ChatPopView, IChatPopView } from "./views/FaceChatView";
import { FrameMonster } from "./views/FrameAvatar";
// import { FrameMonsterAnim } from "./views/FrameMonsterAnim";
import { HeroAvatarView } from "./views/HeroAvatarView";
import { IceSkill } from "./views/IceSkill";
import { LabelFly } from "./views/LabelFly";
import { NormalBeHit } from "./views/NormalBeHit";
import { PVECardShow } from "./views/PVECardShow";
import { PVEDestoryCard } from "./views/PVEDestoryCard";
import { SubBloodFly } from "./views/SubBloodFly";
import { TowerAvatarView } from "./views/TowerAvatarView";
import { AnimFrameVo, ENameType } from "./vos/AnimFrameVo";
import { ECreateHero, EFightLayer } from "./vos/EFightEnum";
import { EFuncCardId } from "./vos/EFuncCardId";
import { EMonsterPos, FightValueConfig } from "./vos/FightValueConfig";
import { IFightMainView } from "./vos/IFightMainView";
import { t_Battle_Effect } from "./vos/t_Battle_Effect";

export enum EResKey{
    Outside = "outside",//局外路径
    Fight = "fight"     ,//局内路径
    OutBigSide = "outbigside",//局外路径
}

enum EFrameExportType{
    UI = 1,
    Spine = 2,
}
interface IFrameAnim{
    len:number;
    anim:number;
    // nametype:number;
}
export class FightFactory {

    private static _atlasAnimMap = {};
    private static _animAnimMap = {};
    // private static _heroMap = {};
    /**英雄资源 */
    // private static loadByHeroId(coreSpine:ITowerMonster,heroId:number,resKey:string){
    // }

    /**创建默认的序列帧动画 */
    static createDefaultFrame(url:string,_scale:number = 1,that?,onSpine1Complete?:Function){
        let _frameAvatr = new FrameMonster();
        // _frameAvatr.defaultFrame = true;
        _frameAvatr.curScale = _scale;
        _frameAvatr.once(Laya.Event.COMPLETE, that,onSpine1Complete);
        _frameAvatr.load(url);
        return _frameAvatr;
    }
    private static get model(){
        return ComposeModel.Ins;
    }
    /**创建序列帧怪物 */
    static createFrameMonster(monsterId:number,that,onSpine1Complete:Function,_scale:number = 1,tempId:number = 0){
        let coreSpine = new FrameMonster();
        let tempCfg:Configs.t_Monster_Template_dat;
        if (!this.model.fightTypeAdaper) {
            tempCfg = t_Monster_Template.Ins.GetDataById(1);
            LogSys.Warn(`fightTypeAdaper is null createFrameMonster default.`);
        } else {
            tempCfg = this.model.fightTypeAdaper.monsterCfg.getTempCfg(monsterId);
            if (tempId) {
                tempCfg = t_Monster_Template.Ins.getMonsterTemplate(tempId);
            }
        }
        this.refreshMonster(coreSpine,tempCfg,_scale,that,onSpine1Complete);
        // coreSpine.anchorX = coreSpine.anchorY = 0;
        // coreSpine.curScale = _scale;
        // coreSpine.play(EAvatarAnim.MonsterMove, undefined, undefined, undefined, undefined, undefined, true);
        // coreSpine.once(Laya.Event.COMPLETE, that,onSpine1Complete);
        // this.loadByMonsterId(coreSpine, monsterId);
        // coreSpine.framestr = tempCfg.f_frame;
        // let url:string = this.convertFrameImageURL(tempCfg);//`res/atlas/avatar/${tempCfg.f_imageid}`;
        // coreSpine.load(url);
        return coreSpine;
    }

    private static refreshMonster(coreSpine:FrameMonster,tempCfg:Configs.t_Monster_Template_dat,_scale:number,that,onSpine1Complete:Function){
        coreSpine.framestr = tempCfg.f_frame;
        if(tempCfg.f_frame_number){
            coreSpine.delayMs = 1000/tempCfg.f_frame_number;
        }
        let type:EFrameExportType =  this.getExportType(tempCfg);//`res/atlas/avatar/${imgageId}`;

        let url:string = "";
        switch(type){
            case EFrameExportType.UI:
                url = `res/atlas/avatar/${tempCfg.f_imageid}`;
                break;

            case EFrameExportType.Spine:
                url = `res/atlas/hero/${tempCfg.f_imageid}`;
                coreSpine.anchorX = 0;
                coreSpine.anchorY = 0;
                break;
        }
        
        coreSpine.curScale = _scale;
        coreSpine.play(EAvatarAnim.MonsterMove, undefined, undefined, undefined, undefined, undefined, true);
        coreSpine.once(Laya.Event.COMPLETE, that,onSpine1Complete);
        coreSpine.load(url);
    }

    /**创建战斗中的怪物 */
    static createFrameByMonsterBirth(vo:stMonsterBirth,that,onSpine1Complete:Function,_scale:number = 1){
        let coreSpine = new FrameMonster();
        coreSpine.mRandomIndex = true;//随机启动动画索引号
        let tempCfg:Configs.t_Monster_Template_dat;
        if(vo.skinId){
            tempCfg = t_Monster_Template.Ins.getMonsterTemplate(vo.skinId);
        }else{
            let cfg:Configs.t_Monster_dat = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(vo.fid);//GetDataById(vo.fid);
            if(cfg){
                tempCfg = this.model.fightTypeAdaper.monsterCfg.getTempCfg(cfg.f_monsterid);
            }else{
                LogSys.Error(`not exist monsterId:${vo.fid}`);
            }
        }
       
        if(!tempCfg){
            tempCfg = t_Monster_Template.Ins.getMonsterTemplate(1);
            E.debugMsgBox(`不存在f_monster_template_id:${JSON.stringify(vo)}`);
        }

        // (coreSpine as FrameMonster).framestr = tempCfg.f_frame;
        // let imgageId = `${tempCfg.f_imageid}`;
        this.refreshMonster(coreSpine,tempCfg,_scale,that,onSpine1Complete);
        return coreSpine;
    }

    /**获取导出的序列帧路径 */
    private static getExportType(tempCfg:Configs.t_Monster_Template_dat){
        let imageId = `${tempCfg.f_imageid}`;
        let str = E.getLang("SpineFrame");
        if (!StringUtil.IsNullOrEmpty(str)) {
            //局内战斗用序列帧
            let arr = str.split("|");
            if (arr.indexOf(imageId.toString()) != -1) {
                // return `res/atlas/hero/${imageId}`
                return EFrameExportType.Spine;
            }
        }
        return EFrameExportType.UI;
        // return `res/atlas/avatar/${imageId}`;
    }
    
    /**创建序列帧的英雄 */
    static createFrameHero(imageId:number,that,onSpine1Complete:Function,_scale:number = 1){
        let coreSpine = new FrameMonster();
        // coreSpine.delayMs = parseInt(E.getLang("HeroMs"));
        coreSpine.anchorX = 0;
        coreSpine.anchorY = 0;
        coreSpine.curScale = _scale;
        // coreSpine.frameType = EFrameType.Normal;
        coreSpine.play(EAvatarAnim.MonsterMove, undefined, undefined, undefined, undefined, undefined, true);
        coreSpine.once(Laya.Event.COMPLETE, that, onSpine1Complete,[coreSpine]);
        coreSpine.load(`res/atlas/hero/${imageId}`);
        return coreSpine;
        
        /*
        
        let coreSpine = new FrameMonster();
        coreSpine.play(EAvatarAnim.MonsterMove, undefined, undefined, undefined, undefined, undefined, true);
        coreSpine.once(Laya.Event.COMPLETE, that, onSpine1Complete);

        let imgageId: number = 1;
        coreSpine.frameList = this.createAnimFrame("5|10|15");
        coreSpine.load(`res/atlas/hero/${imgageId}`);
        return coreSpine;
        */
        
    }
    /**创建英雄 */
    static createHero(f_heroid:number,resKey:string,defaultScale:number,defaultAnim:number,that,onSpine1Complete:Function,type:ECreateHero){   
        let str = E.getLang("SpineFrame");
        let imageId:number;
        if(type == ECreateHero.HeroId){
            imageId = TowertMainHeroModel.Ins.getImageIdById(f_heroid);
        }else if(type == ECreateHero.ImageId){
            imageId = f_heroid;
        }
        // imageId = TowertMainHeroModel.Ins.getImageIdById(f_heroid);
        if((Laya.Utils.getQueryString("res_id"))){
            imageId = parseInt(Laya.Utils.getQueryString("res_id"));
        }

        if(initConfig.debug_hero_imageid){
            imageId = initConfig.debug_hero_imageid;
        }

        if (resKey == EResKey.Fight && !StringUtil.IsNullOrEmpty(str)) {
            //局内战斗用序列帧
            // imageId = TowertMainHeroModel.Ins.getImageIdById(f_heroid);
            let arr = str.split("|");
            if (arr.indexOf(imageId.toString()) != -1) {
                return this.createFrameHero(imageId, that, onSpine1Complete, defaultScale);
            }
        }

        let coreSpine = new SpineCoreSkel();
        coreSpine.curScale = defaultScale;
        coreSpine.anim = defaultAnim;
        coreSpine.once(Laya.Event.COMPLETE,that,onSpine1Complete);
        // this.loadByHeroId(coreSpine,f_heroid,resKey);
        coreSpine.load(`o/spine/${resKey}/${imageId}/${imageId}.skel`);
        return coreSpine;
    }

    /**创建英雄Avatar */
    static createHeroAvatar(
        heroId: number,
        parent: Laya.Sprite, 
        offsetX: number = 0,offsetY: number = 0,
        index:number = 0,heroVo?:stElement,haloLayer?:Laya.Sprite,resKey:string = EResKey.Fight,
        defaultAnim:EAvatarAnim = EAvatarAnim.TowerIdle,scale:number = 1.0,chindIndex:number = -1) 
    {
        let _monster =  new HeroAvatarView();
        _monster.chindIndex = chindIndex;
        _monster.defaultAnim = defaultAnim;
        _monster.defaultScale = scale;
        _monster.resKey = resKey;
        _monster.haloLayer = haloLayer;
        _monster.index = index;
        _monster.heroVo = heroVo;
        _monster.offsetX = offsetX;
        _monster.offsetY = offsetY;
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        if(!cfg){
            LogSys.Error(`t_Hero f_heroid=================>${heroId} not found`);
        }
        _monster.resId = cfg.f_heroid;
        _monster.parent = parent;
        _monster.init();
        return _monster;
    }

    /**场景中的创建英雄Avatar */

    // offsetX: number = 0,offsetY: number = 0,
    // index:number = 0,heroVo?:stElement,haloLayer?:Laya.Sprite,resKey:string = EResKey.Fight,
    // defaultAnim:EAvatarAnim = EAvatarAnim.TowerIdle,scale:number = 1.0,chindIndex:number = -1

    static createFightHeroAvatar(
        heroId: number,
        parent: Laya.Sprite,offsetX: number = 0,offsetY: number = 0,index:number = 0,heroVo:stElement,haloLayer:Laya.Sprite) 
    {
        let _monster =  new HeroAvatarView();
        _monster.chindIndex = -1;
        _monster.defaultAnim =  EAvatarAnim.TowerIdle;
        _monster.defaultScale = 1;
        _monster.resKey = EResKey.Fight;
        _monster.haloLayer = haloLayer;
        _monster.index = index;
        _monster.heroVo = heroVo;
        _monster.offsetX = offsetX;
        _monster.offsetY = offsetY;
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        if(!cfg){
            LogSys.Error(`t_Hero f_heroid=================>${heroId} not found`);
        }
        _monster.resType = ECreateHero.ImageId;

        let imageId = this.getImageId(heroVo);
        _monster.resId = imageId;
        _monster.parent = parent;
        _monster.init();
        return _monster;
    }

    static getImageId(vo:stElement){
        let imageId:number = 0;
        if(!vo.skinId){
            imageId = TowertMainHeroModel.Ins.getDefImageIdById(vo.fid);
        }else{
            imageId = t_Hero_Skin.Ins.getCfgById(vo.skinId).f_imageid;
        }
        return imageId;
    }
    private static convertResKey(heroId: number){
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        let resKey:EResKey = EResKey.Outside;
        if(cfg.f_qua == EHeroQua.Red){
            resKey = EResKey.Fight;
        }
        return resKey;
    }
    /**图鉴大英雄 */
    static createBigHeroAvatar(heroId: number,parent: Laya.Sprite, offsetX: number = 0,offsetY: number = 0){
        let _curScale:number = HeroListProxy.Ins.getScaleById(heroId);
        let imageId = TowertMainHeroModel.Ins.getImageIdById(heroId);
        // let resKey = this.convertResKey(heroId);
        return this.createByImageId(imageId,parent,offsetX,offsetY,_curScale);
    }

    /**根据image创建 */
    static createByImageId(imageId: number, parent: Laya.Sprite, offsetX: number = 0, offsetY: number = 0, scale: number = 1,resKey:EResKey = EResKey.Outside) {
        let avatar: HeroAvatarView = new HeroAvatarView();
        avatar.parent = parent;
        avatar.resKey = resKey;
        avatar.defaultAnim = EAvatarAnim.TowerIdle;
        avatar.offsetX = offsetX;
        avatar.offsetY = offsetY
        avatar.defaultScale = scale;
        let decorator = new ImageSkinAvatarDecorator(avatar,imageId);
        avatar = decorator.avatar;
        avatar.init();
        return avatar;
    }

    /**根据vo创建avatar */
    static createByStElement(vo:stElement,parent: Laya.Sprite, offsetX: number = 0, offsetY: number = 0){
        let imageId:number = this.getImageId(vo);
        let resKey = this.convertResKey(vo.fid);
        let avatar = this.createByImageId(imageId,parent,offsetX,offsetY,undefined,resKey);
        return avatar;
    }

    /**创建飘动的血字 */
    static createSubBlood(subCon:Laya.Sprite,target:TowerAvatarView,vo: stSubBlood,delayTime:number = 0){
        if(initConfig.disableBloodTxt){
            return;
        }
        let _bloodFly:SubBloodFly = new SubBloodFly();
        target.bloodFlys.push(_bloodFly);
        _bloodFly.delayTime = delayTime;
        _bloodFly.subCon = subCon;
        _bloodFly.target = target;
        _bloodFly.vo = vo;
        _bloodFly.play();
    }

    /**添加血条*/
    static createBloodImg(monster: TowerAvatarView) {
        let blood = new BloodImg();
        blood.monster = monster;
        let val: number = 1;
        let monsterType = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(monster.vo.fid).f_monster_type;
        if (monsterType == EMonsterType.Boss || monsterType == EMonsterType.LimitTimeBoss) {
            val = FightValueConfig.MonsterBloodScale;
        }
        blood.mScale = val;
        blood.maxValue = monster.vo.blood;
        blood.curParent = ComposeModel.Ins.fightView.getLayer(EFightLayer.BLOOD);
        let per = monster.vo.curBlood/monster.vo.blood;
        //LogSys.Log(`${monster.vo.uid}:当前百分比${per}`);
        blood.init(per);
        return blood;
    }

    /**添加倒计时 */
    static createCutdownTime(monster:TowerAvatarView){
        let bossTime:BossCutdownView = new BossCutdownView();
        bossTime.curParent  = ComposeModel.Ins.fightView.getLayer(EFightLayer.BLOOD);
        bossTime.monster = monster;
        bossTime.init();
        return bossTime;
    }
    /**创建技能条 */
    static createSkillBar(hero: HeroAvatarView) {
        let _skillBar: SkillBarView = new SkillBarView();
        _skillBar.monster = hero;
        _skillBar.curParent = ComposeModel.Ins.fightView.getLayer(EFightLayer.SkillBarLayer);
        _skillBar.init(0);
        return _skillBar;
    }

    /**创建脚底光圈 */
    static createHalo(hero_id:number){
        let cfg = HeroListProxy.Ins.getCfgById(hero_id);
        let qua:EHeroQua = cfg.f_qua;
        let _halo:IHaloEffect;
        if(qua >= EHeroQua.Orange){
            _halo = new SpineHaloLoad();
        }else{
            _halo= new DrawHaloView();
        }
        _halo.qua = qua;
        return _halo;
    }

    /**
     * 创建一个飞行的字
     */
    static createFlyLabel(str:string,container:Laya.Sprite){
        let lb = Laya.Pool.getItemByClass(LabelFly.CLS_KEY,LabelFly);
        lb.fly(container,str);
    }

    /**创建一个数字红点 */
    static createNumRed(container: Laya.Sprite, offsetX: number = 0, offsetY: number = 0,pool:boolean = false) {
        let dotNum:NumRed = pool ? Laya.Pool.getItemByClass(NumRed.CLS_KEY, NumRed) : new NumRed();
        container.addChild(dotNum);
        dotNum.x = offsetX;
        dotNum.y = offsetY;
        return dotNum;
    }

    /**为指定对象挂在一个冰块特效 */
    static createIceSkill(target:TowerAvatarView,ms:number,_scale:number){
        let skill = new IceSkill();
        skill.setTarget(target,ms,_scale);
    }

    /**为指定对象挂载一个晕眩特效 */
    static createDizzySkill(target:TowerAvatarView,ms:number,_scale:number){
        let skill = new DizzySkill();
        skill.setTarget(target,ms,_scale);
    }

    /**普通受击特效 */
    static createNormalHit(target: TowerAvatarView) {
        if(initConfig.disableNormalHit){
            return;
        }
        let skill = new NormalBeHit();
        skill.setTarget(target);
    }

    /**创建神话英雄 */
    static createAdmission(heroVo: stElement) {
        if (AdmissionShow.isPlay) {
            AdmissionShow.heroVoList.push(heroVo);
        } else {
            AdmissionShow.isPlay = true;
            let _admission = new AdmissionShow();
            _admission.url = `o/spine/succeed/Admission/Admission.skel`;
            _admission.heroVo = heroVo;
            _admission.load();
        }
    }
    private static _boss:BossBannerShow;
    /**Boss来袭横幅 */
    static createBossBannerShow(monsterId:number,wave:number){
        if(!this._boss){
            let _boss = new BossBannerShow();
            this._boss = _boss;
        }
        this._boss.url = `o/spine/succeed/Boss/Boss.skel`;
        this._boss.monsterId = monsterId;
        this._boss.wave = wave;
        this._boss.load();
        t_Inner_Sound.Ins.play(EInnerSoundType.BossComing);
    }
    /**pve获得卡牌 */
    static createPveShowCard(cardId: number,layer:Laya.Sprite,ox:number = 0,oy:number = 0,showHandler?:Laya.Handler,endHandler?:Laya.Handler) {
        let _pveShow = new PVECardShow();
        _pveShow.cardId = cardId;
        _pveShow.layer = layer;
        _pveShow.url = `o/spine/scene/Card_get/Card_get.skel`;
        _pveShow.pos.x = ox;
        _pveShow.pos.y = oy;
        _pveShow.load();
        _pveShow.showHandler = showHandler;
        _pveShow.endHandler = endHandler;
        return _pveShow;
    }
    /**pve卡牌销毁 */
    static createPveDestoryCard(cardId: number) {
        let _pveShow = new PVEDestoryCard();
        _pveShow.cardId = cardId;
        _pveShow.url = `o/spine/scene/Card_fire/Card_fire.skel`;
        _pveShow.load();
        return _pveShow;
    }
    /**
     * 失效特效
     */
    static createDiscardEffect(cardId: number) {
        let eff = new BaseAdmissionShow();
        let cfg = t_Function_Card.Ins.getCfgById(cardId);
        eff.slots.push(new SlotImgs("Card_back_1", t_Function_Card.Ins.getQuaSkin(cfg.f_qua)));
        eff.slots.push(new SlotImgs("Card_back",t_Function_Card.Ins.getIconById(cfg.f_card_imageid)));

        let discardCfg = t_Function_Card.Ins.getCfgById(EFuncCardId.Discard);
        let effcetCfg: Configs.t_Battle_Effect_dat = t_Battle_Effect.Ins.getByEffectId(discardCfg.f_effect_id);
        if (effcetCfg) {
            let k = effcetCfg.f_effect_name;
            let url = `${effcetCfg.f_spine_path}/${k}/${k}.skel`;
            eff.url = url;
            eff.load();
        }
    }

    /**集钱的钱 */
    static createGetMoney(cardId:number,effect_id:number,layer:Laya.Sprite,x:number,y:number){
        LogSys.Log(`createGetMoney ${cardId} ${effect_id} ${x} ${y}...`);
        let eff = new BaseAdmissionShow();
        eff.layer = layer;
        eff.pos = new Laya.Point(x,y);
        let cfg = t_Function_Card.Ins.getCfgById(cardId);
        eff.slots.push(new SlotImgs("Card_back_1", t_Function_Card.Ins.getQuaSkin(cfg.f_qua)));
        eff.slots.push(new SlotImgs("Card_back",t_Function_Card.Ins.getIconById(cfg.f_card_imageid)));
        // let discardCfg = t_Function_Card.Ins.getCfgById(EFuncCardId.Discard);
        let effcetCfg: Configs.t_Battle_Effect_dat = t_Battle_Effect.Ins.getByEffectId(effect_id);
        if (effcetCfg) {
            let k = effcetCfg.f_effect_name;
            let url = `${effcetCfg.f_spine_path}/${k}/${k}.skel`;
            eff.url = url;
            eff.load();
        }
    }

    /**血量字 */
    static createFontTxt(monster:TowerAvatarView){
        let  bloodTxt = new BossBloodTxt();
        bloodTxt.curParent =  ComposeModel.Ins.fightView.getLayer(EFightLayer.BLOOD);
        bloodTxt.setCurValue(monster.vo.curBlood);
        bloodTxt.monster = monster;
        bloodTxt.init();
        return bloodTxt;
    }

    private static getAnim(o:string,nametype:ENameType) :IFrameAnim{
        if (nametype == ENameType.ID_AINM_FRAME) {
             
            //let cell = frames[o];
            let arr = o.split("_");
            //let s = arr[arr.length - 1];
            let anim = parseInt(arr[0].split("-")[1]);
            let out:IFrameAnim = {} as IFrameAnim;
            out.len = arr[1].replace(".png","").length;
            out.anim = anim;
            // out.nametype = ENameType.ID_AINM_FRAME;
            return out;
        }
        else if(nametype == ENameType.ANIM_FRAME) {

            //0_00.png
            //let cell = frames[o];
            let arr = o.split("_");
            // let anim = parseInt(arr[0].split("-")[1]);
            let anim = parseInt(arr[0]);
            let out:IFrameAnim = {} as IFrameAnim;
            out.anim = anim;
            out.len = arr[1].replace(".png","").length;
            return out;
        }
    }

    private static getNameType(cur){
        let frames = cur.frames;
        for (let o in frames) {
            let n = o.match(new RegExp(`([\\s\\S]*?)-([\\s\\S]*?)_([\\s\\S]*?).png`, "g"));
            if (n && n.length > 0) {
                // 0_00.png
                return ENameType.ID_AINM_FRAME;
            }
            n = o.match(new RegExp(`([\\s\\S]*?)_([\\s\\S]*?).png`, "g"));
            if (n && n.length > 0) {
                // "15-0_0.png"
                return  ENameType.ANIM_FRAME;
            }
            n = o.match(new RegExp(`([\\s\\S]*?).png`, "g"));
            if (n && n.length > 0) {
                // 1.png
                return ENameType.ANIM;
            }
        }
    }

    private static getAnimVo(url: string) {
        if (this._atlasAnimMap[url]) {
            return this._atlasAnimMap[url];
        }
        let cur = Laya.loader.getRes(url);
        if(!cur){
            return [];
        }

        let _resultList: AnimFrameVo[] = [];

        let frames = cur.frames;
        let nametype:ENameType = this.getNameType(cur);
        let arr1 = url.split("/");
        let basename = arr1[arr1.length - 1].split(".")[0];
        let prefix = arr1[arr1.length - 2] + "/" + basename;

        if(nametype == ENameType.ANIM){
            let n: number = 0;
            for (let a in cur.frames) {
                n++;
            }
            let _frameVo = new AnimFrameVo();
            _frameVo.start = 1;
            _frameVo.count = n;
            _frameVo.nametype = nametype;
            _frameVo.basename = basename;
            _frameVo.prefix = prefix;
            _resultList.push(_frameVo);
        }else{
            for (let o in frames) {
                let out = this.getAnim(o,nametype);
                let start: number = 0;
                if (!_resultList[out.anim]) {
                    let _animFrame = new AnimFrameVo();
                    _animFrame.frameNameLen = out.len;
                    _animFrame.nametype = nametype;
                    _animFrame.basename = basename;
                    _animFrame.prefix = prefix;
                    _animFrame.count = 0;
                    let pre = _resultList[_resultList.length-1];
                    if(pre){
                        start += pre.start + pre.count;
                    }
                    _animFrame.start = start;
                    _resultList.push(_animFrame);
                }
                let curVo = _resultList[out.anim];
                if(curVo){
                    curVo.count++;
                }else{
                    LogSys.Error(`anim:${out.anim} len:${_resultList.length}`);
                }
            }
        }

        this._atlasAnimMap[url] = _resultList;
        return _resultList;
    }

    /*
       解析序列帧数据 
       9|19

       1-9
       10-19
    */
    private static createAnimFrameByCfg(url: string, str: string) {
        if (this._animAnimMap[url]) {
            return this._animAnimMap[url];
        }

        let arr1 = url.split("/");
        let basename = arr1[arr1.length - 1].split(".")[0];
        let prefix = arr1[arr1.length - 2] + "/" + basename;

        let _list1: AnimFrameVo[] = [];
        let arr = str.split("|");
        for (let i = 0; i < arr.length; i++) {
            let cur: number = parseInt(arr[i]);
            let start: number = 1;
            if (_list1.length > 0) {
                let o = _list1[_list1.length - 1];
                start = o.start + o.count;
            }
            let cell = new AnimFrameVo();
            cell.start = start;
            cell.count = cur - start + 1;
            cell.nametype = ENameType.ANIM;
            cell.basename = basename;
            cell.prefix = prefix;
            _list1.push(cell);
        }
        this._animAnimMap[url] = _list1;
        return _list1;
    }

    static getFrameVo(_curURL:string,framestr:string){
        let _list:AnimFrameVo[];
        let atlas:string = `${_curURL}.atlas`
        if(!StringUtil.IsNullOrEmpty(framestr)){
            _list = this.createAnimFrameByCfg(atlas,framestr);
        }else{
            _list = this.getAnimVo(atlas);
        }
        return _list;
    }

    /**地板层特效 */
    static createGroundEffect(cardUID:number,ox: number, oy: number, playerId: number, url: string,layer:EFightLayer){
        let cell = new GroundCellView();
        cell.cardUID = cardUID;
        cell.url = url;
        // cell.type = ESceneEffectType.Ground;
        cell.ox = ox;
        cell.oy = oy;
        cell.playerId = playerId;
        cell.layer = layer;
        // cell.parent = ComposeModel.Ins.fightView.getLayer(layer);//EFightLayer.Ground
        cell.load();
        return cell;
    }

    /**角色,怪物前层卡牌特效 */
    static createAvatarEffect(avatar:TowerAvatarView,_data:IAvatarEffectData){
        let cell = new AvatarEffect();
        cell.data = _data;
        cell.avatar = avatar;
        cell.parent = ComposeModel.Ins.fightView.getLayer(EFightLayer.HitMonsterLayer);
        cell.load();
        return cell;
    }
    /**角色,怪物前层经典特效 */
    static createAvatarEasyEffect(avatar:TowerBaseAvatar,url:string,ox:number = 0,oy:number = 0){
        // let _data:IAvatarEffectData = {} as IAvatarEffectData;
        // type:EEffectTarget
        // _data.url = url;
        // _data.type = type;
        // _data.offsetX = ox;
        // _data.offsetY = oy;
        // let cell = new AvatarEffect();
        // cell.data = _data;
        // cell.avatar = avatar;
        // cell.parent = ComposeModel.Ins.fightView.getLayer(EFightLayer.HitMonsterLayer);
        // cell.load();
        // return cell;

        let cell = new NormalAvatarEffect();
        cell.avatar = avatar;
        cell.resURL = url;
        cell.offsetX = ox;
        cell.offsetY = oy;
        cell.parent = ComposeModel.Ins.fightView.getLayer(EFightLayer.HitMonsterLayer);
        cell.load();
        avatar.effectList.push(cell);
        return cell;
    }

    /**在区块格子上播放一个特效 */
    static playEffectOnGrid(uid: number, url: string) {
        let model: ComposeModel = ComposeModel.Ins;
        let fightView = model.fightView;
        if (fightView) {
            let grid: ComposeDragGrid = fightView.gridItemList.find(o => o.uid == uid);
            if (grid) {
                let container = fightView.getLayer(EFightLayer.HitMonsterLayer);
                let _data = grid.data;
                let sx = FightUtils.IsoxToPosX(_data.x) + ComposeConfig.cellW;
                let sy = FightUtils.IsoyToPosY(_data.y, _data.playerId == model.ownerPlayer.playerId ? EMonsterPos.Owner : EMonsterPos.OtherPlayer) + ComposeConfig.cellH;
                SpineEffectMgr.playOnce(url, container, sx, sy);
            }
        }
    }

    /**聊天气泡 */
    static createChatPop(_data:FightChat_revc):IChatPopView{
        let _view:IChatPopView = Laya.Pool.getItemByClass(ChatPopView.clsKey, ChatPopView);
        _view.setData(_data);
        return _view;
    }

    /**创建子弹 */
    static createBullet(_skillCfg:ISkillClientEffectCfg):IBulletView{
        if(initConfig.disableBullet){
            return;
        }
        let bullet:IBulletView;
        // if(Laya.Utils.getQueryString("spinebullet")){
        //     bullet = new BulletViewSpine();
        //     bullet.resId = parseInt(Laya.Utils.getQueryString("spinebullet"));
        //     return bullet;
        // }
        if(_skillCfg.f_bullet_pic){
            bullet = new BulletView();
            bullet.resId = _skillCfg.f_bullet_pic;
        }
        else if(_skillCfg.f_bullet_spine){
            bullet = new BulletViewSpine();
            bullet.resId = _skillCfg.f_bullet_spine;
        }
        return bullet;

    }
    /**创建受击特效 */
    static createHitSkill(
        f_hit_animation:number,
        f_hit_animation_scale:number,
        sx:number,sy:number,rot:number = 0)
    {
        if(initConfig.disableHitSkill){
            return;
        }
        let fightView:IFightMainView = ComposeModel.Ins.fightView;
        if(fightView){
            let beHit: SkillEffect = new SkillEffect();
            let layer = fightView.getLayer(EFightLayer.HitMonsterLayer);
            beHit.load(layer, f_hit_animation, sx, sy, f_hit_animation_scale, rot);
        }
    }
}