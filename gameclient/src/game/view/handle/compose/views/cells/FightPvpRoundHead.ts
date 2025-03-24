import { GameTex } from "../../../../../../frame/view/GameList";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { PvpTurnBasedMonsterNum_revc, stPlayerInRoom } from "../../../../../network/protocols/BaseProto";
import { System_RefreshTimeProxy } from "../../../main/ctl/System_RefreshTimeProxy";
import { MainModel } from "../../../main/model/MainModel";
import { EPVPRoundFightStatus } from "../../adapter/FightAdapter";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { FightUIFactory } from "../../FightUIFactory";
import { FightUtils } from "../../FightUtils";
import { IFightHead } from "./FightHead";
/**屏幕中心信息栏 */
export class FightPvpRoundCenter extends ui.views.compose.fightcell.ui_fight_pvpround_centerUI{
    private initProW:number = 0;
    constructor(){
        super();
        this.initProW = this.pro0.width;
        ButtonCtl.CreateBtn(this.owner,this,this.onOwnerClick);
    }
    private onOwnerClick(){
        
    }
    /**设置为战斗状态中 */
    set fightStatus(v:boolean){
        if(v){
            // this.herart0.visible = this.herart1.visible = false;
            this.owner.visible = this.enemy.visible = true;
        }else{
            // this.herart0.visible = this.herart1.visible = true;
            this.owner.visible = this.enemy.visible = false;
        }
    }
    
    /**更新进度条 */
    updateProgress(cur:number,other:number,leftMax:number,rightMax:number){
        this.cntTf0.text = `${cur}/${leftMax}`;
        this.cntTf1.text = `${other}/${rightMax}`;
        let w: number = this.initProW;
        this.pro0.width = FightUtils.convertProgressVal(w, cur, leftMax);

        let p1w = FightUtils.convertProgressVal(w, other, rightMax);
        this.pro1.width = p1w;
        this.pro1.x = w - p1w;
    }

    setLeft(cur:number,max:number){
        this.cntTf0.text = `${cur}/${max}`;
        let w: number = this.initProW;
        this.pro0.width = FightUtils.convertProgressVal(w, cur, max);
        if(cur <=0){
            this.pro0.visible = false;
        }else{
            this.pro0.visible = true;
        }
    }

    setRight(cur:number,max:number){
        this.cntTf1.text = `${cur}/${max}`;
        let w: number = this.initProW;
        this.pro1.width = FightUtils.convertProgressVal(w, cur, max);
        this.pro1.x = w - this.pro1.width;
        if(cur <=0){
            this.pro1.visible = false;
        }else{
            this.pro1.visible = true;
        }
    }

    init(){
        this.timeImg.visible = this.timeTf.visible = ComposeModel.Ins.curAdapter.bPvproundTime;
        this.cntTf0.text = `0/0`;
        this.pro0.width = this.initProW;
        this.cntTf1.text = `0/0`;
        this.pro1.width = this.initProW;
    }
}

/**pvp回合制制顶部头像栏 */
export class FightPvpRoundHead extends IFightHead { 
    private skin: ui.views.compose.fightcell.ui_fight_pvpround_topUI;
    constructor() {
        super();
        this.skin = new ui.views.compose.fightcell.ui_fight_pvpround_topUI();
    }
    init(container: Laya.Sprite): void {
        // throw new Error("Method not implemented.");
        container.addChildAt(this.skin, 0);
        this.onInit();
        if(this.model.ownerPlayer){
            this.skin.herart0.playerId = this.model.ownerPlayer.playerId;
            this.skin.herart1.playerId = this.model.enemyPlayer.playerId;
        }
        this.skin.centerView.init();
        this.model.on(ComposeEvent.PvpRoundStatusChange,this,this.onPvpRoundStatusChange);
        this.model.on(ComposeEvent.PvpTurnBasedMonsterNum,this,this.onPvpTurnBasedMonsterNum);
        this.onPvpTurnBasedMonsterNum(this.model.ownerMonster);
        this.onPvpTurnBasedMonsterNum(this.model.enemyMonster);
    }

