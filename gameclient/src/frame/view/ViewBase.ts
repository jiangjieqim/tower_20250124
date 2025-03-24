import { EPageType, EViewType } from "../../game/common/defines/EnumDefine";
import { LayerHelper } from "../../game/common/help/LayerHelper";
import { Updater } from "../../game/common/timer/Updater";
import { EventGroup } from "../../game/event/EventGroup";
import { EventType } from "../../game/event/EventType";
import { E } from "../../game/G";
import { ELayerType } from "../../game/layer/LayerMgr";
import { ResItemGroup } from "../../game/resouce/ResItemGroup";
import { Path, ResPath } from "../../game/resouce/ResPath";
import { StaticDataMgr } from "../../game/static/StaticDataMgr";
import { AssetConfig } from "../../game/view/handle/avatar/spine/AssetConfig";
import { HeroAvatarView } from "../../game/view/handle/compose/views/HeroAvatarView";
import { IGetCenter } from "../../game/view/handle/compose/vos/IFightMainView";
import { t_Function_Sound } from "../../game/view/handle/funs/proxy/t_Function_Sound";
import { EGuideEvent, GuideModel, IGuideModel } from "../../game/view/handle/guide/GuideModel";
import { MainModel } from "../../game/view/handle/main/model/MainModel";
import { TowerMainEvent } from "../../game/view/handle/towertmain/model/TowerMainEvent";
import { TowerMainFightModel } from "../../game/view/handle/towertmain/model/TowerMainFightModel";
import { t_Func_Popup } from "../../game/view/handle/towertmain/proxy/t_Func_Popup";
// import { YinDaoModel } from "../../game/view/handle/yindao/YinDaoModel";
// import { DebugUtil } from "../util/DebugUtil";
import { TweenEase } from "../util/TweenEase";
import { TweenUtil } from "../util/TweenUtil";
// import { ButtonCtl } from "./ButtonCtl";
import { DragControl } from "./DragControl";
import { IView } from "./IView";

export interface IViewBaseUiVo{
    onShowHandler:Laya.Handler;
}
interface IUISkin{
    titleHero;
}
/**
 * 注意: 必须加一个鼠标点击事件才能激活鼠标遮挡事件
 */
export abstract class ViewBase implements IView {
    // protected bNextGuideStep:boolean = false;
    /**相对于战斗场景居中 */
    // protected bFightCenter:boolean = false;
    // protected centerPtr:IGetCenter;
    protected disabeLayerChange:boolean = false;
    /**界面开启的时候 走onInit更新 */
    protected mShowUpdate:boolean = false;
    /**满屏可交互区域 */
    protected mHitFull:boolean = false;
    // protected mDebug:boolean = false;
    protected get mDebug(){
        // return debug;
        return false;
    }
    isCheckTop:boolean = true;
    /**使用居中 */
    // useSetCenet:boolean = true;
    disableMask:boolean = false;
    // funcId:number;
    /**是否在UI的0号索引位置添加一个点击关闭蒙版*/
    // protected uiBgCloseClick:boolean = false;
    private _bgcloseMask:Laya.Sprite;
    static createBigHeroAvatar:Laya.Handler;
    protected btnList:ButtonCtl[] = [];
    private _dragControl: DragControl;
    protected isClearTimer:boolean = true;
    protected autoFree:boolean = false;//自动释放本ui的资源
    /**是否走引导检测 */
    protected checkGuide:boolean = true;
    protected mMask:boolean = false;//是否有遮罩
    protected mMainSnapshot:boolean = false;//是否用截图
    protected mMaskClick:boolean = true;//是否激活mask点击关闭
    protected mClickAnyAreaClose:boolean = false;//点击任意区域关闭界面
    constructor(viewType: EViewType = EViewType.None,  layerType: ELayerType = ELayerType.frameLayer) {
        this.ViewType = viewType;
        this.LayerType = layerType;
        this.onAddLoadRes();
    }
    public UpdateView():void{};
    /**进入处理 */
    protected onEnter(): void{}
    /**添加加载资源 */
    protected abstract onAddLoadRes(): void;
    /**离开处理 */
    protected abstract onExit(): void;
    /**这里在加载完资源后调用-建议只处理资源相关的逻辑*/
    protected abstract onFirstInit(): void;
    /**初始化*/
    protected abstract onInit(): void;
    /**添加监听事件 */
    protected onAddEventListener(): void{}
    /**子页面处理语言切换 */
    // protected abstract onChangeLanguage(): void;
    protected onChangeLanguage(): void{}

