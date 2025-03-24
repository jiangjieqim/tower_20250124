// import { DebugUtil } from "../../../../frame/util/DebugUtil";
import { IAnimAdapter } from "../../../adapter/AnimAdapter";
import { E } from "../../../G";
import { stSkin } from "../../../network/protocols/BaseProto";
import { ResPath } from "../../../resouce/ResPath";
import { War3Config } from "../main/ctl/War3Config";
import { AvatarBloodSpine } from "./AvatarBloodSpine";
import { AvatarConfig } from "./AvatarConfig";
import { AvatarEvent } from "./AvatarEvent";
import { AvatarFactory } from "./AvatarFactory";
import { IAvatarBaseCtl } from "./ctl/AnimShowCtl";
import { IAvatarView } from "./IAvatarView";
import { SimpleEffect } from "./SimpleEffect";
import { FightPureAnim } from "./spine/FightPureAnim";
import { SpineCoreSkel } from "./spine/SpineCoreSkel";
import { AtlasParser, IMSpineRegions } from "./SpineSwitchSkin";
import { EAvatarAnim } from "./vos/EAvatarAnim";
/**
 * 方向
 */
export enum EAvatarDir{
    Left = 1,
    Right = -1,
}
export enum EBloodParent{
    /**是否是自身的父对象 */
    Self = 1,
	/**Avatar的父对象*/
    Parent = 2
}
/**
0_受击特效
1_受暴击特效
2_回血特效
3_吸血特效
4_普通伤害数字飘字
5_暴击伤害数字飘字
6_回血数字飘字
7_吸血数字飘字
8_暴击飘字
9_反击飘字
10_连击飘字
11_闪避飘字
12_击晕飘字

 */
export enum EAvatarEffectAnim{
    NormalAtk = 0,// 受到普通攻击特效
    
    CsAtk = 1,//暴击特效 

    HuiFuBlood = 2,//角色血量回复

    AddBlood = 3,//吸血特效
    NormalBloodTxt = 4,//4_普通伤害数字飘字(-)
    
    CsBloodTxt = 5,  //5_暴击伤害数字飘字
    
    HuiFuBloodTxt = 6,//血量回复飘字
    
    SuckBloodTxt = 7,//7_吸血数字飘字

    /**暴击飘字*/
    Cs = 8,
    
    /** 反击飘字*/    
    StrikeBackTxt = 9,

    Lianji = 10,//连击飘字
    Dodge = 11,//闪避

    JiYunTxt = 12,//击晕

    //13 利器 14钝器 15治疗 16增益 17减益 18复活

    /**增益 */
    AddEffect = 16,
    /* 17减益*/
    SubEffect = 17,
    
    /**格挡动画 */
    ShoveAside = 20,
    /**空动画 */
    Empty = 21,
}

export enum ESkillActionAnim{
    NormalAtk = 0,//普通攻击特效
    CsAtk = 1,//暴击攻击特效
    /** 眩晕特效*/
    Vertigo = 2,
}


export enum EAttackType{
    /**普通战斗(戳爆模式的近战动作) */
    ThreeKingdomNormal = -1,
    /**近战 */
    War3NEAR = 0,
    /**远程 */
    War3REMOTE = 1
}

export class AvatarView extends Laya.Sprite implements IAvatarView{
    equipList;
    /**动作适配器 */
    animAdapter:IAnimAdapter;
    set mSkin(v:stSkin){

    }
    get mSkin(){
        return;
    }
    /**光环特效 */
    private _haloContainer:Laya.Sprite;
    private _haloEffect:SimpleEffect;
    /**光环id*/
    haloId:number = 0;
    /**主要形象id 此字段有值的时候代表全骨骼换装,魔兽的方式*/
    imageID:number = 0;
    /**战旗帜image */
    private _flagImg:Laya.Image;
    /**战旗id */
    flagId:number = 0;
    // private flagParent:Laya.Sprite;
    // private flagPos:Laya.Point = new Laya.Point();
    private localPos:Laya.Point = new Laya.Point();
    //=================================================
    bloodParentType:EBloodParent = EBloodParent.Parent;
    // cacheUse:boolean;
    private _curDir:EAvatarDir;
    /**是否在移动中 */
    isMoving:boolean = false;
    // private fightEffect:FightPureAnim;
    // buffer:AvatarBuffer = new AvatarBuffer();
    private _ctlList:IAvatarBaseCtl[] = [];    
    private _skelUrl:string;
    public isBoss:boolean = false;
    public die:boolean = false;//是否已经死亡

