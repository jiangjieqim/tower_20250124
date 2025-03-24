import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { PveMultiReward_req, stCellValue, stPlayerInRoom } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { TeQuanKaModel } from "../../activity/tequanka/TeQuanKaModel";
import { ISimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ESystemRefreshTime } from "../../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { SoltItemView } from "../../main/views/icon/SoltItemView";
import { ECellType } from "../../main/vos/ECellType";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightUIFactory } from "../FightUIFactory";
import { EBattle_Config, t_Battle_Config } from "../t_Battle_Config";
import { FightResultVo } from "../vos/FightResultVo";
/**合作结算 
 * 
 * 2倍 3倍 可以都不勾选
 * 只有一个被勾选着
 * 2倍需要看广告的时候先看广告
*/
export class FrientFightResultView extends ViewBase{
    protected mHitFull:boolean = true;
    protected autoFree:boolean = true;
    protected mMask:boolean = true;
    private timeCtl:TimeCtl;
    private _ui:ui.views.compose.ui_frient_fight_resultUI;
    private _data:FightResultVo;
    private _succeed:ISimpleEffect;
    private okBtn:ButtonCtl;
    private adCk:CheckBoxCtl;
    private lifeTimeCk:CheckBoxCtl;
    private get model(){
        return ComposeModel.Ins;
    }
    /**是否已经看过广告 */
    private isWatchAD:boolean = false;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        // this.addAtlas("fight.atlas");
        this.addAtlas("fightresult.atlas");
    }
    private clearEffect(){
        if(this._succeed){
            this._succeed.dispose();
            this._succeed = null;
        }
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        // Laya.Loader.clearTextureRes(this._ui.bg.skin);
        this.clearEffect();
        if(this.okBtn){
            this.okBtn.dispose();
            this.okBtn = null;
        }
        if(this.adCk){
            this.adCk.dispose();
            this.adCk = null;
        }
        if(this.lifeTimeCk){
            this.lifeTimeCk.dispose();
            this.lifeTimeCk = null;
        }
        if(this.timeCtl){
            this.timeCtl.dispose();
            this.timeCtl = null;
        }
        // MainModel.Ins.enterMainScene();
        this.model.event(ComposeEvent.EnterMainScene);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.compose.ui_frient_fight_resultUI();
            this.okBtn = ButtonCtl.CreateBtn(this._ui.okBtn,this,this.onOkHandler);

            ValCtl.Create(this._ui.money1.lab,this._ui.money1.icon,ECellType.TILI,this._ui.money1.sp);

            this._ui.rewardList.itemRender = SoltItemView;
            this._ui.rewardList.renderHandler = new Laya.Handler(this,this.onRewardHandler);

            this.adCk = new CheckBoxCtl(this._ui.ck0);
            this.adCk.selectHander = new Laya.Handler(this,this.onAdCkSelect);
            this.adCk.selected = false;
            
            this.lifeTimeCk = new CheckBoxCtl(this._ui.ck1);
            this.lifeTimeCk.selectHander = new Laya.Handler(this,this.onLifetimeCk);
            // this.ck1.checkHandler = new Laya.Handler(this,this.onCheckHandler);
            this.lifeTimeCk.selected = false;
            this.timeCtl = new TimeCtl();
        }
    }

    private onOkHandler(){
        let multi:number = 0;
        if(this.adCk.selected){
            multi = 2;
        }
        else if(this.lifeTimeCk.selected){
            multi = 3;
        }
        if(multi > 0){
            let req = new PveMultiReward_req();
            req.multi = multi;
            req.roomId = this.model.rootId;
            SocketMgr.Ins.SendMessageBin(req);
        }
        this.Close();
    }

    private onCheckHandler(){
        if(!TeQuanKaModel.Ins.isOpenZSK()){
            E.ViewMgr.ShowMidError(E.getLang("err01"));
            return false;
        }
        return true;
    }

    /**
     *  0    
     *      没有终生卡
     *      首次打开不勾选
     *      勾选的时候 开始播放广告 除了播放结束退出后勾选 其他都不勾选
     *      
     *      有终生卡 随便钩
     * 
     *  1
     *      如果没开终生卡 tf02  ck1灰掉 无法点击
     *      如果开了终生卡 tf03隐藏掉
     *      
     *  2   满足 
     *
     * 
     * 
     * 
     * 
     * 
     */
    private onAdCkSelect(sel: boolean) {
        // LogSys.Log(`ck0 is ${this.adCk.selected}`);
        this.updateReward();

        if (E.sdk.canFreeLook) {

            if (sel) {
                if (this.lifeTimeCk.selected) {
                    this.lifeTimeCk.selected = false;
                }
            }
            return;
        }
        if (this.isWatchAD) {
            return;
        }
        if (sel) {
            const _watchKey: string = "FrientFightResult";
            E.sendTrack("ad_watch",{type:_watchKey});
            E.sdk.lookVideo((type: 0 | 1 | 2) => {
                let _sel:boolean = false;
                switch (type) {
                    case 0:
                        // ⽤户未看完取消
                        // this.adCk.selected = false;
                        break;
                    case 1:
                        // ⽤户看完⼴告
                        E.sendTrack("ad_finish",{type:_watchKey});
                        this.isWatchAD = true;
                        // this.adCk.selected = true;
                        _sel = true;
                        break;
                    case 2:
                        // 拉取⼴告错误
                        // this.adCk.selected = false;
                        break;
                }
                if(this.adCk){
                    this.adCk.selected = _sel;
                }else{
                    LogSys.Warn(`adCk is dispose...`);
                }

            });
        }
    }

    /**倍率 */
    private get multiplyingPower(){
        let p:number = 1;
        if(this.adCk.selected){
            p = 2;
        }else if(this.lifeTimeCk.selected){
            p = 3;
        }
        return p;
    }

    private convertItems(){
        let _l:stCellValue[] = [];
        let result:stCellValue[] = this._data.owner.itemList;
        let p = this.multiplyingPower;

        for(let i = 0;i < result.length;i++){
            let o = result[i];    
            let cell = new stCellValue();
            cell.count = o.count * p;
            cell.id = o.id;
            _l.push(cell);
        }        
        return _l;
    }

    private updateReward(){
        let l = this.convertItems();
        this._ui.rewardList.array = ItemViewFactory.cellValue2ItemVos(l);
    
        let p = this.multiplyingPower;
        let n:number = p - 1;
        if(n<=0){
            this._ui.phyimg.visible = false;
        }
        else{
            this._ui.phyimg.visible = true;
            
            let str:string = t_Battle_Config.Ins.getValueById(EBattle_Config.PVE_PHYSICAL_POWER);
            let itemVo = ItemViewFactory.convertItem(str);
            this._ui.itemicon.skin = IconUtils.getIconByCfgId(itemVo.cfgId);
            this._ui.countTf.text = `x${n * itemVo.count}`;
        }
    }

    /*
奖励勾选领取逻辑：（冰河补充）
战斗结算时，默认不勾选。注：不勾选代表1倍奖励。进入这个界面的时候其实已经发给玩家了，
2倍获取奖励：点击勾选，会进行两次判定。
1、首先判定是否已经在这个界面之前看过了广告（需要完整看完才算），如果在该界面已经完整观看完广告则直接勾选上
2、如果未观看过广告，则判定玩家是否为月卡/终身卡会员，如果是其中1个，则跳过广告，直接勾选上。
3、如果玩家即没看过广告，又不是其中一个会员，则跳转观看广告。
4、完整观看完广告，返回游戏，勾选上2倍获取奖励。如果没有观看完广告（中途退出），则回到该界面，不进行勾选，如果再次点击2倍获取奖励，则重新从1开始判断。
3倍获取奖励：勾选条件为激活了终身卡，如果没激活，则三倍领取置灰，点击无反应。显示（激活终身卡解锁）
如果激活，则三倍领取按钮可以点击，“激活终身卡解锁”的提示消失。

勾选互斥逻辑：
1、如果已经选择了2倍奖励，再次点击3倍奖励
情况1：玩家未激活终身卡，弹出提示同上：“需激活终身卡解锁3倍奖励特权。”，此时仍然勾选2倍奖励
情况2：玩家已激活终身卡，则勾选状态发生变化，2倍奖励的勾选取消，3倍奖励为勾选状态。

2、如果已经选择了2倍奖励，此时再点击2倍奖励，则2倍奖励勾选状态取消。当前无勾选状态。

3、如果已经选择了3倍奖励，此时再点击3倍奖励，则3倍奖励勾选状态取消。当前无勾选状态。（同上）

4、1、如果已经选择了3倍奖励，再次点击2倍奖励。则勾选状态发生变化，3倍奖励的勾选取消，2倍奖励为勾选状态。（因为能勾选3倍奖励的玩家，一定解锁了终身卡，所以点击2倍奖励不需要看广告）

    */
    /**终生卡选项 */
    private onLifetimeCk(sel:boolean){
        if(sel){
            if(this.adCk.selected){
                this.adCk.selected = false;
            }
        }
        this.updateReward();
        // LogSys.Log(`ck1 is ${this.ck1.selected}`);
    }

    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this.model.fightView.updateMonsterCount();
        this.isWatchAD = false;
        let _data = this.model.fightResultVo;
        this._data = _data;
        if(!this._data){
            this.Close();
            return;
        }

        if(     this._data.data.newGuide == 1 
            || this.model.ownerPlayer.playerLevel < parseInt(System_RefreshTimeProxy.Ins.getVal(92))
            || this.model.fightTypeAdaper.cfg.f_hide_wactAD
            )
        {
            this._ui.bot.visible = false;
        }else{
            this._ui.bot.visible = true;
        }

        this.clearEffect();
        this._succeed = SpineEffectMgr.createNoSimpleEffect(`o/spine/succeed/WIN/win`, this._ui.bg, this._ui.bg.width / 2,90);
        this._succeed.play(0, false, this, this.onPlayEnd);

        if(TeQuanKaModel.Ins.isOpenZSK()){
            this._ui.tf03.visible = false;
            
            this.lifeTimeCk.disable = false;
            this.lifeTimeCk.gray = false;
            
            this._ui.tf02.gray = false;
        }else{
            this._ui.tf03.visible = true;
            
            this.lifeTimeCk.disable = true;
            this.lifeTimeCk.gray = true;

            this._ui.tf02.gray = true;
        }
        //===================================================================================
        this.refreshPlayer(this._ui.owner,this.model.ownerPlayer);
        this.refreshPlayer(this._ui.enemy,this.model.enemyPlayer);
        this._ui.nameTf0.text = this.model.ownerPlayer.nickName;
        this._ui.nameTf1.text = this.model.enemyPlayer.nickName;

        this.updateReward();

        let time = parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.PveCloseTime));
        this.timeCtl.start(time,undefined,new Laya.Handler(this,this.onTimeEndClose));
        //===================================================================================
        this.updateKillNum(_data.owner.killNum,_data.enemy.killNum);

        this._ui.waveTf.text = _data.data.wave + "";

        if(_data.owner.isBest){
            this._ui.bestImg.visible = true;
        }else{
            this._ui.bestImg.visible = false;
        }
    }

    private onTimeEndClose(){
        this.Close();
    }

    private updateKillNum(m:number,n:number){
        if(m == 0 && n == 0){
            m = 1;
            n = 1;
        }
        let all = m + n;
        const per:number = 100;
        let a = Math.floor(m/all*per);
        let b = per - a;
        this._ui.lb0.text = a+"%";
        this._ui.lb1.text = b+"%";
 
        let progress:ui.views.compose.fightcell.ui_friend_fight_progessUI = this._ui.gongxiandu;
        progress.b0.width = progress.width * (a/100)
        progress.b1.width = progress.width - progress.b0.width;
        progress.b1.x = progress.b0.width;
        progress.b2.x = progress.b0.width - progress.b2.width/2;
    }

    private refreshPlayer(skin:ui.views.compose.fightcell.fight_top_headUI,vo:stPlayerInRoom){
        FightUIFactory.setHerdIcon(skin.headicon,vo.headUrl);
        skin.scroeTf.text = vo.trophy+"";
    }

    private onRewardHandler(item:SoltItemView){
        item.setData(item.dataSource);
    }

    private onPlayEnd() {
        this._succeed.play(1, true);
    }

}