    //#region 资源组-该页面用到的资源
    private _resGroup: ResItemGroup;
    private closeCtl:ButtonCtl;
    private autoFreeAtlas:string[];

    /**获取资源组 */
    public get ResGroup(): ResItemGroup { if (!this._resGroup) this._resGroup = new ResItemGroup(); return this._resGroup; }
    /**
     * 设置是否可以拖拽
     */
    public set enableDrag(v) {
        if (v) {
            if (!this._dragControl) {
                this._dragControl = new DragControl();
            }
            this._dragControl.reg(this.UI['dragarea']);
        } else {
            if (this._dragControl) {
                this._dragControl.unReg();
            }
        }
    }
    protected setMouseBg(view:Laya.Image){
        if(view){
            DebugUtil.draw(view);
            view.once(Laya.Event.CLICK,this,this.onBgClick);
        }
    }
    private onBgClick(){
    }
    protected bindClose(closeImg:Laya.Image,later:boolean = false){
        if(closeImg){
            this.closeCtl = ButtonCtl.Create(closeImg, new Laya.Handler(this, later ? this.onLaterClose : this.Close));
            return this.closeCtl;
        }
    }

    private onLaterClose(){
        Laya.timer.callLater(this,this.Close);
    }

    protected SetCenter(_ptr?:IGetCenter,ox:number = 0,oy:number = 0): void {
        if (this.UI && !this.UI.destroyed) {
            this.UI.anchorX = this.UI.anchorY = 0.5;
            // let _ptr: IGetCenter = this.centerPtr;
            if (_ptr) {
                let pos: Laya.Point = _ptr.getCenterXY();
                if (pos) {
                    this.UI.x = pos.x + ox;
                    this.UI.y = pos.y + oy;
                }
            } else {
                this.UI.x = (this.ViewParent.width >> 1)+ox;
                this.UI.y = (this.ViewParent.height >> 1)+oy;
            }

            DebugUtil.draw(this.UI, "#ff00ff");
        }
    }

    /**添加资源
     * @param url 资源地址
     * @param type 资源类型
     */
    protected addRes(url: string, type: string): void {
        if (!this._resGroup) this._resGroup = new ResItemGroup();
        this._resGroup.Add(url, type);
    }
    protected addImg(url: string): void {
        if (!this._resGroup) this._resGroup = new ResItemGroup();
        this._resGroup.Add(url, Laya.Loader.IMAGE);
    }
    /**
     * 添加ui资源
     */
    protected addUI(url:string){
        url = Path.GetUI(url);//ResPath.PathConvert.GetUIJson(url);
        this.addRes(url, Laya.Loader.JSON);
    }
    /**
     * 添加图集
     */
    protected addAtlas(url:string){
        if(AssetConfig.enableFreeUIatlas){
            this.pushAutoFree(url);
        }
        this.addRes("res/atlas/remote/"+url, Laya.Loader.ATLAS);
    }

    private pushAutoFree(url:string){
        if(!this.autoFreeAtlas){
            this.autoFreeAtlas = [];
        }
        if(this.autoFreeAtlas.indexOf(url)==-1){
            this.autoFreeAtlas.push(url);
        }
    }

    /**销毁图集 */
    protected delAtlas(url:string){
        AssetConfig.clearTextureRes("res/atlas/remote/"+url);
    }

