import { PointUtil } from "../../frame/util/PointUtil";
import { GameConfig } from "../../GameConfig";
import { EMsgBoxType, EViewType } from "../common/defines/EnumDefine";
// import { EventID } from "../event/EventID";
import { E, ScreenAdapter } from "../G";
import { SpineBaseClick, SpineClick } from "../modules/screeneffect/SpineClickClickEffect";
// import { ClickScreenEffect } from "../modules/screeneffect/ClickScreenEffect";
import { SocketMgr } from "../network/SocketMgr";
import { IMsgBoxParms } from "../view/handle/common/MsgBoxView2";
import { LayerBase } from "./LayerBase";
import { MaskLayer } from "./MaskLayer";

export enum ELayerType {
    none = 0,
    // sceneLayer = 1,//场景层
    // sceneMaskLayer = 2,//场景遮罩层
    // battleLayer = 3,//战斗层
    // navLayer = 4,//导航层
    flyLayer = 5,//飘物层
    frameLayer = 6,//窗口层
    subFrameLayer = 7,//二级窗口层
    alertLayer = 8,//警告确认层
    screenEffectLayer = 9,//屏幕特效层
    // rollMessageLayer = 10,//滚动信息层
    // guideLayer = 11,//引导层
    smallLoadingLayer = 12,//小loading层
    noteLayer = 13,//公告层
    // debugLayer = 14,//调试层
    // fightLayer = 15,
}

/**层级管理器*/
export class LayerMgr {

    //#region 静态

    /**设计宽度*/
    public static stageDesignWidth: number = 0;
    /**设计高度*/
    public static stageDesignHeight: number = 0;
    /**设备宽度 根据机器自动设定*/
    public static clientWidth: number = 0;
    /**设备高度 根据机器自动设定*/
    public static clientHeight: number = 0;
    /**针对设备的适配缩放X*/
    public static adaptScaleX: number = 0;
    /**针对设备的适配缩放Y*/
    public static adaptScaleY: number = 0;
    /**针对设备的适配缩放*/
    public static adaptScale: number = 0;
    /**设备像素倍率*/
    public static pixelRatio: number = 1;
    /**对设备适配后，距离顶部的距离*/
    public static top: number = 0;
    /**对设备适配后，距离左侧的距离*/
    public static left: number = 0;
    /**距离顶部真实的距离*/
    public static clientTop: number = 0;
    /**距离左侧真实的距离*/
    public static clientLeft: number = 0;
    /**层级距离左侧的距离 */
    public static LayerLeft: number = 0;
    /**层级距离顶部的距离 */
    public static LayerTop: number = 0;

    private static _ins: LayerMgr;
    public static get Ins() {
        if (!this._ins) this._ins = new LayerMgr();
        return this._ins;
    }

    public static get mouseX(): number { return Laya.stage.mouseX / LayerMgr.adaptScaleX; }
    public static get mouseY(): number { return Laya.stage.mouseY / LayerMgr.adaptScaleY; }

    //#endregion

    //#region 实例

    //#region 层级定义
    public rootLayer: Laya.Sprite;