    private onPvpTurnBasedMonsterNum(revc: PvpTurnBasedMonsterNum_revc) {
        if (revc) {
            //剩余数量 / 总数
            if (revc.playerId == this.model.ownerPlayer.playerId) {
                let cur = revc.total - revc.killNum;
                this.skin.centerView.setLeft(cur, revc.total);
            } else {
                let cur = revc.total - revc.killNum;
                this.skin.centerView.setRight(cur, revc.total);
            }
        }
    }

    onShow(){
        this.onCenter();
    }

    onCenter(){
        if(!this.destroyed){
            let _fightView = this.model.fightView;
            if (_fightView && _fightView.displayedInStage) {
                let pos1 = _fightView.getCenterXY();
                let pos2 = (this.skin.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.skin.x, this.skin.y));
                this.skin.centerView.y = pos1.y - pos2.y - this.skin.centerView.height/2;
                //====================================================================================
                this.onPvpRoundStatusChange();
            } else {
                LogSys.Warn(`onCenter fight is not in stage!`);
            }
        }
    }

    updateMonsterCount(cur: number, other: number) {
        if(this.model.curAdapter.isGuide){       
            let leftMax = this.model.ownerPlayer.maxMonster;
            let rightMax = this.model.enemyPlayer.maxMonster;
            this.model.showErrTips(cur, leftMax);
            this.skin.centerView.updateProgress(cur,other,leftMax,rightMax);
        }
    }

    set wave(_wave: number) {
        this.skin.centerView.waveTf.text = E.getLang("round",_wave);
    }
    set subTime(sub: number) {
        this.skin.centerView.timeTf.text = TimeUtil.subTimeHMS_EN(sub);
        let checkLimit:number = parseInt(System_RefreshTimeProxy.Ins.getVal(109))/1000;
        if(sub < checkLimit){
            this.skin.centerView.timeTf.color = "#ff0000";
            // this.skin.centerView.timeTf.scaleX = this.skin.centerView.timeTf.scaleY = 1.2;
        }else{
            this.skin.centerView.timeTf.color = "#ffffff";
            // this.skin.centerView.timeTf.scaleX = this.skin.centerView.timeTf.scaleY = 1.0;
        }
    }
    protected onUpdateRoom() {
        this.updatePlayer(this.model.ownerPlayer, 0);
        this.updatePlayer(this.model.enemyPlayer, 1);
    }
    
    private onPvpRoundStatusChange(){
        let status:EPVPRoundFightStatus = this.model.fightTypeAdaper.pvpRoundStatus;
        // LogSys.Log(`当前的pvpround状态:${status}`);
        // status = 1;
        switch(status){
            case EPVPRoundFightStatus.Ready:
            case EPVPRoundFightStatus.SelfReadyComplete:
                //备战状态
                this.skin.herart0.pos(this.skin.centerView.x + 23, this.skin.centerView.y + 6);
                this.skin.herart1.pos(this.skin.centerView.x + 498, this.skin.centerView.y + 6);
                this.skin.centerView.fightStatus = false;
                // this.skin.herart0.visible = this.skin.herart1.visible = false;
                break;
            default:
                this.skin.herart0.pos(84,62);
                this.skin.herart1.pos(451,62);
                this.skin.centerView.fightStatus = true;
                // this.skin.herart0.visible = this.skin.herart1.visible = true;
                break;
        }
    }
    private updatePlayer(vo: stPlayerInRoom, k: number) {
        if (vo) {
            let img: GameTex = this.skin[`headicon${k}`]
            let scroeTf: Laya.Label = this.skin[`scroeTf${k}`];
            let nameTf: Laya.Label = this.skin[`nameTf${k}`];
            let url = MainModel.Ins.convertHead(vo.headUrl);
            MainModel.Ins.setTTHead(img, url);
            scroeTf.text = vo.trophy + "";
            nameTf.text = FightUIFactory.convertNickName(vo);
        }
    }
    dispose(){
        super.dispose();
        this.skin.removeSelf();
        this.model.off(ComposeEvent.PvpTurnBasedMonsterNum,this,this.onPvpTurnBasedMonsterNum);
        this.model.off(ComposeEvent.PvpRoundStatusChange,this,this.onPvpRoundStatusChange);
    }
}