    public blood:AvatarBloodSpine;//血条管理器
    public rideId:number = 0;//坐骑id
    public wingId:number = 0;//翅膀id
    public useFightSkin:boolean = false;//是否填充战斗中需要的资源
    public offsetX:number = 0;
    public offsetY:number = 0;
    // public index:number;
    public main:IMSpineRegions[];//主骨骼
    public baseImg:string;
    public vo;
    /**当前的站立坐标位置 从1开始,不一定等于this.vo.pos的初始化坐标*/
    public standPos:number;
    // public posVal:number;
    // public spine:BaseSpineAvatar;
    public coreSpine:SpineCoreSkel;
    // protected get curTemplet():SpineTemplet_3_8_v1{
    //     return this.spine.templet;
    // }
    private _tf:Laya.Label;

    public debugTxt(v:string,y:number = 0){
        if(!this._tf){
            this._tf = new Laya.Label();
            this._tf.wordWrap = true;
            this._tf.width = 135;
            this._tf.height = 600;
            this._tf.fontSize = 24;
            this.addChild(this._tf);
        }
        this._tf.text = v;
        this._tf.y = y;
    }

    // protected fashion:FashionModel;
    
    private _showBlood:boolean = false;//是否显示血条
    private _moveTween:Laya.Tween;
    private _moveHandler:Laya.Handler;
    
    // private effect:SimpleEffect;
    // private csEffect:FightPureAnim;//动作特效1
    // private csEffect2:FightPureAnim;//动作特效2

    private _allEffect:FightPureAnim[] = [];
    /**动作总时间(秒) */
    public get duration(){
        // if(this.spine){
        //     return this.spine.duration;
        // }
        if(this.coreSpine){
            return this.coreSpine.duration;
        }
        return 0;
    }

    /**spine骨骼是否已经加载完成 */
    private get spineLoaded(){
        // return this.spine.skeleton;
        return this.coreSpine.skeleton;
    }
    public pushCtl(ctl:IAvatarBaseCtl){
        this._ctlList.push(ctl);
    }
    public spineload(that:Object,func:Function){
        if(this.spineLoaded){
            func.call(that)
        }else{
            this.once(Laya.Event.COMPLETE,that,func);
        }
    }
    private mFashion:boolean = false;
    constructor(){
        super();
        this._haloContainer = new Laya.Sprite();
        this._flagImg = new Laya.Image();
        this._flagImg.anchorX = 0.5;
        this._flagImg.anchorY = 1;

        DebugUtil.drawCross(this,0,0,20,"#ff00ff");

        // this.buffer.con = this;
        this.initMoveTween();
        if(this.mFashion){
            // this.fashion = FashionModel.Ins;
        }
        this.coreSpine = new SpineCoreSkel();
        // this.spine = new BaseSpineAvatar();
        // this.spine.once(Laya.Event.COMPLETE,this,this.onCompleteHandler);

        

        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        // if(E.Debug){
        //     let spr = new Laya.Sprite();
        //     spr.graphics.drawCircle(0,0,3,null,"#ff0000");
        //     this.addChild(spr);
        //     // this.tf = new Laya.Label();;
        //     // this.addChild(this.tf);
        // }
    }

    /**初始化战斗素材 */
    public initFightRes() {

        this.blood = new AvatarBloodSpine();
        // this.fightEffect =  new FightPureAnim(IconUtils.effect+".skel");
        // this._allEffect.push(this.fightEffect);
/*
        this.csEffect = new FightPureAnim(IconUtils.effect+".skel",this);
        this._allEffect.push(this.csEffect);

        this.csEffect2 = new FightPureAnim(IconUtils.effect+".skel",this);
        this._allEffect.push(this.csEffect2);
*/
    }

    public csPlay(anim:EAvatarEffectAnim){
        // if(this.csEffect){
        // this.csEffect.poolPlay(anim);
        // }
        // AvatarFactory.getEffect(this).poolPlay(anim);
        this.poolPlay(anim);
    }
    public csPlay2(anim:EAvatarEffectAnim){
        // if(this.csEffect2){
        // this.csEffect2.poolPlay(anim);
        // }
        // AvatarFactory.getEffect(this).poolPlay(anim);
        this.poolPlay(anim);
    }
    private poolPlay(anim:EAvatarEffectAnim){
        AvatarFactory.getEffect(this,0,-AvatarConfig.effectOffsetY,this,this.onPoolPlay,[anim]);
    }

