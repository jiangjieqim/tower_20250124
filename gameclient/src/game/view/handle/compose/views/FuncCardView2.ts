import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ESystemRefreshTime } from "../../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { ISmallTips } from "../../main/interface/Interface";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { FightValueConfig } from "../vos/FightValueConfig";
import { CardMoveVo } from "../vos/FuncCardVo";
import { BgAnim } from "./cells/BgAnim";
import { NumRed } from "./cells/NumRed";
import { FuncCardCtl } from "./FuncCardCtl";
import { FuncSommonCardCtl } from "./FuncSommonCardCtl";
/**新功能卡 */
export class FuncCardView2 extends ViewBase {
    public PageType: EPageType = EPageType.None;
    private _ui: ui.views.compose.ui_func_card2UI;
    private model: ComposeModel;
    private fairyBtnCtl: ButtonCtl;//神话按钮
    // private supplicatiorDecorator:SupplicatiorDecorator;
    private perbtn:ButtonCtl;
    /**神话红点 */
    private _mythosRed:NumRed;
    private funcCardCtl:FuncCardCtl;
    // private moneyCtl:CardMoneyCtl;
    // private jadeTfCtl:CardMoneyCtl;
    // private sommonBtn: ButtonCtl;
    private effect:BgAnim;//:ISimpleEffect;

    private _ctl:FuncSommonCardCtl;

    protected onAddLoadRes(): void {

    }
    private disposeEffect(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }
    private onGailvUp(){
        let ox = this._ui.sommonbtn.x + this._ui.sommonbtn.width/2;
        let oy = this._ui.sommonbtn.y; //+ this._ui.sommonbtn.height/2;
        SpineEffectMgr.playOnce(`o/spine/scene/gailv_up/gailv_up`,this._ui,ox,oy);
    }
    protected onExit(): void {
        // GuideModel.Ins.off(EGuideEvent.SommonUnlock,this,this.onSommonStyle);

        this.disposeEffect();
        this._ctl.onExit();
        // this.disposeSummonEffectButton();
        // this.supplicatiorDecorator.onExit();
        // throw new Error("Method not implemented.");
        this.funcCardCtl.onExit();
        // TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell, this, this.onValChangeCell);
        this.model.off(ComposeEvent.UpdateOwnerHeroCount,this,this.onUpdateOwnerHeroCount);
        this.model.off(ComposeEvent.MoveCard, this, this.onMoveCard);
        // this.model.off(ComposeEvent.CardUiEffectAdd,this,this.onCardUiEffect);
        // this.model.off(ComposeEvent.DelEffectCardUid,this,this.onDelEffectCardUid);
        // this.model.off(ComposeEvent.CostUpdate, this, this.onCostUpdate);
        this.model.off(ComposeEvent.GailvUp, this, this.onGailvUp);
        this._mythosRed.dispose();
    }

