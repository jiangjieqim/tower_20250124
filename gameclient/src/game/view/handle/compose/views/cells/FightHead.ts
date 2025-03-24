import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { stPlayerInRoom } from "../../../../../network/protocols/BaseProto";
import { MainModel } from "../../../main/model/MainModel";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { FightUIFactory } from "../../FightUIFactory";
import { FightUtils } from "../../FightUtils";
import { HeartComponent } from "../HeartComponent";

export interface IFightHeadSkin extends Laya.Sprite {
    scroeTf: Laya.Label;
    timeTf: Laya.Label;
}

interface IFightPlayerSkin{
    leftplayer: ui.views.compose.ui_fightplayer_lUI;
    rightplayer: ui.views.compose.ui_fightplayer_rUI;
}
/**顶部头像接口 */
export abstract class IFightHead{
    protected destroyed:boolean;
    /**设置波次 */
    abstract wave:number;
    /**设置倒计时 */
    abstract subTime:number;
    abstract init(container:Laya.Sprite):void;
    /**更新怪物数量 */
    abstract updateMonsterCount(owner: number, pvp: number) ;
    /**更新头像信息 */
    protected abstract onUpdateRoom();
    abstract onShow();
    abstract onCenter();
    protected onInit(){
        this.destroyed = false;
        this.model.on(ComposeEvent.RoomInfoUpdate,this,this.onUpdateRoom);
        this.onUpdateRoom();
    }

    protected get model() {
        return ComposeModel.Ins;
    }

    /**销毁 */
    dispose(){
        this.destroyed = true;
        this.model.off(ComposeEvent.RoomInfoUpdate,this,this.onUpdateRoom);
    }
}

export class FightHeadCtl extends IFightHead{
    protected skin: IFightHeadSkin;
    private btn:ButtonCtl;
    private playerSkin:IFightPlayerSkin;
    constructor(){
        super();
        this.skin = new ui.views.compose.fightcell.ui_fight_top0UI();
    }
    set wave(_wave: number) {
        this.skin.scroeTf.text = E.getLang("waveCount", _wave);
    }

    set subTime(sub: number) {
        this.skin.timeTf.text = TimeUtil.subTimeHMS_EN(sub);
    }

    onShow(){

    }

    private onLeftClick(){

    }
    init(container: Laya.Sprite) {
        container.addChildAt(this.skin,0);
        this.playerSkin = this.skin as any;
        this.btn = ButtonCtl.CreateBtn(this.playerSkin.leftplayer,this,this.onLeftClick,false);
        // this.model.on(ComposeEvent.PvpRoundHpUpdate,this,this.onHp);
        // this.onHp();
        this.onInit();
    }
    // private onHp(){
    //     let ui:ui.views.compose.fightcell.ui_fight_top0UI = this.skin as any;
    //     this.updateHeart(this.model.ownerPlayer,ui.l_herart);
    //     this.updateHeart(this.model.enemyPlayer,ui.r_herart);
    // }

    private updateHeart(player:stPlayerInRoom,heart:HeartComponent){
        if(player){
            let vo = this.model.hpList.find(o=>o.playerId == player.playerId);
            let vo1 = this.model.maxHpList.find(o=>o.playerId == player.playerId);
            if(vo1){
                heart.maxHp = vo1.hp;
            }
            if(vo){
                heart.value = vo.hp;
            }
        }
    }
    protected onUpdateRoom(){
        this.setPlayer(this.playerSkin.leftplayer.head, this.model.ownerPlayer);
        this.setPlayer(this.playerSkin.rightplayer.head, this.model.enemyPlayer);

        this.playerSkin.leftplayer.nameTf.text = FightUIFactory.convertNickName(this.model.ownerPlayer);
        this.playerSkin.rightplayer.nameTf.text = FightUIFactory.convertNickName(this.model.enemyPlayer);
    }
    
    // /**显示隐藏红心 */
    // set heart(v:boolean){
    //     let ui:ui.views.compose.fightcell.ui_fight_top0UI = this.skin as any;
    //     ui.l_herart.visible = ui.r_herart.visible = v;
    // }
    private setPlayer(skin: ui.views.compose.fightcell.fight_top_headUI, vo: stPlayerInRoom) {
        if (vo){
            let url = MainModel.Ins.convertHead(vo.headUrl);
            MainModel.Ins.setTTHead(skin.headicon, url);
            skin.scroeTf.text = vo.trophy + "";
        }
    }

    public updateMonsterCount(owner: number, pvp: number) {
        let leftMax = this.model.ownerPlayer.maxMonster;
        let rightMax = this.model.enemyPlayer.maxMonster;

        let cur: number = owner;
        let other: number = pvp;
        
        this.model.showErrTips(cur, leftMax);

        this.playerSkin.leftplayer.enemyTf.text = `${cur}/${leftMax}`;

        this.playerSkin.rightplayer.enemyTf.text = `${other}/${rightMax}`;
        let w:number = 201;
        this.playerSkin.leftplayer.progress.width = FightUtils.convertProgressVal(w,cur, leftMax);
        this.playerSkin.rightplayer.progress.width = FightUtils.convertProgressVal(w,other, rightMax);
    }

    dispose(){
        super.dispose();
        // this.model.off(ComposeEvent.PvpRoundHpUpdate,this,this.onHp);
        // this.model.off(ComposeEvent.RoomInfoUpdate,this,this.onUpdateRoom);
        this.skin.removeSelf();
        if(this.btn){
            this.btn.dispose();
            this.btn = null;
        }
    }
    
    onCenter(){
        
    }
}