    private onPoolPlay(o:FightPureAnim,arr){
        o.poolPlay(arr[0]);
    }

    /**加载指定的形象 */
    private loadByImageID(id:number){
        let k:string = War3Config.Prefix;
        let prefix = `o/Image_Character/${k}${id}/${k}${id}`;
        let atlas:string = `${prefix}.atlas`;
        Laya.loader.load(atlas,new Laya.Handler(this,()=>{
            this.main = AtlasParser.Start(Laya.Loader.getRes(atlas));
        }),null,Laya.Loader.TEXT);
        this.baseImg = `${prefix}.png`;
        this.load(`${prefix}.skel`);
    }
    /**加载光环 */
    protected refreshHalo(skinId:number){
        if(this._haloEffect){
            this._haloEffect.dispose();
        }
        if(skinId==0 || skinId==undefined){

        }else{
            let eff = new SimpleEffect(this._haloContainer, `o/Image_Halo/halo${skinId}/halo${skinId}`);
            eff.play(0,true);
            this._haloEffect = eff;
        }
        this.haloId = skinId;
    }

    /**刷新新骨骼皮肤 */
    refreshImageID(id: number) {
        this.imageID = id;
        this.reload();
    }

    /**锚点父坐标 */
    setParentAnchorPos(x:number,y:number){
        this.localPos.x = x;
        this.localPos.y = y;
    }
    /**设置战旗 */
    refreshFlagId(id: number) {
        this.flagId = id;
        if(id == 0 || id == undefined){
            this._flagImg.skin = "";
        }else{
            this._flagImg.skin = AvatarFactory.createFlag(id);
        }
        if(this.parent){
            let i = this.getChildIndex(this)-1;
            i = i < 0 ? 0 : i;
            this.parent.addChildAt(this._flagImg,i);
            this._flagImg.x = this.localPos.x + ((this._curDir == EAvatarDir.Left ? 1 : -1) * War3Config.FlagOffsetX);
            this._flagImg.y = this.localPos.y;
            // this.parent.addChild(this._flagImg);
            // this.addChild(this._flagImg);
        }else{
            LogSys.Warn(`refreshFlagId fail parent is null`);
        }
    }

    /**重载形象 */
    reload() {
        this.disposeCoreSpine();
        this.coreSpine = new SpineCoreSkel();
        this.initRes();
        this.loadSkel();
        this.refreshSkin();
    }

    public initRes(){
        // if(Laya.Utils.getQueryString("debug_fight_war3")){
        //     this.loadByImageID(Math.floor(Math.random()*3)+1);
        //     return;
        // }
        
        if(this.imageID){
            this.loadByImageID(this.imageID);
            return;
        }

        let id:number = this.rideId;
        if (id > 0) {
            // this.main = AtlasParser.Start(Laya.Loader.getRes(`o/avatar/horse/horse.atlas`));//weapon shield
            /*
            let _mountCfg:Configs.t_Mount_List_dat = Mount_ListProxy.Ins.getCfg(id);
            let a: string = _mountCfg.f_skel == 0 ? "" : _mountCfg.f_skel + "";
            */
            let a:string = "";
            let horseRes:string = `horse${a}/horse${a}`;
            this.main = AtlasParser.Start(Laya.Loader.getRes(`o/avatar/${horseRes}.atlas`));//weapon shield
            this.baseImg = `o/horse_spine/horse_${id}.png`;
            this.load(`o/avatar/${horseRes}.skel`);
            
        } else {
            this.main = AtlasParser.Start(Laya.Loader.getRes(ResPath.Avatar.baseAtlas));//weapon shield
            this.baseImg = ResPath.Avatar.baseImg;
            this.load(ResPath.Avatar.baseSkel);
        }
    }

    private getName(str:string){
        let arr = str.split("/");
        return arr[arr.length -1];
    }

