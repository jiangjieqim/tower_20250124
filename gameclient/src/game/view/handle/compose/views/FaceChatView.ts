// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
// import { ITabControl, ITabSelectStyle, TabControlFactory } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { E, ScreenAdapter } from "../../../../G";
import { FightChat_revc } from "../../../../network/protocols/BaseProto";
import { BaseCfg } from "../../../../static/json/data/BaseCfg";
import { ISimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ComposeModel } from "../ComposeModel";
import { EBattle_Config, t_Battle_Config } from "../t_Battle_Config";
import { EFightMode } from "../vos/EFightEnum";

enum EFightFace{
    Face = 1,
    Txt = 2,
}

export class t_Battle_Communication extends BaseCfg{
    public GetTabelName(): string {
        return t_Battle_Communication.NAME;
    }
    // private static _ins: t_Battle_Communication;
    // public static get Ins() {
    //     if (!this._ins) {
    //         this._ins = new t_Battle_Communication();
    //     }
    //     return this._ins;
    // }
    static NAME:string = "t_Battle_Communication";
    getByType(mode:EFightMode,type:number){
        let l:Configs.t_Battle_Communication_dat[] = this.List;
        let resultList = [];
        for(let i = 0;i < l.length;i++){
            let cfg = l[i];
            if(cfg.f_type == type && cfg.f_battle_type == mode){
                resultList.push(l[i]);
            }
        }
        return resultList;
    }
}

class SmallFaceSkin extends Laya.Sprite{

    private _effect:ISimpleEffect;
    private cfg:Configs.t_Battle_Communication_dat;
    useMouse:boolean = true;
    constructor(){
        super();
        this.width = this.height = 98;
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        DebugUtil.draw(this);
        if(this.useMouse){
            this.on(Laya.Event.CLICK,this,this.onClickHandler);
        }
    }

    private onClickHandler(e:Laya.Event){
        ComposeModel.Ins.sendChat(this.cfg.f_id);
    }

