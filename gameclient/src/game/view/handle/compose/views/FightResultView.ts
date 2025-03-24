import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { stFightResult } from "../../../../network/protocols/BaseProto";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { ESystemRefreshTime } from "../../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { SoltItemView } from "../../main/views/icon/SoltItemView";
import { TowerMainFightModel } from "../../towertmain/model/TowerMainFightModel";
import { t_Box_Match } from "../../towertmain/proxy/t_Box_Match";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { FightUIFactory } from "../FightUIFactory";
import { EInnerSoundType, t_Inner_Sound } from "../t_Inner_Sound";
import { FightResultVo } from "../vos/FightResultVo";
import { HeroAvatarView } from "./HeroAvatarView";

/**战斗结算 */
export class FightResultView extends ViewBase{
    // protected autoFreeAtlas:boolean = true;
    private _data:FightResultVo;
    PageType:EPageType = EPageType.None;
    private _ui:ui.views.compose.ui_fight_resultUI;
    // protected mMaskClick:boolean = false;
    protected autoFree:boolean = true;
    protected mMask:boolean = true;
    // private okBtnCtl:ButtonCtl;
    private model:ComposeModel;
    private _succeed:NoContainerSimpleEffect;
    private _fail:SimpleEffect;
    private _heros:HeroAvatarView[];
    // private guideimg:ButtonCtl;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("fightresult.atlas");
    }
    private clearEffect(){
        if(this._succeed){
            this._succeed.dispose();
            this._succeed = null;
        }
        if(this._fail){
            this._fail.dispose();
            this._fail = null;
        }
        if(this._heros){
            while(this._heros.length){
                let cell = this._heros.shift();
                cell.dispose();
            }
            this._heros = null;
        }
    }

    protected onExit(): void {
        this.clearEffect();
        this.model.event(ComposeEvent.PvpFightResultExit);
    }
    
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_fight_resultUI();
            // this.okBtnCtl = ButtonCtl.CreateBtn(this._ui.okBtn,this,this.onOkHandler);
            // this.guideimg = ButtonCtl.CreateBtn(this._ui.guideimg,this,this.onGuideimgClick);
            GuideModel.Ins.on(EGuideEvent.Next,this,this.Close);
            this._ui.rewardList.itemRender = SoltItemView;
            this._ui.rewardList.renderHandler = new Laya.Handler(this,this.onRewardHandler);
        }
    }
    // private onGuideimgClick(){
    //     this.Close();
    // }

    private onRewardHandler(item:SoltItemView){
        item.setData(item.dataSource);
    }
    /**点击退出 */
    // private onOkHandler(){
    // this.Close();
    // }

    private clearView(){
        this.clearEffect();
        this._ui.winbg.visible = false;
        this._ui.failbg.visible = false;
        // this._ui.treasureIcon.visible = false;
        // this._ui.isfullImg.visible = false;
    }
    private onPlayEnd(){
        this._succeed.play(1,true);
    }
    protected onInit(): void {
        this._data = this.model.fightResultVo;
        if(!this._data){
            this.Close();
            return;
        }
        this.model.fightView.updateMonsterCount();
        this.clearView();

        FightUIFactory.setPlayer(this._ui.leftPlayer,this.model.ownerPlayer);
        this._ui.leftPlayer.bottomImg.skin = `remote/fight/bottom_lf.png`;
        FightUIFactory.setPlayer(this._ui.rightPlayer,this.model.enemyPlayer);

        // let _ownerIndex = this._data.datalist.findIndex(o=>o.playerId == MainModel.Ins.mRoleData.AccountId);
        let owner:stFightResult = this._data.owner;//this._data.datalist[_ownerIndex];
        let enemy: stFightResult = this._data.enemy;//this._data.datalist[_ownerIndex == 1 ? 0 : 1];
        TowerMainFightModel.Ins.boxIndex = owner.boxPos;

        this.toScore(this._ui.leftScoreTf,owner);
        this.toScore(this._ui.rightScoreTf,enemy);

        this._ui.rewardList.array = ItemViewFactory.cellValue2ItemVos(owner.itemList);

        //赢
        if (owner.win == 1) {
            t_Inner_Sound.Ins.play(EInnerSoundType.GameOverSucceed);
            this._ui.height = 677;

            //============================================
            // if (!this._succeed) {
            // this._succeed = new SimpleEffect(this._ui, `o/spine/succeed/WIN/win`, 322, 80);
            // }
            this._succeed = SpineEffectMgr.createNoSimpleEffect(`o/spine/succeed/WIN/win`,this._ui,322,80);
            this._succeed.play(0, false, this, this.onPlayEnd);
            //============================================

            // if(owner.boxIds.length <= 0){
            //     owner.boxIds.push(1);
            // }
            // owner.boxIds = [];

            this._ui.winbg.visible = true;

            if (owner.boxIds.length > 0) {
                //有宝箱
                let id = owner.boxIds[0];
                let cfg = t_Box_Match.Ins.getCfgById(id);
                //宝箱icon
                // this._ui.treasureIcon.skin = t_Box_Match.Ins.getSkinByQua(cfg.f_box_qua);
                // this._ui.treasureIcon.visible = true;

                let offsetX: number = 303;
                let offsetY: number = 630;
                let arr = System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.FIGHT_RESULT_HEROS).split("|");
                this._heros = [];
                for (let i = 0; i < arr.length; i++) {
                    let heroId: number = parseInt(arr[i]);
                    let _hero = FightFactory.createHeroAvatar(heroId, this._ui, offsetX + i * 80, offsetY);
                    this._heros.push(_hero);
                }
            }else{
                //没有宝箱
                // this._ui.isfullImg.visible = true;
            }
        }else{
            //失败
            t_Inner_Sound.Ins.play(EInnerSoundType.GameOverFail);
            this._ui.height = 590;
            this._ui.failbg.visible = true;
            if (!this._fail) {
                this._fail = new SimpleEffect(this._ui, `o/spine/succeed/Fail/8`, 322, 0);
            }
            this._fail.play(0,true);
        }
    }
    private toScore(lb:Laya.Label,vo:stFightResult){
        // let str:string = "";
        // let color:string = EFightUIColor.Green;//绿色
        // if(vo.trophy == 0){
        //     str = vo.trophy.toString();
        // }else{
        //     let sign:string = "";
        //     if (vo.win == 1) {
        //         sign = "+";
        //     }else{
        //         sign = "-"
        //         color = EFightUIColor.Red;//红色
        //     }
        //     str = `${sign}${vo.trophy}`;
        // }
        // lb.text = str;
        // lb.color = color;
        FightUIFactory.toScore(lb,vo);
    }
}
