import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightUIFactory } from "../FightUIFactory";
import { EEffectStatus, IDelEffectCardUid } from "../vos/EFightEnum";
import { SupplicatiorDecorator } from "../vos/SupplicatiorDecorator";
import { CardMoneyCtl } from "./cells/CardMoneyCtl";

/**召唤面板功能控制器 */
export class FuncSommonCardCtl{
    /**召唤材料是否足够 */
    // bCostEnough:boolean;
    /**召唤消耗 */
    costLabel:Laya.Label;
    /**召唤按钮img */
    sommonImg:Laya.Image;
    /**祈愿按钮img */
    betterImg:Laya.Sprite;
    /**当前布币数量 */
    copperTf:Laya.Label;
    /**当前幸运石数量 */
    jadeTf:Laya.Label;
    /**场景中的英雄数量 */
    peoTf:Laya.Label;
    /**召唤按钮小锁 */
    lockimg:Laya.Image;
    private sommonEffect:NoContainerSimpleEffect;
    /**祈愿按钮特效装饰器 */
    private supplicatiorDecorator:SupplicatiorDecorator;

    private get model(): ComposeModel{
        return ComposeModel.Ins;
    }

    private moneyCtl:CardMoneyCtl;
    private jadeTfCtl:CardMoneyCtl;
    /**
     * 召唤按钮
     */
    sommonBtn: ButtonCtl;
    /**
     * 祈愿按钮
     */
    betterBtn: ButtonCtl;
    onInit(){
        this.sommonBtn = ButtonCtl.CreateBtn(this.sommonImg, this, this.onSommonHandler);
        this.betterBtn = ButtonCtl.CreateBtn(this.betterImg, this, this.onGambleHandler);
        this.supplicatiorDecorator = new SupplicatiorDecorator(this.betterImg);
        this.supplicatiorDecorator.onInit();
        this.moneyCtl = FightUIFactory.createCardMoney(this.copperTf, null, ECellType.FIGHT_MONEY);
        this.jadeTfCtl = FightUIFactory.createCardMoney(this.jadeTf, null, ECellType.FIGHT_STONE);
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell, this, this.onValChangeCell);
        this.model.on(ComposeEvent.CostUpdate, this, this.onCostUpdate);
        this.model.on(ComposeEvent.UpdateOwnerHeroCount,this,this.onUpdateOwnerHeroCount);
        this.model.on(ComposeEvent.CardUiEffectAdd,this,this.onCardUiEffect);
        GuideModel.Ins.on(EGuideEvent.SommonUnlock,this,this.onSommonStyle);
        this.model.on(ComposeEvent.DelEffectCardUid,this,this.onDelEffectCardUid);
        this.onSommonStyle();
        this.initMoney();
        this.onUpdateOwnerHeroCount();
        this.onCardUiEffect();
    }
    /**打开祈愿 */
    private onGambleHandler() {
        Laya.timer.callLater(this,this.onLaterOpenGamble);
    }

    private onLaterOpenGamble(){
        this.model.fightTypeAdaper.gambleOpen();
    }

    private initMoney() {
        this.moneyCtl.update();
        this.jadeTfCtl.update();
        this.onCostUpdate();
    }
    
    private onCostUpdate() {
        let id: number = ECellType.FIGHT_MONEY;
        ItemViewFactory.setlb2(this.costLabel, id, this.model.getCost(id));
    }

    private onValChangeCell(id:number){
        if (id == ECellType.FIGHT_MONEY) {
            this.onCostUpdate();
            this.moneyCtl.play();
            //==================================================================
        }
        else if (id == ECellType.FIGHT_STONE) {
            this.jadeTfCtl.play();
        }
    }
    onExit(){
        this.supplicatiorDecorator.onExit();
        this.disposeSummonEffectButton();
        GuideModel.Ins.off(EGuideEvent.SommonUnlock,this,this.onSommonStyle);
        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell, this, this.onValChangeCell);
        this.model.off(ComposeEvent.CardUiEffectAdd,this,this.onCardUiEffect);
        this.model.off(ComposeEvent.CostUpdate, this, this.onCostUpdate);
        this.model.off(ComposeEvent.UpdateOwnerHeroCount,this,this.onUpdateOwnerHeroCount);
        this.model.off(ComposeEvent.DelEffectCardUid,this,this.onDelEffectCardUid);
        if(this.sommonBtn){
            this.sommonBtn.dispose();
            this.sommonBtn = null;
        }
        if(this.betterBtn){
            this.betterBtn.dispose();
            this.betterBtn = null;
        }
        if(this.jadeTfCtl){
            this.jadeTfCtl.dispose();
            this.jadeTfCtl = null;
        }
        if(this.moneyCtl){
            this.moneyCtl.dispose();
            this.moneyCtl = null;
        }
    }
    private onSommonHandler() {
        this.model.curAdapter.fresh();
    }

    /**更新己方英雄数量 */
    private onUpdateOwnerHeroCount(){
        // let mythos = this.model.canGetMythos;
        // this._mythosRed.num = mythos.length;
        if(this.model.ownerPlayer){
            this.peoTf.text = `${this.model.heroCount}/${this.model.ownerPlayer.maxHero}`;
        }
    }

    private onSommonStyle(){
        if(this.model.curAdapter.sommonUnLockedStyle){
            this.sommonBtn.grayMouseDisable = false;
            this.lockimg.visible = false;
        }else{
            this.sommonBtn.grayMouseDisable = true;
            this.lockimg.visible = true;
        }
    }

    private onCardUiEffect(){
        this.disposeSummonEffectButton();
        if(this.model.summonEffectVo.status == EEffectStatus.Open){
            let ox = this.sommonImg.x + this.sommonImg.width/2;
            let oy = this.sommonImg.y + this.sommonImg.height/2;

            this.sommonEffect = SpineEffectMgr.createLoopNoSimpleEffect(this.model.summonEffectVo.url,this.sommonImg.parent as Laya.Sprite,ox ,oy,undefined,undefined,0.9);
            this.sommonEffect.data = this.model.summonEffectVo.cardSerialNum;
            // LogSys.Log('create effect...');
        }
    }
    private disposeSummonEffectButton(){
        if(this.sommonEffect){
            this.sommonEffect.dispose();
            this.sommonEffect = null;
            // LogSys.Log('disposeSummonEffectButton effect...');
        }
    }
    private onDelEffectCardUid(vo:IDelEffectCardUid){
        if(this.sommonEffect && vo.cardSerialNum == this.sommonEffect.data){
            this.disposeSummonEffectButton();
        }
    }
}