    private getPath(str:string){
        let arr = str.split("/");
        let s = "";
        for(let i = 0;i < arr.length - 1;i++){
            s+=arr[i]+"/";
        }
        return s;
    }
    /**攻击类型 */
    get attackType(){
        return E.gameAdapter.getAttackType(this.imageID);
    }
    public setSkel(val:string){
        // let arr = val.split("/");
        let _name:string = this.getName(val);
        let _path = this.getPath(val);//val.replace(_name,"");
        this.main = AtlasParser.Start(Laya.Loader.getRes(`${_path}${_name}.atlas`));
        this.baseImg = `${_path}${_name}.png`;
        this.load(`${_path}${_name}.skel`);
    }
    /**设置资源 */
    public setRes(resKey:string){
        let path = `${resKey}/${resKey}`;
        this.main = AtlasParser.Start(Laya.Loader.getRes(`o/avatar/${path}.atlas`));//weapon shield
        this.baseImg = `o/avatar/${path}.png`;
        this.load(`o/avatar/${path}.skel`);
    }

    /**是否是坐骑的骨架 */
    public get bHorseSkel() {
        return this.baseImg.indexOf(`o/horse_spine/`) != -1;
    }

    // protected onCompleteHandler(){
        // this.addChildAt(this.spine.skeleton,0);
        // this.event(Laya.Event.COMPLETE);
    // }

    // public get curBloodVal() {
    // return this.blood.curBloodVal;
    // }

    hasHorse() {
        let _l: IMSpineRegions[] = this.main;
        if (_l) {
            for (let i = 0; i < _l.length; i++) {
                let cell: IMSpineRegions = _l[i];
                if (cell.name == "hhead") {
                    return true;
                }
            }
        }
    }
    private onDisplay() {
        // console.log("show", this, this._showBlood);
        this.layout();
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    }

    /**刷新战旗 光环 */
    updateFlagHalo(){
        this.refreshFlagId(this.flagId);
        this.refreshHalo(this.haloId);
    }

    private layout(){
        if (this._showBlood && this.blood) {
            this.bloodParent.addChild(this.blood);
        }
    }
    private get bloodParent(){
        return this.bloodParentType == EBloodParent.Parent ?  this.parent : this;
    }
    private get refX(){
        if(this.blood && this.blood.parent == this){
            return 0;
        }
        return this.x;
    }
    private get refY(){
        if(this.blood && this.blood.parent == this){
            return 0;
        }
        return this.y;
    }

    private updateBloodPos(){
        let x = this.refX-this.blood.width / 2;
        let offsetY:number = E.gameAdapter.getOffsetyByImageId(this.imageID,this.hasHorse());
        let y = this.refY - offsetY;
        this.blood.x = x;
        this.blood.y = y;
    }
    private _testPosTf:Laya.Label;
    protected onFrameLoop(){
        if(this.blood && this.blood.parent){
            this.updateBloodPos();
        }
    }

    private addDebugRate(){
        if (!this._testPosTf) {
            this._testPosTf = new Laya.Label();
            this._testPosTf.color = "#00ff00";
            this._testPosTf.stroke = 2;
            this._testPosTf.strokeColor = "#000000";
            this._testPosTf.fontSize = 24;
            // this._testPosTf.y = y;
            this.addChild(this._testPosTf);
        }
        if(this.coreSpine && this.coreSpine.skeleton){
            this._testPosTf.text = "rate:"+this.coreSpine.skeleton['_playbackRate'];
        }
    }

    private onUnDisplay(){
        Laya.timer.clear(this,this.onFrameLoop);
    }

    // public setDebugTxt(v: string) {
    //     if (E.Debug) {
    //         if (!this.tf) {
    //             this.tf = new Laya.Label();
    //             // this.tf.fontSize = 32;
    //             this.tf.color = "#ffffff";
    //         }
    //         this.tf.text = v;
    //         this.addChild(this.tf);
    //     }
    // }

    //刷新皮肤
    public refreshSkin(){

    }
    public initBlood(){
        this._showBlood = true;
    }

    public hideBlood(){
        if(this.blood){
            this.blood.removeSelf();
        }
        this._showBlood = false;
    }

    public playBlood(v:number,criticalStrike:boolean = false,anim:EAvatarEffectAnim = EAvatarEffectAnim.SuckBloodTxt,offsetX:number = 0){
        if(this.blood){
            this.blood.flyTxt(v);
        }
        AvatarFactory.getEffect(this,offsetX,-AvatarConfig.effectOffsetY,this,this.onFlyBlood,[v,criticalStrike,anim]);
    }