    /**1-场景层-最底层用来放游戏场景*/
    // public sceneLayer: MaskLayer;
    /**2-场景遮罩层-遮盖场景的ui放到这一层*/
    // public sceneMaskLayer: MaskLayer;
    /**3-战斗层-战斗内的ui放到这一层*/
    // public battleLayer: MaskLayer;
    /**4-导航层-主要添加工具工具按钮栏、活动按钮栏、功能按钮栏等各个模块的快速入口，如有聊天框一般也放在这层*/
    // public navLayer: MaskLayer;
    /**5-飘物层 -导航层之上，用来放一些礼包之类在页面中漂浮的东西*/
    public flyLayer: MaskLayer;
    /**6-窗口层 -一般处于导航层之上-主要添加各个功能的窗口视图*/
    public frameLayer: MaskLayer;
    /**7-二级窗口层 -一般处于窗口层之上-主要添加各个功能窗口视图的二级窗口*/
    public subFrameLayer: MaskLayer;
    /**8-警告确认层 -一般处于窗口层之上-主要添加各种通知、提醒，以及用户的操作确认*/
    public alertLayer: MaskLayer;
    /**9-屏幕特效层 -一般处于警告层之上-屏幕点击特效放到这里*/
    public screenEffectLayer: MaskLayer;
    /**10-滚动信息层 -一般处于屏幕特效层窗口之上-主要添加屏幕的滚动文本提醒、喇叭滚动文本等*/
    // public rollMessageLayer: MaskLayer;
    /**11-引导层 -一般处于二级窗口层之上-主要添加新手引导和其他模块引导相关的视图*/
    // public guideLayer: MaskLayer;
    /**12-小loading层 -一般处于引导层之上-主要添加小loading视图，小loading即 游戏内的局部加载等后期*/
    public smallLoadingLayer: MaskLayer;
    /**13-公告层 -一般处于小loading层之上-主要添加服务器公告*/
    public noteLayer: MaskLayer;
    /**14-调试层 -一般处于最上层-主要添加各种调试工具的视图*/
    // public debugLayer: MaskLayer;

    // public fightLayer:Laya.Sprite;
    /**战斗拖拽顶层 */
    // public fightDragLayer:Laya.Sprite;
    //#endregion


    //#endregion

    //所有层级数组
    private _layers: LayerBase[];
    public get Layers(): LayerBase[] { return this._layers; }

    private _layerMgr: Laya.Sprite;//根节点
    private _clickEffect: SpineBaseClick;//点击屏幕效果
    private _topMask:Laya.Sprite = new Laya.Sprite();
    constructor() {
        this._layers = [];

        //层级管理器
        this._layerMgr = Laya.stage.getChildByName(this.constructor.name) as Laya.Sprite;
        if (this._layerMgr != null) this._layerMgr.destroy();

        this._layerMgr = new Laya.Sprite();
        this._layerMgr.name = this.constructor.name;
        Laya.stage.addChild(this._layerMgr);

        Laya.stage.addChild(this._topMask);

        //事件监听
        Laya.stage.on(Laya.Event.RESIZE, this, this.onStageResize, null);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        //网络消息
        E.EventMgr.on(EventID.WEBSOCKET_CLOSED, this, this.onSockectClosed);
        E.EventMgr.on(EventID.WEBSOCKET_ERROR, this, this.onSockectError);
        E.EventMgr.on(EventID.WEBSOCKET_SELECTSERVER, this, this.onSockectSelectServer);
        E.EventMgr.on(EventID.PlayerKickTheLineNtf, this, this.onPlayerKickTheLineNtf);
        E.EventMgr.on(EventID.KickNtf, this, this.onKickNtf);
    }
	//添加顶层遮罩
    private drawTopMask(){
        if(Laya.Browser.onPC || Laya.Utils.getQueryString("maskhide")){
            return;
        }
        let cellw:number = 0;
        let w:number = ScreenAdapter.UIRefWidth;
        if(Laya.stage.width > w){
            cellw = (Laya.stage.width - w) / 2;
        }
        let _topMask = this._topMask;
        _topMask.graphics.clear();
        if(cellw){
            _topMask.graphics.drawRect(0,0,cellw,Laya.stage.height,"#000000");
            _topMask.graphics.drawRect(cellw+w,0,cellw,Laya.stage.height,"#000000");
        }
    }

    //#region 监听消息处理
    private onStageResize() {
        // console.log("onStageResize w:" + Laya.stage.width + "  h:" + Laya.stage.height);
        LayerMgr.Ins.ResizeStage();
        LayerMgr.Ins.ResizeLayers();
        E.ViewMgr.SetLayout();
    }

    private onMouseDown() {
        if (this._clickEffect != null) {
            this._clickEffect.ShowEffect();
        }
    }