    protected get uiPath(){
        return ResPath.View.getRoot();
    }
    /**资源组清除 */
    private clearRes(): void {
        if (this._resGroup == null) return;
        this._resGroup.Clear();
        this._resGroup = null;
    }

    //#endregion

    //#region 事件组-该页面监听的自定义事件

    private _eventGroup: EventGroup;//事件组


    /**添加自定义事件 */
    protected addEventCus(eventid: string, callback: Function, caller: any): void {
        this.addEvent(eventid, callback, caller, null, EventType.Custom);
    }

    /**添加系统事件 */
    // protected addEventSys(eventid: string, callback: Function, caller: any, listener: Laya.Sprite, data?: any[]): void {
    // this.addEvent(eventid, callback, caller, listener, EventType.System, data);
    // }

    /**添加事件
     * @param eventid 事件id
     * @param callback 回调方法
     * @param caller 执行域-回调方法属于谁执行域就填谁
     * @param listener 监听对象-system类型时使用，其他类型填null
     * @param type 事件类型 system custom
     * @param data 参数
    */
    private addEvent(eventid: string, callback: Function, caller: any, listener: Laya.Sprite, type: EventType, data?: any[]): void {
        if (this._eventGroup == null) return;
        this._eventGroup.Add(caller, listener, eventid, callback, type, data);
    }

    /**添加事件监听 */
    private addEventListener(): void {
        if (this.IsListening) return;
        this.IsListening = true;
        if (this._eventGroup == null) this._eventGroup = new EventGroup();
        //
        // this.addEventCus(EventID.OnChangeLanguage, this.changeLanguage, this);

        //子类添加事件监听
        this.onAddEventListener();
    }

    /**清除事件监听*/
    private clearEventListenr(): void {
        if (!this.IsListening) return;
        this.IsListening = false;
        if (this._eventGroup == null) return;
        this._eventGroup.Clear();
        this._eventGroup = null;
    }

    //#endregion

    //#region 实例

    //页面类型
    public ViewType: EViewType = EViewType.None;
    //页面文件路径
    public ViewPath: string = "";
    //用作多语言配置
    // public LanguageType: string = "";
    //页面类型-根据不同类型做动画表现，这里的设计有问题，后面要修改一下
    public PageType: EPageType = EPageType.CloseBigToSmall;
    //层级类型
    private LayerType: ELayerType;

    public UI: Laya.View = null;
    // protected AniView: Laya.Sprite = null;
    protected ViewParent: Laya.Sprite;

    protected hasInit: boolean = false;
    protected IsListening: boolean = false;
    protected Data: any = null;
    protected Callback: Callback;
    private readonly useTime:number = 200;
    private _isShow:boolean;

    public Enter(callback: Callback, data: any,viewParent?): void {
        // LogSys.Log(this.constructor.name, "[OnEnter]");
        this.Data = data;
        this.Callback = callback;
        this.onEnter();

        if (!this.hasInit) {
            if(viewParent){
                this.ViewParent = viewParent;
            }else{
                this.ViewParent = LayerHelper.GetLayer(this.LayerType);
            }
            this.firstInit();
        }
        else {

        }

        Updater.Ins.AddUpdate(this, this.onUpdate);
        Updater.Ins.AddFixedUpdate(this, this.onFixedUpdate);
        Updater.Ins.AddLateUpdate(this, this.onLateUpdate);
    }