    private onFlyBlood(o:FightPureAnim,arr){
        let v:number = arr[0];
        let criticalStrike:boolean = arr[1];
        let anim:EAvatarEffectAnim = arr[2];
        o.flyBlood(v,criticalStrike,anim);
    }

    public load(url){
        this._skelUrl = url;
        // this.spine.load(url);
    }

    protected onSpine1Complete(){
        let index:number = 0;
        // this.addChildAt(this._flagImg,index);  index++;    //战旗
        // this.refreshFlagId(this.flagId);
        this.updateFlagHalo();
        this.addChildAt(this._haloContainer,index); index++;  //光环容器
        this.addChildAt(this.coreSpine.skeleton,index); index++;//骨骼角色

        // if(!DrawCallConfig.disable_spine){
        // }
        this.coreSpine.skeleton.pos(this.offsetX,this.offsetY);
        this.coreSpine.skeleton.on(Laya.Event.LABEL,this,this.onLabelEvt);
        this.dir = this._curDir;
        // MainModel.Ins.on(MainEvent.UPDATE_ANIM_SCALE_RESET,this,this.onAvatarAnimScaleReset);
        Laya.timer.callLater(this,this.callBackComplete);
    }

    private callBackComplete(){
        if(this.hasListener(Laya.Event.COMPLETE)){
            // LogSys.Warn("onSpine1Complete COMPLETE: without event");
        }
        this.event(Laya.Event.COMPLETE);
    }

    private onLabelEvt(e){
        // console.log("-==============>",e);
        this.event(Laya.Event.LABEL,e);
    }
    public set dir(v:EAvatarDir){
        this._curDir = v;
        this.coreSpine.dir = v;
    }

    public get dir(){
        return this.coreSpine.dir;
    }
    /**
     * 偏移距离
     * @param offsex 目标坐标x
     */
    public moveX(offsex:number,time:number,_moveHandler?:Laya.Handler,animType?:EAvatarAnim){
        this.isMoving = true;
        this._moveHandler = _moveHandler;
        // this.initMoveTween();
        if(animType){
            this.play(2);//EAvatarAnim.Move
        }
        this._moveTween.to(this,{x:offsex,update:new Laya.Handler(this,this.onUpdate)},time,null,new Laya.Handler(this,this.onMoveEnd));
    }

    /**移动 */
    public move(ox:number,oy:number,time:number,_moveHandler?:Laya.Handler){
        this._moveHandler = _moveHandler;
        // this.play(EAvatarAnim.Move);
        this._moveTween.to(this,{x:ox,y:oy,update:new Laya.Handler(this,this.onUpdate)},time,null,new Laya.Handler(this,this.onMoveEnd));
    }

    private onUpdate(){
        // console.log(1121);
        this.onFrameLoop();
    }

    private initMoveTween(){
        if(this._moveTween){
            this._moveTween.clear();
        }else{
            this._moveTween = new Laya.Tween();
        }
    }

    public play(anim: EAvatarAnim, target?, callBack?, args?,_once?) {
        if(this.animAdapter){
            anim = this.animAdapter.getAnimInex(anim);
        }
        return this.coreSpine.play(anim,target,callBack,args,_once);
    }

    /**播放受到击晕动画 */
    // public playStunned(){
    // this.play(EAvatarAnim.InStunned,this,this.onStunedEnd);
    // }

    // private onStunedEnd(){
    // this.play(EAvatarAnim.Stunned);
    // }
    /**当前的动画*/
    public get curAnim():EAvatarAnim{
        return this.coreSpine.anim;
    }
    /**只播放一次 */
    public playOnce(anim:EAvatarAnim,target?, callBack?, args?){
        return this.play(anim,target,callBack,args,true);
        // return this.coreSpine.play(anim,target,callBack,args,true);//不循环
    }

    // public clear(){
    //     this.reset();
    //     this.x = this.y = 0;
    //     this.hideBlood();
    //     this.useFightSkin = false;
    // }

    public stop(){
        this.coreSpine.stop();
        this.removeAllLis();
    }

    public start(){
        // this.corepine.start();
        this.loadSkel();
    }

    protected loadSkel(){
        this.coreSpine.once(Laya.Event.COMPLETE,this,this.onSpine1Complete);
        this.coreSpine.load(this._skelUrl);
    }

