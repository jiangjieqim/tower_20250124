import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { stFightResult } from "../../../../network/protocols/BaseProto";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { ComposeModel } from "../ComposeModel";
import { EFightReson } from "../EFightReson";
import { FightResultVo } from "../vos/FightResultVo";


/**战斗结算原因 
 * 
 * D:\Project1\Art\UI切图-神话塔防\29.战斗胜负公布
 *     <protobuf type="uint8" name="type" desc="结果类型 1怪物数量 2未击杀妖王 3妖王剩余血量 4优先击杀最终妖王"></protobuf>
 */
export class FightResonView extends ViewBase{
    // private _data:IFightReson;
    PageType:EPageType = EPageType.None;
    private model:ComposeModel;
    private _data:FightResultVo;
    private readonly offsetX:number = 375;
    private readonly offsetY:number = 265;
    private readonly _effectScale:number = 0.74;
    private _ui:ui.views.compose.ui_fight_resonUI;
    private fail:NoContainerSimpleEffect;
    private succeed:NoContainerSimpleEffect;
    // private titleCtl:ButtonCtl;
    protected autoFree:boolean = true;
    protected mHitFull:boolean = true;
    protected mMask:boolean = true;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }

    protected onExit(): void {
        this._ui.off(Laya.Event.CLICK,this,this.Close);
        GuideModel.Ins.off(EGuideEvent.Next,this,this.Close);
        this.disposeEffect();
        if(this.model.fightResultVo){
            E.ViewMgr.Open(EViewType.FightResult);
        }
        // GuideModel.Ins.event(EGuideEvent.REMOVE);
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_fight_resonUI();
            this._ui.on(Laya.Event.CLICK,this,this.Close);
            // this.titleCtl = ButtonCtl.CreateBtn(this._ui.title1,this,this.onTitle1Handler);
            GuideModel.Ins.on(EGuideEvent.Next,this,this.Close);
        }
    }
    // private onTitle1Handler(){
    // this.Close();
    // }
    private onPlayEnd(){
        this.succeed.play(1,true);
    }

    protected onShow(){
        super.onShow();
        // FightGuide.Ins.event(FightGuideEvent.FightResonShow);
    }

    protected onInit(): void {
        this.model.fightView.updateMonsterCount();
        if(!this.model.ownerPlayer){
            this.Close();
            return;
        }
        this._data = this.model.fightResultVo;
        if(!this._data){
            this.Close();
            return;
        }
        this.disposeEffect();
        this._ui.title1.visible = false;
        this._ui.title2.visible = false;
        this._ui.progress.visible = false;
        let owner:stFightResult = this._data.owner;
        //===============================================
        // let vo:FightResult_revc = this.Data;
       

        switch (this._data.type) {
            case EFightReson.MonsterCount:
                this._ui.title1.visible = true;
                this._ui.progress.visible = true;
                this._ui.title1.tf2.text = E.getLang("reson02");//怪物数量过多
                if (owner.win == 1) {
                    //赢
                    this._ui.progress.tf.strokeColor = "#42117D";
                    
                    //进度条
                    this._ui.progress.progress.skin = `remote/fight/jdt_s.png`;
                    this._ui.title1.bg2.skin = `remote/fight/bottom_sl_d2.png`;
                } else {
                    //输

                    //进度条
                    this._ui.progress.progress.skin = `remote/fight/jdt_s1.png`;
                    this._ui.title1.bg2.skin = `remote/fight/bottom_sb_d.png`;
                }

                let leftMax = this.model.ownerPlayer.maxMonster;
                let ownerNum = this._data.owner.monsterNum;
                this._ui.progress.tf.text = `${ownerNum}/${leftMax}`;
                let p = ownerNum/leftMax;
                if(p > 1){
                    p = 1;
                }else if(p == 0){
                    p = 0.01;
                }
                this._ui.progress.progress.width = 226 * p;
                break;
            case EFightReson.KillMBoss:
                //击杀妖王
                this._ui.title1.visible = true;
                this._ui.title1.tf2.text = E.getLang("reson04");//未击杀妖王
                break;
            case EFightReson.BossBlood:
                //妖王剩余血量高于
                this._ui.title2.visible = true;
                let str:string = ""

                if(owner.win){
                    str = "reson01";
                    this._ui.title2.tf1.text = E.getLang("reson03");
                }else{
                    str = "reson03";
                    this._ui.title2.tf1.text = E.getLang("reson01");
                }
                this._ui.title2.tf2.text = E.getLang("reson05") + E.getLang(str);
                break;
            case EFightReson.FirstKillBoss:
                //优先击杀最终妖王
                this._ui.title2.visible = true;
                if(owner.win){
                    this._ui.title2.tf1.text = E.getLang("reson01");
                }else{
                    this._ui.title2.tf1.text = E.getLang("reson03");
                }
                this._ui.title2.tf2.text = E.getLang("reson06");
                break;
            default:
                this.Close();
                return;
        }

        if(owner.win == 1){
            //赢
            this._ui.bg1.skin = "";//`remote/fightresult/img_sl.png`;
            this.succeed = SpineEffectMgr.createNoSimpleEffect(`o/spine/succeed/WIN/win`,this._ui,this.offsetX,this.offsetY + 60,0,this._effectScale);
            this.succeed.play(0, false, this, this.onPlayEnd);
            // this.succeed = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/WIN/win`,this._ui,this.offsetX,this.offsetY + 31,0,0,this._effectScale);
        
            this._ui.title1.tf1.text = E.getLang("reson03");//敌方

            this._ui.title1.tf1.strokeColor = "#42117D";
            this._ui.title1.tf2.strokeColor = "#42117D";
            this._ui.progress.tf.strokeColor = "#42117D";
            this._ui.title2.tf1.strokeColor = "#42117D";
            this._ui.title2.tf2.strokeColor = "#42117D";
            this._ui.title2.bg2.skin = `remote/fight/bottom_yw_d1.png`;

        }else{
            //输
            this.fail = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/Fail/8`, this._ui, this.offsetX, this.offsetY, 0, 0, this._effectScale);
            this._ui.bg1.skin = `remote/fightresult/img_shibai_1.png`;
        
            this._ui.title1.tf1.text = E.getLang("reson01");//我方

            this._ui.title1.tf1.strokeColor = "#A10D02";
            this._ui.title1.tf2.strokeColor = "#A10D02"
            this._ui.progress.tf.strokeColor = "#A10D02";
            this._ui.title2.tf1.strokeColor = "#A10D02";
            this._ui.title2.tf2.strokeColor = "#A10D02";
            this._ui.title2.bg2.skin = `remote/fight/bottom_yw_d.png`;
        }

    }

    private disposeEffect(){
        if(this.fail){
            this.fail.dispose();
            this.fail = null;
        }
        if(this.succeed){
            this.succeed.dispose();
            this.succeed = null;
        }
    }
    
}