    private finish(){
        // LogSys.Log(this.constructor.name, "[OnExit]");
        MainModel.Ins.off(TowerMainEvent.MainViewLayerChange,this,this.onMainViewLayerChange);
        // YinDaoModel.Ins.off(YinDaoModel.UPDATE_VIEW,this,this.onYinDaoView);
        Updater.Ins.RemoveUpdate(this);
        Updater.Ins.RemoveFixedUpdate(this);
        Updater.Ins.RemoveLateUpdate(this);
        this.enableDrag = false;
        this.disposeTitleHero();
        // if(this.checkGuide){
        //     YinDaoModel.Ins.removeYD();
        // }
        E.ViewMgr.Close(EViewType.RewardTip);
        E.ViewMgr.Close(EViewType.BoxTip);
        E.ViewMgr.Close(EViewType.ItemTip);
        this.onExit();

        //自动销毁图集==============================================
        if(this.autoFreeAtlas){
            for(let i = 0;i <  this.autoFreeAtlas.length;i++){
                let url = this.autoFreeAtlas[i];
                Laya.Loader.clearTextureRes("res/atlas/remote/"+url);
            }
        }
        //=========================================================

        GuideModel.Ins.event(EGuideEvent.GuideViewHide,this.ViewType);

        if(this.mMainSnapshot){
            // MainModel.Ins.mainMask = false;
        }
        if(this._maskLayer){
            this._maskLayer.removeSelf();
            this._maskLayer.offAll(Laya.Event.CLICK);
        }
        if(this._bgcloseMask){
            this._bgcloseMask.removeSelf();
            this._bgcloseMask.offAll(Laya.Event.CLICK);
        }
        if(this.checkGuide){
            // E.yinDaoMgr.removeYD();
            // E.localGuideMgr.removeYD();
        }
        if(this.isClearTimer){
            Laya.timer.clearAll(this);
        }
        this.stopSound();
        //=====================================================================================
        if(StaticDataMgr.Ins.isLoaded){
            let cfg = t_Func_Popup.Ins.getCfgByViewId(this.ViewType);
            if(cfg){
                TowerMainFightModel.Ins.popView();
            }
        }
        GuideModel.Ins.viewCloseActionGoto(this.ViewType);
        //=====================================================================================
    }

    public Exit(): void {
        this.clear();
    }

    protected onUpdate(): void { }
    protected onLateUpdate(): void { }
    protected onFixedUpdate(): void { }

    /**是否初始化 */
    public HasInit(): boolean { return this.hasInit; };
    /**是否显示 */
    public IsShow(): boolean {
        return this.UI && this.UI.visible && this.ViewParent != null;
    }
    /**在顶层 */
    get bInTop(){
        return E.ViewMgr.topViewType == this.ViewType;
    }

    /**首次加载处理
     * -首次初始化需要加载资源
    */
    private firstInit() {
        if (this.hasInit) return;
        this.hasInit = true;

        this.start();
/*
        if (!this.ViewPath) {
            this.start();
        } else {
            E.ResMgr.ViewOpen(this.ViewPath, (v) => {
                this.start();
            });
        }
*/
    }

    private setTitle(){
        // if(this.UI){
        //     let v:IViewBaseTitle = this.UI as any;
        //     if(typeof v.title!="undefined"){
        //         let cfg = t_ViewTitle.Ins.getByViewType(this.ViewType);
        //         if(cfg && !StringUtil.IsNullOrEmpty(cfg.f_title)){
        //             v.title.text = cfg.f_title+"";
        //         }
        //     }
        // }
    }

    private start(){
        this.btnList = [];
        this.onFirstInit();
        this.setTitle();

        DebugUtil.draw(this.UI,"#ff00ff");
        DebugUtil.drawTF(this.UI,""+this.ViewType + "","#ffff00");
        this.init();
    }

    protected onCloseHandler(): void {
        this.Close();
    }
    protected Close(){
        // this.bNextGuideStep && GuideModel.Ins.nextGuideStep();
        E.ViewMgr.Close(this.ViewType);
    }
    private _maskLayer:Laya.Sprite;
    // static defaultMaskAlpha:number = 0.8;
    /**自定义透明alpha */
    protected maskAlpha:number;// = this.defaultMaskAlpha;
    protected onMaskClick(e:Laya.Event){
        // e.stopPropagation();
        if(!this.mMaskClick){
            return;
        }
        this.onMaskClose();
        this.onCloseHandler();
    }