    /**useTime秒渐变为透明 */
    public alphaToZero(end: Laya.Handler = null, useTime: number = 1000) {
        // this.initMoveTween();
        this._moveTween.to(this, { alpha: 0.0 }, useTime, null, end);
    }

    public reset(x:number = 0,y:number = 0){
        this.isBoss = false;
        this.standPos = -1;
        if(this.blood){
            this.blood.reset();
        }

        for(let i = 0;i < this._allEffect.length;i++){
            this._allEffect[i].stop();
        }

        if(this._moveTween){
            this._moveTween.clear();
        }
        if(!this.destroyed){
            this.alpha = 1.0;
        }
        this.setPos(x,y);
        this.offAll(AvatarEvent.UPDATA_BLOOD);
    }

    /**
     * 移动结束
     */
    private onMoveEnd(){
        this.isMoving = false;
        // this.play(EAvatarAnim.Stand);
        if(this._moveHandler){
            this._moveHandler.run();
        }
    }

    /*
     * 设置坐标
     */
    public setPos(x:number,y:number){
        this.x = x;
        this.y = y;
    }
    protected removeAllLis(){

    }
    public dispose(){
        this.removeAllLis();
        this.isMoving = false;
        // this.buffer.dispose();
        while(this._ctlList.length){
            let ctl = this._ctlList.shift();
            ctl.dispose();
        }
        this.reset();
        this.onUnDisplay();
        this.off(Laya.Event.DISPLAY,this,this.onDisplay);
        this.off(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        // if(this.effect){
        //     this.effect.dispose();
        // }
        
        // if(this.csEffect){
        // this.csEffect.dispose();//删除之后会释放掉spine绑定的纹理对象
        // }

        for(let i = 0;i < this._allEffect.length;i++){
            let cell = this._allEffect[i];
            cell.dispose();
        }
        if(this.blood){
            this.blood.dispose();
        }

        if(this._moveTween){
            this._moveTween.clear();
        }
        // if(this.coreSpine.skeleton){
        //     this.coreSpine.skeleton.off(Laya.Event.LABEL,this,this.onLabelEvt);
        // }
        // this.coreSpine.dispose();
        // MainModel.Ins.off(MainEvent.UPDATE_ANIM_SCALE_RESET,this,this.onAvatarAnimScaleReset);
        this.disposeCoreSpine();
        if(this._haloEffect){
            this._haloEffect.dispose();
            this._haloEffect = null;
        }
        if(this._flagImg){
            this._flagImg.removeSelf();
            // this._flagImg.dispose();
            this._flagImg = null;
        }
        this.removeSelf();
        this.vo = null;
        this.imageID = null;
        this.destroy();
    }

    protected disposeCoreSpine(){
        if(this.coreSpine){
            this.onAvatarAnimScaleReset();
            this.coreSpine.stop();
            this.coreSpine.off(Laya.Event.COMPLETE,this,this.onSpine1Complete);
            if(this.coreSpine.skeleton){
                this.coreSpine.skeleton.off(Laya.Event.LABEL,this,this.onLabelEvt);
            }
            this.coreSpine.dispose();
            // this.coreSpine = null;
        }
    }

    private onAvatarAnimScaleReset(){
        if(this.coreSpine){
            this.coreSpine.playbackRate(1);
        }
    }

    // protected getAnimName(anim: EAvatarAnim) {
    //     switch (anim) {
    //         case EAvatarAnim.Stop:
    //             return "Stop";
    //         case EAvatarAnim.Stand:
    //             return "Stand";
    //         case EAvatarAnim.Move:
    //             return "Move";
    //         case EAvatarAnim.Attack:
    //             return "Attack"
    //         case EAvatarAnim.Attack2:
    //             return "Attack2";
    //         case EAvatarAnim.StrongAttack:
    //             return "StrongAttack";
    //         case EAvatarAnim.StrongAttack2:
    //             return "StrongAttack2";
    //         case EAvatarAnim.Hit:
    //             return "Hit";
    //         case EAvatarAnim.Hit2:
    //             return "Hit2";
    //         case EAvatarAnim.Dodge:
    //             return "Dodge";
    //         case EAvatarAnim.Stunned:
    //             return "Stunned";
    //         case EAvatarAnim.Die:
    //             return "Die";
    //         case EAvatarAnim.AssassinateReady:
    //             return "AssassinateReady";
    //         case EAvatarAnim.Assassinate:
    //             return "Assassinate";
    //     }
    // }
}