    private onSockectError() {

        // if (E.ViewMgr.Get(EViewType.Login) != null && E.ViewMgr.Get(EViewType.Login).UI.visible == true) return;
        E.ViewMgr.closeLoading();
        E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, E.LangMgr.getLang("MSG_SOCKETERROR"), new Laya.Handler(this, this.pageToLogin));
    }

    private onSockectClosed() {
        // if (E.ViewMgr.Get(EViewType.Login) != null && E.ViewMgr.Get(EViewType.Login).UI.visible == true) return;
        E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,E.LangMgr.getLang("MSG_SOCKETCLOSED"), new Laya.Handler(this, this.pageToLogin));
    }

    private onSockectSelectServer(){
        this.pageToLogin();
    }

    /**重新连接*/
    private reConnect() {

    }

    pageToLogin() {
        // 下线
        E.ViewMgr.CloseAll();// 关闭UI页面
        SocketMgr.Ins.CloseSocket();// 关闭连接
        // 重新打开登陆页面
        // E.ViewMgr.Open(EViewType.Login, null, []);
        E.ViewMgr.Open(EViewType.LoginNew);
        
        E.AudioMgr.StopBGM();
    }

    //被踢下线
    private onPlayerKickTheLineNtf() {
        this.pageToLogin();
    }

    //被踢下线
    public onKickNtf() {
        let st:string = "";

        let _param:IMsgBoxParms;
        switch(SocketMgr.Ins.KickNtfType){
            case 0:
                st = E.getLang("samename_err");
                break;
            case 1:
                _param = { fontSize: 23 } as IMsgBoxParms;
                st = E.getLang("underage_err");
                break;
            case 2:
                // 1003协议 reason=2文字提示服务器正在维护
                st = E.getLang("severtips");
                break;
            
            default:
                st = E.getLang("kick_err");
                break;
        }

        E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,st,null, null, new Laya.Handler(this, () => {
            this.pageToLogin();
        }),_param);
    }
    //#endregion
    private readonly bUseClickEffect:boolean = false;
    /**初始化 */
    public Init(): void {
        this.initLayer(GameConfig.width, GameConfig.height);

        if(this.bUseClickEffect){
            //点击效果
            this._clickEffect =  new SpineClick();
            Laya.stage.addChild(this._clickEffect);
        }
    }

    /**初始化层级
     * @param designWidth 设计宽
     * @param designHeight 设计高
    */
    private initLayer(designWidth?: number, designHeight?: number): void {
        let pixelRatio: number = Laya.Browser.pixelRatio;
        let clientWidth: number = Laya.Browser.clientWidth * pixelRatio;
        let clientHeight: number = Laya.Browser.clientHeight * pixelRatio;
        let adaptScaleX: number = clientWidth / designWidth;
        let adaptScaleY: number = clientHeight / designHeight;
        let adaptScale: number = Math.min(adaptScaleX, adaptScaleY);
        let stageWidth = designWidth * adaptScaleX;
        let stageHeight = designHeight * adaptScaleY;
        let top: number = 0;
        let left: number = 0;

        if (adaptScale === adaptScaleX)
            top = (stageHeight - designHeight * adaptScale) * 0.5;
        else
            left = (stageWidth - designWidth * adaptScale) * 0.5;

        // Laya.stage.width = stageWidth;
        // Laya.stage.height = stageHeight;

        //点击特效
        // container.on(Laya.Event.CLICK, this, (e) => {
        //     EffectUtil.playBoneEffect("ui_hit_03", { x: e.stageX, y: e.stageY }, container);
        // });

        // console.log("pixelRatio:" + pixelRatio);
        // console.log("clientWidth:" + clientWidth);
        // console.log("clientHeight:" + clientHeight);
        // console.log("adaptScaleX:" + adaptScaleX);
        // console.log("adaptScaleY:" + adaptScaleY);
        // console.log("adaptScale:" + adaptScale);
        // console.log("stageWidth:" + stageWidth);
        // console.log("stageHeight:" + stageHeight);
        // console.log("top:" + top);
        // console.log("left:" + left);

        //静态变量赋值
        LayerMgr.stageDesignWidth = designWidth;
        LayerMgr.stageDesignHeight = designHeight;
        LayerMgr.clientWidth = Laya.Browser.clientWidth;
        LayerMgr.clientHeight = Laya.Browser.clientHeight;
        LayerMgr.adaptScaleX = adaptScaleX;
        LayerMgr.adaptScaleY = adaptScaleY;
        LayerMgr.adaptScale = adaptScale;
        LayerMgr.pixelRatio = pixelRatio;
        LayerMgr.top = top;
        LayerMgr.left = left;
        LayerMgr.clientTop = (top / pixelRatio);
        LayerMgr.clientLeft = (left / pixelRatio);

        //初始化层级==========================================================================
        this.rootLayer = this._layerMgr;
        let idx: number = 0;
        // this.sceneLayer = this.createMaskLayer(idx++, "sceneLayer", this.rootLayer);
        // this.sceneMaskLayer = this.createMaskLayer(idx++, "sceneMaskLayer", this.rootLayer);
        // this.battleLayer = this.createMaskLayer(idx++, "battleLayer", this.rootLayer);
        // this.navLayer = this.createMaskLayer(idx++, "navLayer", this.rootLayer);
        this.flyLayer = this.createMaskLayer(idx++, "flyLayer", this.rootLayer);
        this.frameLayer = this.createMaskLayer(idx++, "frameLayer", this.rootLayer);
        this.subFrameLayer = this.createMaskLayer(idx++, "subFrameLayer", this.rootLayer);
        this.alertLayer = this.createMaskLayer(idx++, "alertLayer", this.rootLayer);
        this.screenEffectLayer = this.createMaskLayer(idx++, "screenEffectLayer", this.rootLayer);
        // this.rollMessageLayer = this.createMaskLayer(idx++, "rollMessageLayer", this.rootLayer);
        // this.guideLayer = this.createMaskLayer(idx++, "guideLayer", this.rootLayer);
        this.smallLoadingLayer = this.createMaskLayer(idx++, "smallLoadingLayer", this.rootLayer);
        this.noteLayer = this.createMaskLayer(idx++, "noteLayer", this.rootLayer);
        // this.fightDragLayer = this.createMaskLayer(idx++, "fightDragLayer", this.rootLayer);
        // this.fightDragLayer.mouseThrough = true;
        // this.debugLayer = this.createMaskLayer(idx++, "debugLayer", this.rootLayer);

        this.ResizeStage();
        this.ResizeLayers();
        // for (let layer of this._layers) {
        //     layer.pos(0, 0);
        //     layer.size(Laya.stage.width, Laya.stage.height);
        //     // layer.scale(adaptScaleX, adaptScaleY);
        //     // layer.scale(adaptScale, adaptScale);
        // }
        //===================================================================================
    }

    /**刷新静态数据 */
    private UdpateStaticData() {
        let designWidth = LayerMgr.stageDesignWidth;
        let designHeight = LayerMgr.stageDesignHeight;
        let pixelRatio = LayerMgr.pixelRatio;
        let clientWidth: number = Laya.Browser.clientWidth * pixelRatio;
        let clientHeight: number = Laya.Browser.clientHeight * pixelRatio;
        let adaptScaleX: number = clientWidth / designWidth;
        let adaptScaleY: number = clientHeight / designHeight;
        let adaptScale: number = Math.min(adaptScaleX, adaptScaleY);

        //静态变量赋值
        LayerMgr.clientWidth = Laya.Browser.clientWidth;
        LayerMgr.clientHeight = Laya.Browser.clientHeight;
        LayerMgr.adaptScaleX = adaptScaleX;
        LayerMgr.adaptScaleY = adaptScaleY;
        LayerMgr.adaptScale = adaptScale;

        // console.log("clientWidth:" + LayerMgr.clientWidth);
        // console.log("clientHeight:" + LayerMgr.clientHeight);
        // console.log("adaptScaleX:" + LayerMgr.adaptScaleX);
        // console.log("adaptScaleY:" + LayerMgr.adaptScaleY);
        // console.log("adaptScale:" + LayerMgr.adaptScale);
        if (Laya.stage.scaleMode == Laya.Stage.SCALE_FIXED_HEIGHT) {
            LayerMgr.LayerLeft = 0;//(Laya.stage.width - LayerMgr.stageDesignWidth) / 2;
            LayerMgr.LayerTop = 0;
        }
        else if (Laya.stage.scaleMode == Laya.Stage.SCALE_FIXED_WIDTH) {
            LayerMgr.LayerLeft = 0;
            LayerMgr.LayerTop = 0;
        }
        // console.log("LayerLeft: " + LayerMgr.LayerLeft + ", LayerTop: " + LayerMgr.LayerTop);
    }

    /**重置Stage */
    public ResizeStage() {
        if (Laya.Browser.clientWidth > Laya.Browser.clientHeight &&
            Laya.stage.scaleMode != Laya.Stage.SCALE_FIXED_HEIGHT) {
            Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;// 高度适配
        }
        else if (Laya.Browser.clientWidth < Laya.Browser.clientHeight &&
            Laya.stage.scaleMode != Laya.Stage.SCALE_FIXED_WIDTH) {
            Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        }

        this.UdpateStaticData();
        this.drawTopMask();
    }

    /**重置Layer */
    public ResizeLayers() {
        for (let layer of this._layers) {
            // if (Laya.stage.scaleMode == Laya.Stage.SCALE_FIXED_WIDTH) {
            layer.size(Laya.stage.width, Laya.stage.height).pos(LayerMgr.LayerLeft, LayerMgr.LayerTop);;
            // }
            // else if (Laya.stage.scaleMode == Laya.Stage.SCALE_FIXED_HEIGHT) {
            //     if (layer.LayerID == this.sceneLayer.LayerID) {
            //         layer.size(Laya.stage.width, Laya.stage.height).pos(0, 0);
            //     }
            //     else {
            //         layer.size(LayerMgr.stageDesignWidth, Laya.stage.height);
            //         layer.pos(LayerMgr.LayerLeft, LayerMgr.LayerTop);
            //     }
            // }
            // console.log("layer:" + layer.name + "  w:" + layer.width + " h:" + layer.height);
        }
    }

    /**获取在舞台中真实的形状
       * @param target 目标对象
      */
    public static getRealStageRect(target: Laya.Sprite): Laya.Rectangle {
        let loc: Laya.Point = PointUtil.localToGlobal(target);
        let rect: Laya.Rectangle = new Laya.Rectangle(
            loc.x * LayerMgr.adaptScale + this.left,
            loc.y * LayerMgr.adaptScale + this.top,
            target.width * LayerMgr.adaptScale,
            target.height * LayerMgr.adaptScale
        );

        let scaleFactor: number = Laya.stage.designWidth / Laya.Browser.clientWidth;
        rect.x = Math.round(rect.x / scaleFactor);
        rect.y = Math.round(rect.y / scaleFactor);
        rect.width = Math.round(rect.width / scaleFactor);
        rect.height = Math.round(rect.height / scaleFactor);
        return rect;
    }

    /**创建层级*/
    private createLayer(idx: number, name: string, container: Laya.Sprite): LayerBase {
        this._layers.push(container.addChild(new LayerBase(idx, name)) as LayerBase);
        return this._layers[this._layers.length - 1];
    }

    /**创建遮罩层级*/
    private createMaskLayer(idx: number, name: string, contianer: Laya.Sprite): MaskLayer {
        this._layers.push(contianer.addChild(new MaskLayer(idx, name)) as MaskLayer);
        return this._layers[this._layers.length - 1] as MaskLayer;
    }

    //#endregion


}

