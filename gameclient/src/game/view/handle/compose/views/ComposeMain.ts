import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { E, ScreenAdapter } from "../../../../G";
import { FightChat_revc } from "../../../../network/protocols/BaseProto";
import { t_Mythical_Choice } from "../../activity/shenhuazixuan/t_Mythical_Choice";
import { IFightGuideWaveUpdate } from "../../guide/FightGuide";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { FightUIFactory } from "../FightUIFactory";
import { EFightSceneStatus } from "../vos/EFightEnum";
import { FightValueConfig } from "../vos/FightValueConfig";
import { IFightMainView } from "../vos/IFightMainView";
import { BossBtn } from "./cells/BossBtn";
import { ChatBtn } from "./cells/ChatBtn";
import { IFightHead } from "./cells/FightHead";
import { PreBannerView } from "./cells/PreBannerView";
import { RedHeroHeadCell } from "./cells/RedHeroHeadCell";
import { IChatPopView } from "./FaceChatView";
import { FightMainView } from "./FightMainView";
import { FightMoney } from "./FightMoneyShow";
import { RedHeadContainer } from "./RedHeadContainer";
import { StealEffect } from "./StealEffect";
/**合成主界面 */
/*
//#region 合成视图结构

t_composetype.xlsx  

 ---------------------->(x)
|
|    +-----+-----+-----+
|    | 0,0 | 1,0 | 2,0 |
|    +-----+-----+-----+
|    | 0,1 | 1,1 | 1,2 |
|    +-----+-----+-----+
|    | 0,2 | 1,2 | 2,2 |
|    +-----------------+
|
|
|    +-----+-----------+
|    |0,100|
|    +-----+-----------+
v(y)

y = 100为选择条

格子形状

类型5的格子

+----+----+
| 00 | 10 |
+----+----+
| 01 |
+----+

配置从左至右,从上至下 0-0|1-0|0-1

`Project1\Client\towertrunk\resource\o\animal`  
f_image

     同类型动物编号
     ^
     |
+--+----+
|10|0001|
+--+----+
  |
  v
  动物类型


to do list:
1.弹道的拖尾
2.3个英雄同时触发攻击动作
3.攻击时候转向问题
4.英雄攻击需要有动作
5.移动的时候,英雄继续攻击
6.底部光环特效的DrawCall优化
7.优化Laya.timer.frameLoop
8.BloodView的Sprite节点数量优化
9.优化Sprite节点数什么都没做也要17+节点数
10.敌方英雄坐标站位要反转
11.飘字的时候不需要跟随玩家(ok)
12.单个区块格子的英雄的位置不要靠近一些(ok)
13.战斗需要动作
14.角色层级需要调整(bug)
15.快速创建英雄的(bug)
remrak
1.visible for sprite不减少Sprite的节点遍历数
2.飘字层级的bug!!!
3.新手引导仿"快来当领主"
4.局内统计是模拟数据
5.英雄攻击需要有朝向
6.英雄冰冻蓝色滤镜
server:
stPlayerInRoom
    ->增加头像URL
    ->增加积分

1-4级   战斗动画20%    图鉴动画35%     5级   战斗动画20%  图鉴动画 （程序做1.2倍缩放）


7.英雄拖拽移动的时候 需要设置3个英雄Avatar的方向
8.英雄的攻击的时候需要有朝向

9.战斗是有前后层的(bug)
10.手机上的弹道特效bug(ok)
11.底部界面适配 (召唤boss按钮居中,其他情况上下靠边)
12.鼠标拖拽超框不隐藏(优化)
13.怪物移动漂移的BUG
14.引导YinDaoView不需要界面弹出缩放时间

15 待做 伤害美术字特效 击晕 冰冻 战斗结算 英雄的提示召唤界面 弹道特效

16 tips 可以在新手引导中模拟各种技能表现
17 冰冻的时候角色停止动画(ok)
18 插槽替换的纹理有内存泄漏的问题
19赌博资源要释放

// D:\Project1\Art\UI切图-神话塔防\14.美术字

20 英雄流水号异常
21 英雄重叠 (is ok)

22 image pointX空指针异常

// D:\Project1\Art\UI切图-神话塔防\13.战斗内横幅\1.所有横幅示意图/bzt_战斗横幅-气泡

23 退出应用音乐没了

24 怪物出现拖尾的条比较慢!
o5Ota5XHl1Oj5sKVCaLuUdBanIFU

25 spine 动画没有播放完成(is ok)

26 simpleEffect点一次会bug(is ok)

bug27: timeScale加速的时候 引导时钟有误差
bug28: timeScale会影响出怪的数量

bug 29 火烧特效提前消失的bug

to do:
FightFactory.createHeroAvatar待重构

http://127.0.0.1:8001/Project1/Client/towertrunk/gameclient/bin/index.html?user=user00003&ver=dev&appid=tower_qa


https://docater1.cn/Wap/App/game_sy/?channel=86c762b3a05d0bd294d59b1f9b3d8cd4

//#endregion
*/