    protected onMaskClose(){

    }

    private initMask(){
        this.onMaskAlpha();
        // if(!ViewBase._maskLayar){
        //     ViewBase._maskLayar = new Laya.Image();
        // }
        // this._maskLayer =ViewBase._maskLayar;
        if(!this._maskLayer){
            this._maskLayer = new Laya.Image();
        }
        // this.ViewParent.addChild(this._maskLayer);
        this._maskLayer.graphics.clear();
        this._maskLayer.graphics.drawRect(0,0,this.ViewParent.width,this.ViewParent.height,"#000000");
        // console.log("window.devicePixelRatio:"+window.devicePixelRatio);
        // this._maskLayer.skin = `remote/common/base/img_mask.png`;
        this._maskLayer.size(this.ViewParent.width, this.ViewParent.height);
        this._maskLayer.pos(0, 0);
        // this._maskLayer.width = this.ViewParent.width;
        // this._maskLayer.height = this.ViewParent.height;
        this._maskLayer.hitArea = new Laya.Rectangle(0,0,this.ViewParent.width,this.ViewParent.height);
        // if(initConfig.maskColor){
        // this.maskAlpha = 0.1;
        // }
        if(this.maskAlpha == undefined){
            this.maskAlpha = 0.8;//MainModel.Ins.skinStrategy.defaultMaskAlpha;
        }
        this._maskLayer.alpha = this.maskAlpha;
        // this._maskLayer.left = this._maskLayer.right = this._maskLayer.bottom = this._maskLayer.top = 0;
        this._maskLayer.offAll(Laya.Event.CLICK);
        this._maskLayer.on(Laya.Event.CLICK,this,this.onMaskClick);
    }

    // private addUiBgClose(){
    //     if(this.uiBgCloseClick){
    //         if(!this._bgcloseMask){
    //             this._bgcloseMask = new Laya.Sprite();
    //             this._bgcloseMask.alpha = 0.35;
    //         }
    //         this._bgcloseMask.on(Laya.Event.CLICK,this,this.Close);
    //         this.UI.addChildAt(this._bgcloseMask,0);
    //         this._bgcloseMask.hitArea = new Laya.Rectangle(0,0,this.UI.width,this.UI.height);
    //         if(debug){
    //             this._bgcloseMask.graphics.clear();
    //             this._bgcloseMask.graphics.drawRect(0,0,this.UI.width,this.UI.height,"#0000ff");
    //         }
    //         // this.setMouseBg(this._bgcloseMask);
    //     }
    // }

    protected onMaskAlpha(){

    }
    private get mNeedMask(){
        return !this.disableMask && this.mMask;
    }

    private _titleHero:HeroAvatarView;
    private setTitleHero(){
        let skin:IUISkin = this.UI as any;
        if (skin) {
            if (skin.titleHero) {
                let id = parseInt(skin.titleHero.name);//this.UI["titleHero"].name
                this._titleHero = ViewBase.createBigHeroAvatar.runWith([id, skin.titleHero]);
            }
        }else {
            LogSys.Warn(`============>ViewType:${this.ViewType} skin is null`);
        }
    }

    private disposeTitleHero(){
        if(this._titleHero){
            this._titleHero.dispose();
            this._titleHero = null;
        }
    }

    showUpdate(data){
        if(this.mShowUpdate){
            this.Data = data;
            this.onInit();
            this.SetCenter();
        }
    }

    // private mScale:number = 1;
    /**初始化 */
    private init() {
        if(this.mNeedMask){
            this.initMask();
        }
        // this.addUiBgClose();

        if(this.mClickAnyAreaClose){
            this.UI.on(Laya.Event.CLICK,this,this.onCloseHandler);
        }
        // this.ViewParent.addChild(this.UI);
        // this.UI.visible = false;

        // let _stime = Laya.timer.currTimer;
        // if(this.checkGuide){
        // YinDaoModel.Ins.removeYD();
        // }
        this.onInit();
        if(this.UI){
            this.setTitleHero();
            MainModel.Ins.on(TowerMainEvent.MainViewLayerChange,this,this.onMainViewLayerChange);
            Laya.timer.once(this.curPageType == EPageType.None ? 0 : this.useTime, this, this.onLaterInit);
        }
    }

