import { ButtonSkin } from "../../../../../../frame/view/DefaultButton";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { stPlayerData } from "../../../../../network/protocols/BaseProto";
import { NoContainerSimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { FightGuideUtils } from "../../../guide/FightGuideUtils";
import { MainModel } from "../../../main/model/MainModel";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { FightFactory } from "../../FightFactory";
import { EFightMode } from "../../vos/EFightEnum";
import { wingm } from "../FightDebugView";
import { FrameMonster } from "../FrameAvatar";
/*
初始化GPU内存:

21.33333333333332 byte



......................................
Texture2D:Resource
destroy();



英雄 怪物 特效
*/

function overrideCore(){
    Laya.Resource.destroyUnusedResources = function(){
        let _idResourcesMap = Laya.Resource['_idResourcesMap'];
        for (var k in _idResourcesMap) {
            var res = _idResourcesMap[k];
            if (!res.lock && res._referenceCount === 0){
                console.log("destroyUnusedResources:",'['+k+']',res);
                res.destroy();
            }
        }
    }

    //销毁资源
    Laya.Resource.prototype.destroy = function(){
        if (this._destroyed)
        return;
        this._destroyed = true;
        this.lock = false;
        this._disposeResource();
        let Resource = Laya.Resource;
        delete Resource['_idResourcesMap'][this.id];
        var resList;
        if (this._url) {
            resList = Resource['_urlResourcesMap'][this._url];
            if (resList) {
                resList.splice(resList.indexOf(this), 1);
                (resList.length === 0)
                {
                    LogSys.Log(`real destory:${this._url}`);
                    (delete Resource['_urlResourcesMap'][this._url]);
                }
            }
            var resou = Laya.Loader.loadedMap[this._url];
            (resou == this) && (delete Laya.Loader.loadedMap[this._url]);
        }
    }


    // Laya.Texture2D.prototype.loadImageSource = function(source, premultiplyAlpha = false) {
        
    // }
}

class ItemTest extends Laya.Sprite{
    private tf:Laya.Label;

    constructor(){
        super();
        let btn = new Laya.Sprite();
        btn.graphics.drawRect(0,0,50,50,"#00ff00");
        this.addChild(btn);
        btn.y = -25;

        this.width = this.height = 100;
        this.graphics.drawRect(0,0,this.width,this.height,null,"#ff0000",1);
        this.tf = new Laya.Label();
        this.tf.color = "#ffffff";
        this.addChild(this.tf);
    }

    refresh(index:number){
        this.tf.text = index + "";
    }
}
// class FightTestView extends ui.views.compose.fightcell.ui_fight_testUI{
    // constructor(){
        // super();
        // this.list1.height = 200;
        // this.list1.y = 0;
        // DebugUtil.draw(this.list1,"#00ffff",this.list1.width,this.list1.height,0,0);
        // LogSys.Log(`list1 w:${this.list1.width} h:${this.list1.height}`);//312,200
        // let offset:number = 25;

        // this.list1.mClipY = -25;
        // this.graphics.clipRect();
        // this.list1.graphics.clipRect(0,-offset,this.list1.width,this.list1.height);
        // this.list1.scrollRect = new Laya.Rectangle(0,offset,this.list1.width,this.list1.height);
//         this.list1.itemRender = ItemTest;
//         this.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler);
//         // this.list1.hScrollBarSkin = " ";
//         this.list1.array = [1,2,3,4,5,6,7,8,9,10];
        

//         // this.list1.scrollRect()
//     }

//     private onRenderHandler(item:ItemTest,index:number){
//         item.refresh(index);
//     }
// }

interface IComposeGPU extends Laya.EventDispatcher{
    enterBattle();
    onGameStart();
}
export class SpineGPU_Test extends ViewBase {
    private _ui: Laya.View;
    private container:Laya.Sprite = new Laya.Sprite();
    private effect:NoContainerSimpleEffect;
    private heros:FrameMonster[] = [];
    protected checkGuide:boolean = false;
    
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    private closeCtl1:ButtonCtl;

    private createCloseBtn(){
        let closeBtn = new Laya.Image(``);
        // closeBtn.stateNum = 1;
        closeBtn.width = 50;
        closeBtn.height = 50
        closeBtn.x = this._ui.width - closeBtn.width;
        this._ui.addChild(closeBtn);
        this.closeCtl1 = ButtonCtl.CreateBtn(closeBtn,this,this.Close);
    }

    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {

            this.UI = this._ui = new Laya.View();
            this.UI.width = this.UI.height = 500;
            this._ui.mouseThrough = true;
            this.createCloseBtn();
        }
    }
    private onHeroComplete(hero:FrameMonster){
        this.heros.push(hero);
        this._ui.addChild(hero.skeleton);
        hero.skeleton.pos(this.heros.length * 50,0);
    }
    private delHero(){
        while(this.heros.length > 0){
            let hero = this.heros.shift();
            hero.dispose();
        }
    }
    private onFightShow(){
        wingm("setPvpRoundStatus 1");
    }
    private enterBattle(){
        this.model.once(ComposeEvent.FightViewOnShow,this,this.onFightShow);
        //进入战斗
        let player =  new stPlayerData();
        player.HeadUrl = "";
        MainModel.Ins.mRoleData.mPlayer = player;
        this.model.onGameStart();
        let playerid:number = 1;
        MainModel.Ins.mRoleData.AccountId = playerid;
        FightGuideUtils.createRoomInfo(playerid, 2, initConfig.fight_mode || EFightMode.PVP, 1,'a');        
        this.model.enterBattle();

        wingm("createHero 23 0 2")
        wingm("createHero 24 1 2");
        wingm("createHero 25 2 2");
        // wingm("buffer");
        // enable_mythor_heros:"23|24|25|26|27|23|24|25|26|27|23|24|25|26|27",

        wingm("composeMythos 23|24|25|26|27");
        wingm("setCanHero 23|24|25");
        // Laya.timer.once(4000,this,()=>{
        //     wingm("setPvpRoundStatus 1");
        // })
    }
    protected onInit(): void {
        // this._ui.addChild(new FightTestView());
        // "base.atlas"

        Laya.loader.load([
            { url: "res/atlas/remote/base.atlas", type: Laya.Loader.ATLAS },
            // { url: "res/atlas/remote/fight.atlas", type: Laya.Loader.ATLAS }
        ], new Laya.Handler(this, this.enterBattle));

    }


    private get model():IComposeGPU{
        return ComposeModel.Ins as any;
    }
    protected onInit2(): void {


        overrideCore();
        // throw new Error("Method not implemented.");
        this._ui.addChild(this.container);

        this.addFuncBtn("add",this,this.addSpine);
        this.addFuncBtn("del",this,this.delSpine);
        this.addFuncBtn("gc",this,this.onGCHandler);
        this.addFuncCmd("卡牌特效","carddiscard 2 3 1");
        this.addFuncCmd("watch_memory","watch_memory");
        //======================================================
        this.addHeroFunc();
        //======================================================
        let i:number = 1;
        this.addFuncBtn("atk",this,()=>{
            // http://127.0.0.1:8001/Project1/Client/towertrunk/resource/o/spine/scene/Atk_up/Atk_up.png
            let eff = SpineEffectMgr.createNoSimpleEffect(`o/spine/scene/Atk_up/Atk_up`,this._ui);
            // Laya.Scene.gc();
            i++;
            LogSys.Log(`create ${i}`);
            eff.play(0,false,this,()=>{
                eff.dispose();
                LogSys.Log(`del ${i}`);
            })
        });


        this.layoutUI(this.container);
        Laya.timer.callLater(this,()=>{
            E.ViewMgr.Close(EViewType.LoginNew);
        })
    }
    private onCmdFunc(_cmd:string){
        wingm(_cmd);
    }
    private addFuncCmd(_lb:string,_cmd:string){
        this.addFuncBtn(_lb,this,this.onCmdFunc,_cmd);
    }

    private onGCHandler(){
        wingm("gc");
    }

    private addFuncBtn(lb:string,that,func:Function,arg?){
        let _btn = new ButtonSkin(`${lb}`,new Laya.Handler(this,(btn:ButtonSkin)=>{
            func.call(that,arg);
        }),0,0,200,80);
        this.container.addChild(_btn);
    }
    private layoutUI(container:Laya.Sprite,gap:number=10){
        let oy:number = 0;
        for(let i = 0;i < container.numChildren;i++){
            let cell = container.getChildAt(i) as Laya.Sprite;
            cell.y = oy;
            oy += (cell.height + gap);
        }
    }

    private addSpine(){
        this.delSpine();
        let ox:number = this._ui.width/2;
        let oy:number = this._ui.height/2;
        let url:string = `o/spine/scene/gailv_up/gailv_up`;
        this.effect = SpineEffectMgr.createLoopNoSimpleEffect(url, this._ui, ox, oy, 0);
    }

    private delSpine(){
        if(this.effect){
            this.effect.dispose();
        }
    }

    private onPlayEnd(){
        LogSys.Log(`play end...`);
    }

    private addHeroFunc(){
        const oldHeroId:number = 33;
        let heroId:number = oldHeroId;
        this.addFuncBtn("hero add",this,()=>{
            if(heroId > 37){
                heroId = oldHeroId;
            }
            FightFactory.createFrameHero(heroId, this, this.onHeroComplete);
            heroId++;
        });
        this.addFuncBtn("hero del",this,this.delHero);
    }
}