    private maskSommonClick(){
        //LogSys.Log(111);
    }
    private addBtnMask(img:Laya.Image){
        img.on(Laya.Event.CLICK,this,this.maskSommonClick);
        DebugUtil.draw(img,"#0000ff",undefined,undefined,0,0,true);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_func_card2UI();
            this.addBtnMask(this._ui.maskSommon);
            this.addBtnMask(this._ui.maskFairyBtn);
            this.addBtnMask(this._ui.maskBetter);

            FightValueConfig.cardShowTime = parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.CARD_SHOW_TIME));
            this._ui.mouseThrough = true;
            this.funcCardCtl = new FuncCardCtl();
            this.funcCardCtl.con1 = this._ui.con1;
            this.funcCardCtl.view = this;
            // this.sommonBtn = ButtonCtl.CreateBtn(this._ui.sommonbtn, this, this.onSommonHandler);
            // this.supplicatiorDecorator = new SupplicatiorDecorator(this._ui.betterBtn);
            this.fairyBtnCtl = ButtonCtl.CreateBtn(this._ui.fairyBtn, this, this.onFairyHandler);
            this.perbtn = ButtonCtl.CreateBtn(this._ui.perbtn,this,this.onPerHandler,undefined,undefined,true);

            // this.moneyCtl = FightUIFactory.createCardMoney(this._ui.copperTf,null,ECellType.FIGHT_MONEY);
            // this.jadeTfCtl = FightUIFactory.createCardMoney(this._ui.jadeTf,null,ECellType.FIGHT_STONE);
        }
    }

    /**概率 */
    private onPerHandler() {
        let _smallTipsData: ISmallTips = {} as ISmallTips;
        _smallTipsData.target = this._ui.perbtn;
        E.ViewMgr.Open(EViewType.ProbabilityView, null, _smallTipsData);
        // FunctionModel.Ins.showSmallTips("name", "desc", this._ui.perbtn);
    }


    /**神话 */
    private onFairyHandler() {
        E.ViewMgr.Open(EViewType.Mythos);
    }
    // private onSommonHandler() {
    //     this.model.curAdapter.fresh();
    // }
    

    // private onCostUpdate() {
    //     let id: number = ECellType.FIGHT_MONEY;
    //     ItemViewFactory.setlb2(this._ui.lab1, id, this.model.getCost(id));
    // }

    private initCtl(){
        this._ctl = new FuncSommonCardCtl();
        this._ctl.costLabel = this._ui.lab1;
        this._ctl.betterImg = this._ui.betterBtn;
        this._ctl.sommonImg = this._ui.sommonbtn;
        this._ctl.copperTf = this._ui.copperTf;
        this._ctl.jadeTf = this._ui.jadeTf;
        this._ctl.peoTf = this._ui.peoTf;
        this._ctl.lockimg = this._ui.lockimg;
        this._ctl.onInit();
    }

    protected onInit(): void {
        this.initCtl();
        this._ui.maskSommon.visible = false;
        this._ui.maskFairyBtn.visible = false;
        this._ui.maskBetter.visible = false;
        this.disposeEffect();
        this.effect = new BgAnim(this._ui.eff);//SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/TX_dibian/TX_dibian`,this._ui,this._ui.width/2,230,0,0);
        this.effect.setPos(this._ui.width/2,200);//this._ui.width/2,200,0
        this._ui.bg.skin = this.model.fightTypeAdaper.cardBG;
        this._mythosRed = FightFactory.createNumRed(this._ui.fairyBtn,this._ui.fairyBtn.width-FightValueConfig.redNumSize);//,101,23
        this.model.on(ComposeEvent.UpdateOwnerHeroCount,this,this.onUpdateOwnerHeroCount);
        this.model.on(ComposeEvent.MoveCard, this, this.onMoveCard);
        // this.model.on(ComposeEvent.CardUiEffectAdd,this,this.onCardUiEffect);
        // this.model.on(ComposeEvent.DelEffectCardUid,this,this.onDelEffectCardUid);
        // this.model.on(ComposeEvent.CostUpdate, this, this.onCostUpdate);
        this.model.on(ComposeEvent.GailvUp, this, this.onGailvUp);

        // TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell, this, this.onValChangeCell);
        this.funcCardCtl.onInit();
        // this.supplicatiorDecorator.onInit();
        //=======================================================================
        if(!this.model.curAdapter.isGuide){
            this.fairyBtnCtl.visible = true;
            this._ctl.betterBtn.visible = true;
        }

        if(Laya.Utils.getQueryString("hide_fairy")){
            this.fairyBtnCtl.visible =  false;
        }

        //=======================================================================
        // this.initMoney();
        this.onUpdateOwnerHeroCount();
        // this.onCardUiEffect();
        //=======================================================================
        // GuideModel.Ins.on(EGuideEvent.SommonUnlock,this,this.onSommonStyle);
        // this.onSommonStyle();
    }

    /**英雄数量更新 */
    private onUpdateOwnerHeroCount(){
        let mythos = this.model.canGetMythos();
        this._mythosRed.num = mythos.length;
        // if(this.model.ownerPlayer){
        //     this._ui.peoTf.text = `${this.model.heroCount}/${this.model.ownerPlayer.maxHero}`;
        // }
    }

    // private initMoney() {
    //     this.moneyCtl.update();
    //     this.jadeTfCtl.update();
    //     this.onCostUpdate();
    // }

    // private onValChangeCell(id: number) {
    //     if (id == ECellType.FIGHT_MONEY) {
    //         this.onCostUpdate();
    //         this.moneyCtl.play();
    //         //==================================================================
    //     }
    //     else if (id == ECellType.FIGHT_STONE) {
    //         this.jadeTfCtl.play();
    //     }
    // }

    protected SetCenter() {
        this.bottomLayout();
    }

    private onMoveCard(moveVo: CardMoveVo){
        this.funcCardCtl.onMoveCard(moveVo);
        this.updateCardCount();
    }
    updateCardCount(){
        this._ui.cardCntTf.text = `${this.model.cardList.length}/${this.model.fightTypeAdaper.maxCardCount}`;
    }
}