    private get curPageType(){
        if(GuideModel.Ins.uiCloseEffect.indexOf(this.ViewType)!=-1){
            return EPageType.None;
        }
        return this.PageType;
    }

    private onYinDaoView(){
        if(this._isShow && this.checkGuide){
            // Laya.timer.callLater(this,()=>{
            //     this.onShowYD();
            // })
            Laya.timer.callLater(this,this.onShowYD);
        }
    }

    private onMainViewLayerChange(){
        this.onShowYD();
    }
    private onLaterInit(){
        if(this.mNeedMask && this._maskLayer){ 
            this.ViewParent.addChild(this._maskLayer);
        }
        this.ViewParent.addChild(this.UI);
        this.UI.visible = true;

        // LogSys.Log("UI:" + this.constructor.name + " set vis true");
        // this.enableCloseBtn = true;

        // this.changeLanguage();

        // this.proportion = 1;
        // this.AniView = this.UI;//this.UI.getChildByName("AniView") as Laya.Box;
        this.openEffect();

        // 添加监听
        this.addEventListener();
        // this.updateLayer();
        
        if(this.mMainSnapshot){
            // MainModel.Ins.mainMask = true;
        }
        this.SetLayout();
        this._isShow = false;
        if(this.curPageType == EPageType.CloseBigToSmall){
            
        }else{
            Laya.timer.callLater(this,this.onShow);
        }
        if (this.Callback) this.Callback.Invoke();
    }

    private openEffect(){
        if (this.curPageType == EPageType.CloseBigToSmall) {
            this.UI.scale(0.8, 0.8);
            TweenUtil.Scale(this.UI, 1, 1, this.useTime, TweenEase.backOut, Laya.Handler.create(this, this.onShow));
        } else {
            this.UI.scaleX = this.UI.scaleY = 1;
        }
    }

    private onShowYD(){
        if(this.checkGuide){
            // E.yinDaoMgr.removeTS();
            // E.yinDaoMgr.removeYD();
            // E.yinDaoMgr.showYD(this.ViewType);
            // E.yinDaoMgr.showFunYD(this.ViewType);
        
            // E.localGuideMgr.removeTS();
            // E.localGuideMgr.removeYD();
            // E.localGuideMgr.showYD(this.ViewType);
            
            GuideModel.Ins.showYD(this.ViewType);
            // YinDaoModel.Ins.addYD(this.ViewType);
        }
    }
    /**代表UI动画已经播放完成,界面已经在舞台上 没有后续的 UI特效行为了*/
    protected onShow() {
        if (this.mHitFull) {
            let screenW: number = Laya.stage.width;
            let screenH: number = Laya.stage.height;
            let rect:Laya.Rectangle = new Laya.Rectangle((this.UI.width - screenW) / 2, (this.UI.height - screenH) / 2, screenW, screenH);
            this.UI.hitArea = rect;
            if(this.mDebug){
                this.UI.graphics.clear();
                this.UI.graphics.drawRect(rect.x,rect.y,rect.width,rect.height,"#0000ff77");
                LogSys.Log(`${this.ViewType} set hit...`);
            }
        }
        this._isShow = true;
        // YinDaoModel.Ins.on(YinDaoModel.UPDATE_VIEW,this,this.onYinDaoView);
        this.onShowYD();
        this.playSound();
        //=======================================
        let vo:IViewBaseUiVo = this.Data;
        if(vo && vo.onShowHandler){
            vo.onShowHandler.run();
        }
    }