    refresh(cfg:Configs.t_Battle_Communication_dat,animIndex:number){
        this.cfg = cfg;
        this.disposeEffect();
        let id = cfg.f_face;
        this._effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/face/${id}/${id}`,this,this.width/2,this.height,animIndex);
    }

    private onDisplay(){
    }

    private onUnDisplay(){
        this.disposeEffect();
    }
    private disposeEffect(){
        if(this._effect){
            this._effect.dispose();
            this._effect = null;
        }
    }

    dispose(){
        this.removeSelf();
    }
}

class FaceTxtSkin extends ui.views.compose.fightcell.ui_fight_chat_txt01UI{
    cfg:Configs.t_Battle_Communication_dat;
    constructor(){
        super();
        this.on(Laya.Event.CLICK,this,this.onClickHandler);
    }
    private onClickHandler(){
        ComposeModel.Ins.sendChat(this.cfg.f_id);
    }

}

/**表情 */
class SmallFaceNode extends RowMoveBaseNode{
    protected clsKey: string = "SmallFaceNode";
    protected createSkin(){
        return Laya.Pool.getItemByClass(this.clsKey, SmallFaceSkin);
    }
    protected createNode(index: any) {
        let _skin:SmallFaceSkin = this.createSkin();
        let cfg:Configs.t_Battle_Communication_dat = this.list[index];
        _skin.refresh(cfg,0);
        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}

/**文字描述 */
class FightSmallTxt extends RowMoveBaseNode{
    protected clsKey: string = "FightTxt";
    protected createNode(index: any) {
        let _skin:FaceTxtSkin = this.createSkin();
        let cfg:Configs.t_Battle_Communication_dat = this.list[index];
        _skin.cfg = cfg;
        _skin.tf.text = cfg.f_text;
        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }

    protected createSkin(){
        return Laya.Pool.getItemByClass(this.clsKey,FaceTxtSkin);
    }
}
export interface IChatPopView extends Laya.Sprite{
    play();
    setData(_data:FightChat_revc);
}

/**弹出的表情特效 */
export class ChatPopView extends ui.views.compose.fightcell.ui_chat_popUI{
    static clsKey: string = "ChatPopView";
    private _data:FightChat_revc;
    private face:SmallFaceSkin;
    private tween:Laya.Tween;
    private cfg:Configs.t_Battle_Communication_dat;
    private ox:number;
    private oy:number;
    constructor(){
        super();
        this.tween = new Laya.Tween();
    }

    setData(_data:FightChat_revc){
        this._data = _data;
        let cfg:Configs.t_Battle_Communication_dat = E.tableMgr.getTable(t_Battle_Communication.NAME).GetDataById(_data.fid);
        this.cfg = cfg;
        this.tf.visible = false;
        if(this.face){
            this.face.dispose();
            this.face = null;
        }
        
        switch(cfg.f_type){
            case EFightFace.Txt:
                this.tf.visible = true;
                this.bg.width = 200;
                this.bg.height = 70;      
                this.tf.text = cfg.f_text;
                break;
            case EFightFace.Face:
                this.bg.width = 138;
                this.bg.height = 96;
                this.face = new SmallFaceSkin();
                this.face.useMouse = false;
                this.face.pos((this.bg.width-this.face.width)/2,-10);
                let animIndex:number = 0;
                if(cfg.f_revert && _data.playerId != this.model.ownerPlayer.playerId){
                    animIndex = 1;
                }
                this.face.refresh(cfg,animIndex);
                DebugUtil.draw(this.bg,"#ffff00");
                this.bg.addChild(this.face);
                break;
        }
        //=========================================================
        let ox:number = 0;
        let oy:number = 150;
        if(_data.playerId == this.model.ownerPlayer.playerId){
            this.bg.scaleX = 1;
            ox = 100;

            if(cfg.f_type == EFightFace.Face){
                ox -= 20;
                oy += 10;
            }
            
        }else{
            ox = 120;
            this.bg.scaleX = -1;
            ox = ScreenAdapter.UIRefWidth - ox - 180;

            if(cfg.f_type == EFightFace.Face){
                ox += 20;
                oy += 10;
            }
        }

        this.ox = ox;
        this.oy = oy + (this.model.fightTypeAdaper.cfg.f_chat_y||0);
    }

    play(){

        this.pos(this.ox,this.oy);
        this.tween.clear();
        this.img.scaleX = this.img.scaleY = 0.1;
        this.tween.to(this.img,{scaleX:1,scaleY:1},250);
        let time:number = parseInt((t_Battle_Config.Ins.getValueById(EBattle_Config.ChatLimitTime) as string).split("|")[0]);
        Laya.timer.once(time,this,this.dispose);
    }

    dispose(){
        Laya.Pool.recover(ChatPopView.clsKey,this);
        if(this.parent){
            this.removeSelf();
        }
    }

    private get model(){
        return ComposeModel.Ins;
    }
}

export interface IFaceChatVo{
    /**按钮容器 */
    con:Laya.Sprite;
    /**对其方式 */
    algin:string;
}

/**局内聊天 */
export class FaceChatView extends ViewBase {
    private openData:IFaceChatVo;
    PageType: EPageType = EPageType.None;
    protected mMask: boolean = true;
    protected maskAlpha: number = 0.0;
    private _ui: ui.views.compose.ui_fight_chatUI;
    private panelCtl: ScrollPanelControl;
    private _tabCtl: ITabControl;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        // this.addAtlas("fight.atlas");
    }
    // private get model() {
    //     return ComposeModel.Ins;
    // }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this._tabCtl.selectIndex = -1;
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.ui_fight_chatUI();
            this.panelCtl = new ScrollPanelControl();
            this.panelCtl.init(this._ui.panel1);

            this._tabCtl = TabControl.createTabCtl([this._ui.t0, this._ui.t1],
                [
                    { color: "#FFFFFF", strokeColor: "#953f00", skin: "remote/fight/btn_s.png" } as ITabSelectStyle,
                    { color: "#FFE8DF", strokeColor: "#8A4E37", skin: "remote/fight/btn_n.png" } as ITabSelectStyle,
                ],
                new Laya.Handler(this, this.onSelectHandler), E.getLang("chattabs")
            );
        }
    }

    private get model(){
        return ComposeModel.Ins;
    }
    private onSelectHandler(index: number) {
        // LogSys.Log(index);
        let mode = this.model.fightTypeAdaper.mode;
        let tb:t_Battle_Communication = E.tableMgr.getTable(t_Battle_Communication.NAME);
        let l = tb.getByType(mode,index + 1);
        this.panelCtl.clear();
        switch(index){
            case 0:
                this.panelCtl.split(l,SmallFaceNode,undefined,0,2);
                break;
            case 1:
                this.panelCtl.split(l,FightSmallTxt);
                break;
        }
        this.panelCtl.end();
    }

    protected onInit(): void {
        this.openData = this.Data;
        this._tabCtl.selectIndex = 0;
    }

    protected SetCenter(): void {
        if (this.UI && !this.UI.destroyed) {
            this.UI.anchorX = this.UI.anchorY = 0.5;
            let ox:number = (this.ViewParent.width / 2) + ScreenAdapter.UIRefWidth / 2 - this.UI.width / 2;

            let oy:number = this.ViewParent.height >> 1;
            // if(this.model.composeView){
            if(this.openData){
                
                if(this.openData.algin == "left"){
                    ox = this.ViewParent.width / 2 - ScreenAdapter.UIRefWidth / 2 + this.UI.width / 2;
                }
                let btn = this.openData.con;
                // this.model.composeView._chatBtn;
                if(btn && btn.parent){
                    let pos = (btn.parent as Laya.Sprite).localToGlobal(new Laya.Point(btn.x, btn.y));
                    oy = pos.y - this.UI.height / 2;
                }
            }
            this.UI.x = ox;
            this.UI.y = oy;
        }
    }

}