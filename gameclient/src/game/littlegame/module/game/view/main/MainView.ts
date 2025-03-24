import { BaseUIView } from "../../../../rb/BaseUIView";
import { SoundManger } from "../../../../rb/sound/SoundManager";
import { UIManager } from "../../../../rb/UIManager";
import { GameModel } from "../../model/GameModel";
import { myUI } from "./myUI";
import { PlayView } from "./PlayView";

export class MainView extends BaseUIView {
    preTimestemp: number;
    preShotstemp: number;

    playView: PlayView;

    //speedT:number = 1;//速度基数1对应 10s 1280

    isMouseDown: boolean = false;

    preX: number;

    //底部操作向左滑动最大距离 舞台横向中间是0
    minPos: number = -210;
    //底部操作向右滑动最大距离 舞台横向中间是0
    maxPos: number = 210;

    constructor() {//构造函数
        super();
        this.url = "game/MainView.json";
        this.preLoadRes = [
            { url: "game/item/AddSpeedItem.json", type: Laya.Loader.JSON },
            { url: "game/item/BloodItem.json", type: Laya.Loader.JSON },
            { url: "game/item/DelSpeedItem.json", type: Laya.Loader.JSON },
            { url: "game/item/AddAttackItem.json", type: Laya.Loader.JSON }

        ];//界面需要预加载的资源
        //
        for (let i = 1; i <= 10; i++) {
            let idxStr = i < 10 ? "0" + i : i;
            this.preLoadRes.push({ url: "game/item/monstor/Monstor" + idxStr + ".json", type: Laya.Loader.JSON });
            this.preLoadRes.push({ url: "game/ani/monstor" + idxStr + ".ani", type: Laya.Loader.JSON });
        }

        this._layer = UIManager.inst.uiLayer;//界面的层级
    }

    get skin(): myUI.game.MainViewUI {//skin转成对应类型
        return this._skin as myUI.game.MainViewUI;
    }

    init() {
        super.init();
        let skin = this.skin;
        let sp = new Laya.Sprite();
        sp.x = skin.width / 2;
        sp.y = skin.height;
        // console.log("mainview::mapViewContainer::", skin.height);
        skin.addChildAt(sp, 0);
        this.playView = new PlayView(sp);
        skin.posBox.x = skin.width / 2;
        if(window["subSheGame"] && window["subSheGame"].isAudit){
            skin.quitBtn.visible = false;//提审的时候隐藏跳过按钮
        }else{
            skin.quitBtn.visible = true;
        }

        // if(window["initConfig"]["test"]){
        //     skin.quitBtn.visible = true;
        // }

        //使用这种方式 destroy统一处理时间
        this.onEvt(skin.quitBtn,Laya.Event.CLICK,this,this.onClickQuit); //退出游戏 

        this.playView.FailedHandler = Laya.Handler.create(this, this.onGameFailed, null);
        this.playView.SuccessHandler = Laya.Handler.create(this, this.onGameSuccess, null);
    }

    onGameFailed() {//游戏失败
        this.onClickStopBtn();
        let model: GameModel = this.model;
        model.view.loseView.open();
    }

    onGameSuccess() {//游戏成功
        this.onClickStopBtn();
        let model: GameModel = this.model;
        model.view.compView.open();
    }

    onClickQuit() {//离开游戏
        // let model:GameModel = this.model;
        // model.context.close();
        // model.context.destory();
        if(window["subSheGame"]){
            window["subSheGame"].closeGame();
            if(window["subSheGame"].skipFun){
                window["subSheGame"].skipFun();
            }
        }
    }

    onMouseDown(e: Laya.Event) {
        SoundManger.playBgmMusic();
        this.isMouseDown = true;
        this.preX = e.stageX;
        this.skin.posImg.x = 0;
    }

    onMouseOut(e: Laya.Event) {

        let posImg = this.skin.posImg;
        Laya.Tween.clearAll(posImg);
        Laya.Tween.to(posImg, { x: 0 }, 200, Laya.Ease.linearInOut);
    }