    /**重置碰撞区域为整个舞台 在适配窗口改变尺寸的时候SetCenter中调用*/
    protected resetHitRect(){
        let screenW: number = Laya.stage.width;
        let screenH: number = Laya.stage.height;
        let rect:Laya.Rectangle = new Laya.Rectangle((this.UI.width - screenW) / 2, (this.UI.height - screenH) / 2, screenW, screenH);
        this.UI.hitArea = rect;
        if(debug){
            this.UI.graphics.clear();
            this.UI.graphics.drawRect(rect.x,rect.y,rect.width,rect.height,"#0000ff77");
        }
    }

    private playSound(){
        if(StaticDataMgr.Ins.isLoaded){
            let cfg = t_Function_Sound.Ins.getCfgById(this.ViewType);
            if(cfg){
                E.AudioMgr.StopSound();
                E.AudioMgr.PlaySound1(cfg.f_file_name);
            }
        }
    }

    private stopSound(){
        if(StaticDataMgr.Ins.isLoaded){
            let cfg = t_Function_Sound.Ins.getCfgById(this.ViewType);
            if(cfg){
                E.AudioMgr.stopCurSound(cfg.f_file_name);
            }
        }
    }

    // private updateLayer() {
    // MainModel.Ins.event(TowerMainEvent.MainViewLayerChange,[this.ViewType]);
    // }

    /**界面重新到最上层 */
    protected onPop(){

    }
    protected get destroyed(){
        return !this.hasInit;
    }
    private clear() {
        this.finish();
        this.clearEventListenr();
        this.clearRes();
        this.hasInit = false;
        
        // console.log("clear "+this.ViewType+","+this.UI);
        if (this.UI) {
            Laya.timer.clear(this, this.onLaterInit);
            // LogSys.Log("UI:" + this.constructor.name + " set vis false");
            TweenUtil.ClearAll(this.UI);
            this.UI.removeSelf();
            this.UI.visible = false;
            if(this.autoFree){
                this.closeCtl && this.closeCtl.dispose();
                while(this.btnList.length){
                    let btn = this.btnList.pop();
                    btn.dispose();
                }
                this.UI.destroy(true);
                this.UI = null;
                // Laya.Resource.destroyUnusedResources();
            }
        }
        // this.updateLayer();
        this.clearLayerChange();
    }

    clearLayerChange(){
        let findIndex:number = this.guideModel.closeMainViewLayerChange.findIndex(o=>o==this.ViewType);
        if(findIndex != -1){
            this.guideModel.closeMainViewLayerChange.splice(findIndex,1);
            return;
        }
        if(!this.disabeLayerChange){
            MainModel.Ins.event(TowerMainEvent.MainViewLayerChange);
        }
    }

    private get guideModel():IGuideModel{
        return GuideModel.Ins;
    }
    /**设置页面数据 */
    protected onInitData() { }
    /**设置初始UI显示 */
    protected onInitUI() { }
    /**绑定UI相关事件 */
    protected onInitEvent() { }

    public SetLayout() {
        this.SetCenter();
        // if(Laya.Browser.onPC){
        //     this.onShowYD();
        // }
    }

    /**设置UI语言 */
    // private changeLanguage(): void {
    // if (!StringUtil.IsNullOrEmpty(this.LanguageType)) {
    // this.Language = E.LangMgr.GetLanguageLabel(this.LanguageType);
    // }
    // this.onChangeLanguage();//不设置语言包的界面也需要更新这个接口更新视图
    // }

    protected bottomLayout(offsetY: number = 0) {
        let viewParent: Laya.Sprite = this.ViewParent;
        this.UI.anchorX = this.UI.anchorY = 0.5;
        this.UI.x = viewParent.width >> 1;
        // this.UI.y = viewParent.height / 2 + (ScreenAdapter.DefaultHeight - this.UI.height) / 2  + offsetY;
        this.UI.y = Laya.stage.height - this.UI.height / 2 + offsetY - E.sdk.bottomInset;
    }

    //#endregion
}