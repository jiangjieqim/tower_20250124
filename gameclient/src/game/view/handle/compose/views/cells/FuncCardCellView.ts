// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { ISimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ItemVo } from "../../../main/vos/ItemVo";
import { TowerMainEvent } from "../../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { IceCardStatusVo, IDelEffectCardUid } from "../../vos/EFightEnum";
import { FightValueConfig } from "../../vos/FightValueConfig";
import { FuncCardVo, IPlayPieResult } from "../../vos/FuncCardVo";
import { GainDecorator } from "../../vos/GainVo";
import { FuncCardCtl } from "../FuncCardCtl";
import { FuncCardShow } from "../FuncCardShow";

/**子卡牌 */
export class FuncCardCellView extends ui.views.compose.fightcell.ui_func_card_cellUI {
    static CLS_KEY: string = "FuncCardCellView";
    cardCtl:FuncCardCtl;
    vo: FuncCardVo;
    private selCon:Laya.Sprite= new Laya.Sprite();
    private btnCtl: ButtonCtl;
    private model: ComposeModel;
    private tween: Laya.Tween;
    private effect:ISimpleEffect;
    private OFFSET_X:number = 0;
    private OFFSET_Y:number = 0;
    private gainDecorator:GainDecorator;
    constructor() {
        super();
        this.model = ComposeModel.Ins;
        this.tween = new Laya.Tween();
        this.disableIce.visible = false;
        this.aniCon.addChildAt(this.selCon,0);
        this.OFFSET_X = this.aniCon.width/2;
        this.OFFSET_Y = this.aniCon.height/2;
        this.btnCtl = ButtonCtl.CreateBtn(this.btn, this, this.onBtnClickHandler,undefined,undefined,true);
        this.aniCon.btnCtl = this.btnCtl;
        // this.btnCtl.bStopPropagation = true;
        // this.clickImg.on(Laya.Event.CLICK, this, this.onClickHandler);
        let clickImgBtn = ButtonCtl.CreateBtn(this.clickImg,this,this.onClickHandler,false,undefined,true);
        // clickImgBtn.bStopPropagation = true;

        this.on(Laya.Event.DISPLAY, this, this.onDisplay);
        this.on(Laya.Event.UNDISPLAY, this, this.onUnDisplay);


        //old
        // if(E.ViewMgr.isOpenReg(EViewType.FuncCard)){
        //     this.pivotX = this.pivotY = 0;
        // }
        this.gainDecorator = new GainDecorator(this.btn);
        
    }

    private onCardPriceDoubles(){
        this.onUpdateLab();
    }
   

    private onPlayPie(_result:IPlayPieResult){
        if(this.vo.data.serialNum != _result.serialNum){
            this.timeCheckCd();
        }
    }

    // private playPie(cd:number){
    //     this.pieCtl.play(this.qua.width,this.qua.height,cd);
    // }