/*
var initConfig = {
  asset:"https://winserver-game.wanhuir.com/Project1/Client/towertrunk/rev_out/",
  platform:1,
  sy_url:"https://dev-server-game.wanhuir.com/tower",
  channel_key: "勇者挑战微信",
  ver:"dev",
  appid:"wx8070b90126a0b503",
  debug:true
}
window["initConfig"] = initConfig;


gm("hero_inner 8 3;hero_inner 4 1;hero_inner 12 1")

火烧有时候无特效，gm('card_inner 46')
点击英雄出范围圈的时候会感觉到卡顿

visualizer_show 显示代码结构
D:/Project1/Client/towertrunk/gameclient/bin/js/stats.html

1. 神话图标按钮闪烁
2. 英雄图标预览滞留在列表
3. laya.core.js的loadImageSource 耗时过长 heroid 33需要 100+ ms  (解决方案1:工具打包缩小序列帧纹理图)
libs/laya.debugtool.js
*/

export class ComposeMain extends ViewBase {
    // private readonly bottom_containerY:number = 900;
    public PageType: EPageType = EPageType.None;
    model:ComposeModel;
    protected mHitFull:boolean = true;
    private _redHead:RedHeadContainer;//神话列表
    _ui: ui.views.compose.ui_compose_mainUI;
    /**战斗场景 */
    private fightView:IFightMainView;
    private preBanner:PreBannerView;//预览栏
    private stealEffect:StealEffect;
    private bossBtn:BossBtn;
    _chatBtn:ChatBtn;
    private topCtl:IFightHead;
    // protected autoFreeAtlas:boolean = true;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        // this.addAtlas("num1.atlas");
        this.addAtlas("fight.atlas");
    }

    protected onExit(): void {
        // this.delAtlas("fight.atlas");
        if(this.preBanner){
            this.preBanner.destory();
            this.preBanner = null;
        }
        this.fightView.onExit();
        this.setWave(0);
        this.topCtl.dispose();
        this.model.bossMonsterId = 0;
        this.model.closeHeroTips();
        FightMoney.releaseRes();
        E.ViewMgr.Close(EViewType.CardMsgView);
        E.ViewMgr.Close(EViewType.Gamble);
        E.ViewMgr.Close(EViewType.FuncCard2);
        E.ViewMgr.Close(EViewType.PvpRoundView);
        E.ViewMgr.Close(EViewType.FuncCardShow);
        this._redHead.exit();
        this.model.off(ComposeEvent.UpdateOwnerHeroCount,this,this.onUpdateOwnerHeroCount);
        this.model.off(ComposeEvent.FightGuideWaveUpdate,this,this.onFightGuideWaveUpdate);
        this.model.off(ComposeEvent.WaveUpdate,this,this.onWaveUpdate);
        this.model.off(ComposeEvent.ShowHideBossBtn,this,this.onShowHideBossBtn);
        this.model.off(ComposeEvent.CreateFace,this,this.onCreateFace);
        this.onFightEnd();
    }

    onFightEnd(){
        Laya.timer.clear(this, this.startCutDown);
    }

    /**打开英雄tips */
    /*
    openHeroTips(uid: number) {
        let vo = this.model.getHeroVo(uid);
        if (vo) {
            if (!this.heroTipsView) {
                this.heroTipsView = new HeroTipsView();
            }
            this.heroTipsView.setData(uid);
            this.heroTipsView.ctl.skin.x = (this._ui.width - this.heroTipsView.ctl.skin.width) >> 1;
            this._ui.addChild(this.heroTipsView.ctl.skin);

            this.fightView.topDragLayer.clear(`openHeroTips`);
        }else{
            this.model.closeHeroTips();
        }
    }
    */

    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.model = ComposeModel.Ins;
            // MainModel.Ins.on(TowerMainEvent.MainViewLayerChange, this, this.onLayerChange);
            E.ViewMgr.closeLoading();

            this.UI = this._ui = new ui.views.compose.ui_compose_mainUI();

            //聊天按钮
            this._chatBtn = new ChatBtn();
            this._ui.chatcon.addChild(this._chatBtn);

            // this._ui.top_container.mouseThrough = true;

            this.stealEffect = new StealEffect(this._ui.top_container);
            // this._ui.rightplayer.head.headicon

            this._redHead = new RedHeadContainer();
            this._redHead.pos(ScreenAdapter.UIRefWidth - RedHeroHeadCell.CellWidth,FightValueConfig.TopOffsetY);
            this._redHead.container = this._ui.top_container;

            //初始化战斗视图
            this.initFightView();
        }
    }

    /**是否伤害数字屏蔽 */
    // get isFork(){
    //     // return this._ui && this._ui.pb_fork.visible;
    //     return this.preBanner && this.preBanner.isFork;
    // }

    private initFightView() {
        this.fightView = new FightMainView();
        // this.fightView.pos(FightValueConfig.fightViewX,FightValueConfig.fightViewY);
        let index:number = this._ui.getChildIndex(this._ui.scene_con);
        this._ui.addChildAt(this.fightView,index + 1);
    }

    /**触发表情 */
    private onCreateFace(revc:FightChat_revc){
        let popChat:IChatPopView = FightFactory.createChatPop(revc);
        this._ui.top_container.addChild(popChat);
        popChat.play();
    }

    private startCutDown(){
        // this.model.nextWaveTime--;
        let sub = this.model.nextWaveTime - TimeUtil.serverTime;
        if(sub >= 0){
            // this._ui.timeTf.text = TimeUtil.subTimeHMS_EN(sub);
            this.setSubTimeTF(sub);
            Laya.timer.once(1000,this,this.startCutDown);
            this.model.cutdownCheck(sub);
        }
    }
    // private onWaveStop(){
    //     Laya.timer.clear(this,this.startCutDown);
    // }
    private onShowHideBossBtn(){
        if(this.model.bossMonsterId){
            // this.bossBtnCtl.visible = true;
            // //设置boss头像
            // this._ui.bossIcon.skin = t_Monster.Ins.getHeadIcon(this.model.bossMonsterId);

            if(!this.bossBtn){
                this.bossBtn = new BossBtn();
                this._ui.addChild(this.bossBtn);
            }
            this.bossBtn.show();
            this.bossBtn.refresh();

        }else{
            // this.bossBtnCtl.visible = false;
            if(this.bossBtn){
                this.bossBtn.hide();
            }
        }
    }

    protected onShow(){
        super.onShow();
        this.topCtl.onShow();
        this.fightView && this.fightView.onShow();
    }
    private onWaveUpdate(){
        if(this.model.curAdapter.waveCd){
            this.setWave(this.model.curAdapter.wave);
            this.startCutDown();
        }
    }
    private onFightGuideWaveUpdate(_result:IFightGuideWaveUpdate){
        this.setWave(_result.wave);
        this.setSubTimeTF(Math.floor(_result.sub / 1000));
    }

    private setWave(wave:number){
        this.topCtl.wave = wave;
    }

    private setSubTimeTF(sub:number){
        // this._ui.timeTf.text = TimeUtil.subTimeHMS_EN(sub);
        this.topCtl.subTime = sub;
    }

    protected onInit(): void {
      


        this.model.clearMainAtlas();
        this._ui.chatcon.visible = true;
        this._ui.banner.visible = true;
        this._redHead.init();
        
        this.topCtl = this.model.fightTypeAdaper.createFightTop();
        this.fightView.onInit();
        this._ui.bg1.skin = this.model.fightTypeAdaper.bg;
        this._chatBtn.visible = this.model.fightTypeAdaper.bChat;

        if(this.model.fightTypeAdaper.bPre){
            //预览栏
            // this.preBanner = new PreBannerView();
            // this.preBanner.skin = new ui.views.compose.fightcell.ui_pre_bannerUI();
            // this.preBanner.init();
            // this._ui.banner.addChild(this.preBanner.skin);
            // this.preBanner.skin.pos(10, FightValueConfig.TopOffsetY);
            // this.preBanner.onInit();
            this.preBanner = FightUIFactory.createPreBannerSkin([EViewType.FightPossess,EViewType.FightTask,EViewType.FightMsgHisShowView],
                ui.views.compose.fightcell.ui_pre_bannerUI,this._ui.banner,10,FightValueConfig.TopOffsetY);
        }

        this._ui.guidemask1.y = this.fightView.y + ComposeConfig.cellH;//675 - this.model.fightTypeAdaper.offset_ISO_Y * ComposeConfig.cellH/2;
        DebugUtil.draw(this._ui.guidemask1,"#0000FF");
        this.topCtl.init(this._ui.top_container);

        if(Laya.Utils.getQueryString("debugshow") || initConfig.debugshow){
            E.ViewMgr.Open(EViewType.FightDebugView);
        }
        // if(Laya.Utils.getQueryString("givemoney")&& !MainModel.Ins['isInsideFight']){
        //     window['gm']('item_inner 6 10000;item_inner 7 10000');
        // }

        // this._mythosRed = FightFactory.createNumRed(this._ui.fairyBtn,101,23);
        this.model.on(ComposeEvent.WaveUpdate,this,this.onWaveUpdate);
        // this.model.on(ComposeEvent.WaveStop,this,this.onWaveStop);
        this.model.on(ComposeEvent.ShowHideBossBtn,this,this.onShowHideBossBtn);
        this.model.on(ComposeEvent.FightGuideWaveUpdate,this,this.onFightGuideWaveUpdate);
        this.model.on(ComposeEvent.UpdateOwnerHeroCount,this,this.onUpdateOwnerHeroCount);
        this.model.on(ComposeEvent.CreateFace,this,this.onCreateFace);

        this.onShowHideBossBtn();
        this.onWaveUpdate();
        this.onUpdateOwnerHeroCount();
        this.setSubTimeTF(0);

        //=======================================================

        // FightUIFactory.setPlayer(this._ui.leftplayer.head,this.model.ownerPlayer);
        // FightUIFactory.setPlayer(this._ui.rightplayer.head,this.model.enemyPlayer);



        // if(this.Data && this.Data instanceof FightSource && this.Data.source == EFightSceneStatus.ReConnect){
        //     //重连进入的
        // }else{
        //     E.ViewMgr.Open(EViewType.FightVsView);//VS
        // }

        //======================================================
        let vsAnim:boolean;
        LogSys.Log(`ComposeMain Data is ` + this.Data);
        if(this.Data){
            let _source:EFightSceneStatus = this.Data;
            if(_source == EFightSceneStatus.ReConnect){
                //重连进入的
                this.model.curAdapter.readyComplete();
            }else if(_source == EFightSceneStatus.PVP_Fight_Guide){
                vsAnim = true;
            }
        }else{    
            vsAnim = true;
        }
        if(vsAnim){
            E.ViewMgr.Open(EViewType.FightVsView);
        }
        //======================================================
        this.model.fightTypeAdaper.fightEnter();
    }

    /** 更新英雄数量*/
    private onUpdateOwnerHeroCount(){
        if(this.model.fightTypeAdaper.disableShowMythos){
            return;
        }
        this._redHead.updateView();
    }

    /**更新怪物的数量 */
    public updateMonsterCount(owner: number, pvp: number) {
        this.topCtl.updateMonsterCount(owner,pvp);
    }

    protected SetCenter() {
        super.SetCenter();
        let offsetY: number = (Laya.stage.height - this._ui.height) / 2;
        let oy:number = -offsetY + E.sdk.statusBarHeight;//顶部
        //============================================================================
        this.resetHitRect();
        //============================================================================
        this._ui.top_container.y = oy;
        //==================================================
        this._chatBtn && this._chatBtn.setCenter();
        this.topCtl && this.topCtl.onCenter();
        this.fightView && this.fightView.onCenter();
    }
}

//  syt_战斗横幅-通关