    onMouseUp() {
        // console.log("onMouseUp...............");
        this.isMouseDown = false;
        let posImg = this.skin.posImg;
        Laya.Tween.clearAll(posImg);
        Laya.Tween.to(posImg, { x: 0 }, 200, Laya.Ease.linearInOut);


    }

    onMouseMove(e: Laya.Event) {
        if (this.isMouseDown) {
            let offsetX = e.stageX - this.preX;

            let toPos = this.skin.posImg.x + offsetX;
            if (toPos < this.minPos) {
                toPos = this.minPos;
            } else if (toPos > this.maxPos) {
                toPos = this.maxPos;
            }
            this.skin.posImg.x = toPos;
            this.preX = e.stageX;

            // console.log("offsetX::", offsetX);

            if (offsetX > 2) {
                this.playView.moveDir(1);//主角往右移动一个位置
            }
            else if (offsetX < -2) {//主角往左移动一个位置
                this.playView.moveDir(-1);
            }

        }
    }

    open(param?: any): void {//界面打开
        super.open(param);
        SoundManger.playBgmMusic();
        if (this.isIninted) {
            this.onEvt(Laya.stage, Laya.Event.MOUSE_DOWN, this, this.onMouseDown);//底部滑杆操作
            this.onEvt(Laya.stage, Laya.Event.MOUSE_MOVE, this, this.onMouseMove);//底部滑杆操作 
            this.onEvt(Laya.stage, Laya.Event.MOUSE_OUT, this, this.onMouseOut);//底部滑杆操作
            this.onEvt(Laya.stage, Laya.Event.MOUSE_UP, this, this.onMouseUp);//底部滑杆操作
         

            this.onClickRestartBtn();
        }

    }

    close(isStrict?: boolean): void {
        super.close();
        this.offEvt(Laya.stage, Laya.Event.MOUSE_DOWN, this, this.onMouseDown);//底部滑杆操作
        this.offEvt(Laya.stage, Laya.Event.MOUSE_MOVE, this, this.onMouseMove);//底部滑杆操作 
        this.offEvt(Laya.stage, Laya.Event.MOUSE_OUT, this, this.onMouseOut);//底部滑杆操作
        this.offEvt(Laya.stage, Laya.Event.MOUSE_UP, this, this.onMouseUp);//底部滑杆操作
       
        
       
        this.stopPlay();
        this.playView.clearMonstor();
        SoundManger.stopMusic();
    }

    updateUI(): void {//界面每次打开都会调用到
        console.log("777....");


    }

    onClickStartBtn() {//点击开始游戏
        this.startPlay();
    }
  
    onClickStopBtn() {//点击暂停游戏
        this.stopPlay();
    }

    onClickRestartBtn() {//重新开始游戏
        this.preTimestemp = Date.now();
        this.preShotstemp = this.preTimestemp;
        this.playView.reset();
        this.playView.play();
        Laya.timer.frameLoop(2, this, this.onLoopFrame);
    }

    /**开始游戏 */
    startPlay() {

        this.playView.play();
        this.preTimestemp = Date.now();
        this.preShotstemp = this.preTimestemp;
        Laya.timer.frameLoop(2, this, this.onLoopFrame);
    }

    stopPlay() {//暂停游戏
        this.playView.stop();
        Laya.timer.clear(this, this.onLoopFrame);
    }

    //游戏里面都是靠这个刷帧驱动的
    onLoopFrame() {
        let now = Date.now();
        let disTime = now - this.preTimestemp;//ms  计算两帧之间的时间差
        this.preTimestemp = now;
        //计算移动一帧的移动距离 10000ms 1280
        let beishu = 1;
        let moveDis = Math.round(disTime / 1000 * 128)*beishu;
        this.playView.move(moveDis);

        let disShotTime = now - this.preShotstemp;//ms

        if (disShotTime > this.playView.attackSpeed) {
            this.playView.shot();
            this.preShotstemp = now;
        }
        this.playView.onLoopFrame();
    }

    destroy() {//销毁
        if (this.playView) {
            this.playView.destroy();
        }
        this.playView = null;
        this.close();
        super.destroy();
        SoundManger.clearMusic();
    }




}