    private onUnDisplay() {
        this.disposeEffect();
        // this.model.off(ComposeEvent.MoveCard, this, this.onMoveCard);

        this.model.off(ComposeEvent.CardPriceDoubles,this,this.onCardPriceDoubles);
        this.model.off(ComposeEvent.PlayPie, this, this.onPlayPie);
        this.model.off(ComposeEvent.DelEffectCardUid,this,this.onDelIceHandler);
        this.model.off(ComposeEvent.IceCards,this,this.onIceCards);

        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell, this, this.onUpdateLab);
        this.gainDecorator.onExit();
    }

    private onDelIceHandler(obj:IDelEffectCardUid){
        let vo:IceCardStatusVo = this.model.iceCardsVo;
        if(vo.playerId == obj.playerId && vo.cardSerialNum == obj.cardSerialNum){
            this.disableIce.visible = vo.bCardIce;
        }
    }
    private onIceCards(){
        let vo:IceCardStatusVo = this.model.iceCardsVo;
        this.disableIce.visible = vo.bCardIce;
        this.pieSelect = false;
    }
    private onDisplay() {
        this.gainDecorator.onInit();
        this.model.on(ComposeEvent.CardPriceDoubles,this,this.onCardPriceDoubles);
        this.model.on(ComposeEvent.DelEffectCardUid,this,this.onDelIceHandler);
        this.model.on(ComposeEvent.IceCards,this,this.onIceCards);
        // this.model.on(ComposeEvent.MoveCard, this, this.onMoveCard);
        this.model.on(ComposeEvent.PlayPie, this, this.onPlayPie);
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell, this, this.onUpdateLab);
        this.onIceCards();
        let vo = this.vo;
        DebugUtil.drawTF(this,`uid:${vo.data.serialNum} card:${vo.data.fCardId}`,"#ff0000",0,-36);

        this.timeCheckCd();
        
    }

    timeCheckCd(){
        if(this.vo.cdTime){
            let sub = this.vo.cdTime - TimeUtil.serverTimeMS;
            if(sub > 0){
                this.aniCon.playPie(sub);
            }
        }
    }

    private onUpdateLab() {
        ItemViewFactory.setlb2(this.moneyTf,this.vo.needItemVo.cfgId,this.vo.needItemVo.count);
    }

    // static curTime:number = 0;

    private onBtnClickHandler() {
        if(this.aniCon.pieCtl.isPlaying){
            return;
        }
        this.model.useCard(this.vo.data.serialNum,this.vo.needItemVo);
    }

    /**移除 */
    removeCard() {
        this.tween.clear();
        let useTime:number =  this.animTime/2;
        this.tween.to(this, { y: FightValueConfig.cardOffsetY - this.height*2 }, useTime);
        Laya.timer.once(useTime,this,this.dispose);
    }

    private get animTime(){
        return this.model.curAdapter.cardMoveTime;
    }

    /**左移 */
    toLeft(){
        this.tween.clear();
        let oldx:number = this.x;
        this.tween.to(this, { x: oldx - FightValueConfig.cardCellWidth },this.animTime);
    }
    private onStageClick(){
        this.pieSelect = false;
    }
    /**
     * 点击选择
     */
    private onClickHandler() {
        // e:Laya.Event
        // if(ButtonCtl.disable){
        //     return;
        // }
        // e.stopPropagation();
        if(this.model.iceCardsVo.bCardIce){
            return;
        }
        if(this.cardCtl){
            this.cardCtl.onSelectHandler(this);
            Laya.stage.once(Laya.Event.CLICK,this,this.onStageClick);
        }
        this.model.closeHeroTips();
        let type = EViewType.FuncCardShow;
        if (E.ViewMgr.isOpenReg(type)) {
            (E.ViewMgr.Get(type) as FuncCardShow).refresh(this.vo);
        } else {
            E.ViewMgr.Open(type, null, this.vo);
        }
    }
    setData(vo: FuncCardVo) {
        this.vo = vo;
        let cfg = vo.cfg;
        let itemVo: ItemVo = vo.needItemVo;
        this.moneyIcon.skin = itemVo.getIcon();
        // this.moneyTf.text = itemVo.count + "";
        this.onUpdateLab();

        /*
        this.qua.skin = t_Function_Card.Ins.getQuaSkin(cfg.f_qua);
        this.nameTf.text = cfg.f_card_name;
        // this.nameTf.color = "#"+QualitycolorProxy.Ins.getCfgByQua(cfg.f_qua).f_color;
        this.icon.skin = t_Function_Card.Ins.getIconById(cfg.f_card_imageid);
        this.frameIcon.skin = `remote/fight/bottom_kp_0${cfg.f_qua}.png`;
        */
        this.aniCon.cfg = cfg;
    }
    dispose() {
        this.alpha = 1.0;
        E.ViewMgr.Close(EViewType.FuncCardShow);
        this.btnCtl.visible = true;
        this.aniCon.y = 0;
        if (this.tween) {
            this.tween.clear();
        }
        this.vo = null;
        this.removeSelf();
        Laya.Pool.recover(FuncCardCellView.CLS_KEY, this);
        // Laya.Loader.clearTextureRes(this.qua.skin);
    }

    get angleToVector() {
        let angle = this.rotation;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    private disposeEffect(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }

    /**选择 */
    set pieSelect(v:boolean){ 
        const offsetH:number = -30;
        if(v){
            let old = this.model.cardList.find(o=>o.data.serialNum == this.vo.data.serialNum);
            if(!old){
                // LogSys.Warn(`not found ${this.vo.data.serialNum}`);
                return;
            }

            if(!this.effect){
                this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/Card_Idle/Card_Idle`, this, this.width / 2, this.height / 2 + offsetH - 7.5);
            }
            // LogSys.Log(`set select serialNum:${this.vo.data.serialNum} set true.`);
            this.aniCon.y = offsetH;
        }else{
            this.disposeEffect();
            this.aniCon.y = 0;
        }
    }
    /**使用卡牌的时候飞出去的动画 */
    flyAndDel(){
        this.vo.playSound();
        SpineEffectMgr.playOnce(FightValueConfig.CardPlay,this.selCon,this.OFFSET_X,this.OFFSET_Y);
        this.btnCtl.visible = false;
        // let tween = new Laya.Tween();
        this.tween.clear();
        // FightValueConfig.cardFlyTime
        this.tween.to(this.aniCon,{y:-200},FightValueConfig.cardShowTime,null,new Laya.Handler(this,this.onComplete));
    }

    alphaShow(){
        this.alpha = 0.0;
        this.tween.clear();
        this.tween.to(this,{alpha:1.0},FightValueConfig.cardShowTime);
    }

    private onComplete(){
        this.dispose();
    }

    updateSort(){
        this.vo.sortNum = this.rotation;
    }

    set displayAniCon(v:boolean){
        this.aniCon.visible = v;
        this.btnCtl.visible = v;
    }
}