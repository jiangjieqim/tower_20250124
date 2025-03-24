// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { SellHero_req, stElement } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ESkillType } from "../../guide/HeroAi";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { SkillListProxy } from "../../skill/proxy/SkillProxy";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListLvProxy, HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightUtils } from "../FightUtils";
import { EHeroQua } from "../t_Battle_Config";
import { EHeroClone, IDelHeroUpdate, IUpdateHero } from "../vos/EFightEnum";
import { ESkillCd, FightValueConfig } from "../vos/FightValueConfig";
/**合成-出售菜单 
 * 有出售的时候 不关闭
 * 
*/
export class ComposeTips extends ViewBase {
    PageType: EPageType = EPageType.None;
    private _ui: ui.views.compose.fightcell.ui_compose_tipsUI;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.model.off(ComposeEvent.HeroUpdate,this,this.onHeroUpdate);
        this.model.off(ComposeEvent.SkillCdUpdate,this,this.refresh);
        this.model.off(ComposeEvent.SommonTimes,this,this.refresh);
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.refresh);
        // GuideModel.Ins.event(EGuideEvent.GuideViewHide);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.fightcell.ui_compose_tipsUI();
            this.model = ComposeModel.Ins;
            // GuideUtils.sellmenu = this;
            this._ui.mouseThrough = true;
            this.sellBtnCtl = ButtonCtl.CreateBtn(this._ui.sellBtn, this, this.onSellClick);
            this.composeBtnCtl = ButtonCtl.CreateBtn(this._ui.composeBtn, this, this.onComposeClick);
            this.unlockBtnCtl = ButtonCtl.CreateBtn(this._ui.unlockBtn, this, this.unLockHandler);
            this.unlockBtnCtl.visible = false;
        }
    }

    private onHeroUpdate(vo:IUpdateHero){
        let item:stElement = vo.vo;
        if(item.uid == this.data.uid){
            this.data = item;
            this.refresh();
        }
    }

    protected onInit(): void {
        this.model.on(ComposeEvent.HeroUpdate,this,this.onHeroUpdate);
        this.model.on(ComposeEvent.SkillCdUpdate,this,this.refresh);
        this.model.on(ComposeEvent.SommonTimes,this,this.refresh);
        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.refresh);
        this.updateView(this.Data);
    }

    updateView(vo: stElement) {
        // throw new Error("Method not implemented.");
        // let vo:stElement = this.Data;
        this.data = vo;
        /*
        let spr:Laya.Sprite = this.fightView.heroLayer; // avatar.layer;
        let pos = (spr.parent as Laya.Sprite).localToGlobal(new Laya.Point(spr.x,spr.y));
        let pos1 = (this.fightView.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.fightView.x,this.fightView.y));
        this.fightView.addChild(this._composeTips);
        this._composeTips.data = this.refreshList.find(o=>o.uid == uid);
        this._composeTips.x = pos.x - pos1.x - this._composeTips.width / 2 + ox;
        this._composeTips.y = pos.y - pos1.y - this._composeTips.height / 2 + oy;
        // this._composeTips.setHit();
        this._composeTips.refresh();
        */
        this.refresh();
        this.SetCenter();
    }

    protected SetCenter() {
        let fightView = this.model.fightView;
        if(!fightView){
            return;
        }
        let centerXY = (fightView.parent as Laya.Sprite).localToGlobal(new Laya.Point(fightView.x, fightView.y));
        let vo = this.data;
        let ox: number = FightUtils.IsoxToPosX(vo.x);
        let oy: number = FightUtils.IsoyToPosY(vo.y, this.model.getOwnerType(vo.playerId));
        this.UI.x = ox + ComposeConfig.cellW - this._ui.width / 2 + centerXY.x;
        this.UI.y = oy + ComposeConfig.cellH - this._ui.height / 2 - ComposeConfig.cellH/3 + centerXY.y;
    }
    private model: ComposeModel;
    private composeBtnCtl: ButtonCtl;
    private sellBtnCtl: ButtonCtl;
    private unlockBtnCtl: ButtonCtl;//解锁诅咒
    data: stElement;
    /**解锁 (主动类型)*/
    private unLockHandler() {
        // let req = new SkillActive_req();
        // req.uid = this.data.uid;
        // SocketMgr.Ins.SendMessageBin(req);
        this.model.curAdapter.useMainSkill(this.data.uid);
        this.onClickAnyAera();
    }

    private onDelHandler(obj: IDelHeroUpdate) {
        if (this.data.uid == obj.uid) {
            this.onClickAnyAera();
        }
    }

    /**售卖 */
    private onSellClick() {
        this.model.once(ComposeEvent.HeroDelByUID,this,this.onDelHandler);
        let req: SellHero_req = new SellHero_req();
        req.uid = this.data.uid;
        SocketMgr.Ins.SendMessageBin(req);
    }

    /**合成按钮 */
    private onComposeClick() {
        if (this.bCanCompose) {
            this.model.curAdapter.heroUpgrade(this.data.uid);
            // this.model.closeHeroTips();
        }
        // Laya.timer.once(1000,this,this.onClickAnyAera);
        this.onClickAnyAera();
    }

    /**点击了任何区域 */
    private onClickAnyAera() {
        if(this.model.fightView){
            this.model.fightView.closeCirleYellow();
        }
        this.model.closeHeroTips();
        Laya.timer.frameOnce(1,this,this.Close);
        // this.Close();
    }

    private clearUI() {
        this.unlockBtnCtl.visible = false;
        this.composeBtnCtl.gray = true;
    }

    /**是否可以合成 */
    private get bCanCompose() {
        if (this.data.num == FightValueConfig.ComposeHeroCount) {
            return true;
        }
    }

    private hideMenu() {
        this._ui.icon.visible = false;
        this.composeBtnCtl.visible = false;
        this.sellBtnCtl.visible = false;
        this._ui.lb.visible = false;
    }
    private getConsume(heroId:number){
        let _consume:string = "";
        let data = TowertMainHeroModel.Ins.getHeroById(heroId);
        if(data){
            let _cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(heroId,data.level);
            let arr = _cfg.f_heroskill.split("|");
            for(let i = 0;i < arr.length;i++){
                let skillId:number = parseInt(arr[i]);
                let skillCfg =  SkillListProxy.Ins.getCfgById(skillId);
                if(skillCfg.f_type == ESkillType.Initiative){
                    _consume = skillCfg.f_consumption;
                    break;
                }
            }
        }
        return _consume;
    }
    private refresh() {
        this.clearUI();
        let heroId: number = this.data.fid;
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        this.hideMenu();
        if (cfg.f_qua == EHeroQua.Red) {
            if (this.data.playerId == MainModel.Ins.mRoleData.AccountId &&
                !StringUtil.IsNullOrEmpty(cfg.f_active_skills_text) &&
                // !this.model.curAdapter.disableInitiativeSkill &&
                this.data.clone == EHeroClone.None//0
                ) 
            {

                //主动技能相关
                this.unlockBtnCtl.visible = this.model.curAdapter.mSkillVis;
                let _disable: boolean = false;
                this._ui.unlockTf.text = cfg.f_active_skills_text;

                if (StringUtil.IsNullOrEmpty(cfg.f_active_skills_consume)) {
                    //居中
                    this._ui.unlockTf.y = 20;
                    this._ui.moneyCon.visible = false;
                } else {
                    let consume:string = this.getConsume(this.data.fid);
                    this._ui.unlockTf.y = 7;
                    this._ui.moneyCon.visible = true;
                    let cost = ItemViewFactory.convertItem(consume);
                    this._ui.unlockImg.skin = cost.getIcon();
                    this._ui.unlockLb.text = cost.count + "";

                    if (!TowerMainModel.Ins.isItemEnoughSt(consume)) {
                        _disable = true;
                    }
                }
                if (cfg.f_active_skills_rate > 0) {
                    this._ui.gailv.visible = true;
                    this._ui.gailvTf.text = Math.floor(cfg.f_active_skills_rate / 10000 * 100) + "%" + E.getLang("rate");
                } else {
                    this._ui.gailv.visible = false;
                }

                if(!_disable){
                    let cell = this.model.skillCds.find(o=>o.uid == this.data.uid);
                    if(cell){
                        if(cell.status == ESkillCd.Disable){
                            _disable = true;
                        }
                    }
                }
                this.unlockBtnCtl.grayMouseDisable = _disable;

            }
        } else {

            if (this.data.playerId == MainModel.Ins.mRoleData.AccountId) {
                this._ui.icon.visible = true;

                this.composeBtnCtl.visible = this.model.fightTypeAdaper.bComposeBtnShow(cfg);//合成按钮
                this.composeBtnCtl.gray = !this.bCanCompose;
                
                // if (this.model.curAdapter.showSell) {
                //     this.sellBtnCtl.visible = true;
                // } else {
                //     this.sellBtnCtl.visible = false;
                // }
                this.sellBtnCtl.visible = this.model.fightTypeAdaper.bSellBtnShow;

                this._ui.lb.visible = true;
                let vo = this.model.fightTypeAdaper.getSellMoney(heroId);
                this._ui.lb.text = "+" + vo.count;
                this._ui.icon.skin = IconUtils.getIcon(ItemProxy.Ins.getCfg(vo.id).f_icon);

            }
        }
        MainModel.Ins.event(TowerMainEvent.MainViewLayerChange);
    }
}