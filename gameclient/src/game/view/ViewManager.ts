import { IView } from "../../frame/view/IView";
import { ViewBase } from "../../frame/view/ViewBase";
import { EMsgBoxType, EViewType } from "../common/defines/EnumDefine";
import { E } from "../G";
import { ELayerType } from "../layer/LayerMgr";
// import { Reward_revc } from "../network/protocols/BaseProto";
import { ResItemGroup } from "../resouce/ResItemGroup";
import { BaseCfg } from "../static/json/data/BaseCfg";
import { StaticDataMgr } from "../static/StaticDataMgr";
import { BoxTip } from "./handle/common/BoxTip";
import { GaiLvView } from "./handle/common/GaiLvView";
import { GetHeroView } from "./handle/common/GetHeroView";
import { ItemTip } from "./handle/common/ItemTip";
import { LoadingView, LoadingVo } from "./handle/common/LoadingView";
import { MidLabelCacheData, MidLabelView } from "./handle/common/MidLabelView";
import { MsgBoxNormal } from "./handle/common/MsgBoxNormal";
import { MsgBoxView } from "./handle/common/MsgBoxView";
import { IMsgBoxParms, MsgBoxView2 } from "./handle/common/MsgBoxView2";
import { RewardTip } from "./handle/common/RewardTip";
import { RewardView } from "./handle/common/RewardView";
import { TipView } from "./handle/common/TipView";
import { FunctionModel } from "./handle/funs/FunctionModel";
import { FuncProxy } from "./handle/funs/proxy/FunctionProxy";
import { GuideModel } from "./handle/guide/GuideModel";
import { LoginQuFuView } from "./handle/login/LoginQuFuView";
import { LoginViewNew } from "./handle/login/LoginViewNew";
import { PleaseWaitView } from "./handle/login/PleaseWaitView";
import { YinSiView } from "./handle/login/YinSiView";
import { IHelpViewData } from "./handle/main/interface/Interface";
import { EFuncDef } from "./handle/main/model/EFuncDef";
import { HelpPanelView } from "./handle/main/views/HelpPanelView";
import { TxtTipsView } from "./handle/main/views/TxtTipsView";
import { ItemVo } from "./handle/main/vos/ItemVo";
import { SheZhiModel } from "./handle/shezhi/model/SheZhiModel";
import { TowertMainView } from "./handle/towertmain/view/TowertMainView";
// import { SheZhiDingYueProxy } from "./handle/shezhi/proxy/SetZhiProxy";

class SheZhiDingYueProxy extends BaseCfg{
    private static _ins:SheZhiDingYueProxy;
    private _arr:any;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new SheZhiDingYueProxy();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Setting_Subscribe";
    }

    constructor(){
        super();
        this._arr = {};
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let type = this.List[i].f_type;
            if(!this._arr[type]){
               this._arr[type] = [];
            }
            let viewType = this.List[i].f_viewType;
            if(!this._map[viewType]){
                this._map[viewType] = {};
            }
            this._arr[type].push(this.List[i]);
            this._map[viewType][type] = this.List[i];
        }
    }

    public getListByType(type:number):Configs.t_Setting_Subscribe_dat[]{
        return this._arr[type];
    }

    public getCfgByViewType(viewType:number,type:number):Configs.t_Setting_Subscribe_dat{
        if(this._map[viewType] && this._map[viewType][type]){
            return this._map[viewType][type];
        }
    }
}

/**界面管理器*/
export class ViewManager {
    //#region 静态

    //#endregion

    //#region 实例

    private _hasInit: boolean = false;          //是否已初始化
    private _views: Map<EViewType, IView>;  //所有注册的页面k=页面类型，v=页面实例
    private _openViews: EViewType[];            //所有打开的页面
    // getUiIndex(type:EViewType){
    //     return this._openViews ? this._openViews.indexOf(type) : -1;
    // }

    /**顶层视图类型 */
    get topViewType(){
        if(this._openViews){
            let l = [];
            for(let i = 0;i < this._openViews.length;i++){
                let type = this._openViews[i];
                if((this.Get(type) as ViewBase).isCheckTop){
                    l.push(type);
                }
            }
            if(l.length > 0){
                return l[l.length - 1];
            }
        }
    }
    constructor() { }

    public OpenViews() { return this._openViews; }
    private openStatus:any = {};
    public Init(): boolean {
        if (this._hasInit) return false;
        this._hasInit = true;

        this._views = new Map<EViewType, IView>();
        this._openViews = [];

        this.initRegViews();

        return true;
    }

    /**注册页面
     * -所有需要用到的页面在这里注册
    */
    private initRegViews(): void {
        //layer-12-smallLoadingLayer
        this.Reg(new LoadingView(EViewType.Loading, ELayerType.smallLoadingLayer));

        //layer-8-alertLayer
        this.Reg(new MsgBoxView2(EViewType.MsgBox, ELayerType.noteLayer));
        this.Reg(new MidLabelView(EViewType.MidLabel,  ELayerType.alertLayer));
        this.Reg(new MsgBoxNormal(EViewType.MsgBoxNormal,ELayerType.alertLayer));

        this.Reg(new YinSiView(EViewType.YinSiView, ELayerType.subFrameLayer));
        this.Reg(new LoginViewNew(EViewType.LoginNew, ELayerType.subFrameLayer));
        this.Reg(new LoginQuFuView(EViewType.LoginQuFu, ELayerType.subFrameLayer));

        this.Reg(new PleaseWaitView(EViewType.Wait,ELayerType.alertLayer));
        this.Reg(new TowertMainView(EViewType.Main, ELayerType.flyLayer));

        this.Reg(new HelpPanelView(EViewType.HelpView, ELayerType.frameLayer));
        this.Reg(new TipView(EViewType.TipView, ELayerType.frameLayer));
        this.Reg(new TxtTipsView(EViewType.SmallTips,ELayerType.subFrameLayer));
        // this.Reg(new RewardGetView(EViewType.GetReward,ELayerType.subFrameLayer));

        this.Reg(new ItemTip(EViewType.ItemTip,ELayerType.alertLayer));
        this.Reg(new RewardTip(EViewType.RewardTip,ELayerType.subFrameLayer));
        this.Reg(new RewardView(EViewType.RewardView,ELayerType.subFrameLayer));
        this.Reg(new GetHeroView(EViewType.GetHeroView,ELayerType.subFrameLayer));
        this.Reg(new MsgBoxView(EViewType.MsgBoxView,ELayerType.subFrameLayer));
        this.Reg(new BoxTip(EViewType.BoxTip,ELayerType.subFrameLayer));
        this.Reg(new GaiLvView(EViewType.GaiLvView));
    }
    
    public OpenByFuncid(funcid:number,flag:boolean = true,param?){
        if(!FunctionModel.Ins.isOpenByFuncId(funcid,flag)){
            return;
        }
        let cfg:Configs.t_func_dat = FuncProxy.Ins.getCfgByFuncId(funcid);
        if(cfg){
            if(!cfg.f_viewType && StringUtil.IsNullOrEmpty(cfg.t_tab_func)){
                LogSys.Warn("funcid:" + funcid+" f_viewType is 0");
            }else{
                if(funcid == EFuncDef.GongGao){
                    SheZhiModel.Ins.openPopNotice(SheZhiModel.Ins.localNoticeList);
                }else if(funcid == EFuncDef.PHB){
                    if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.KFPHB,false)){
                        this.Open(EViewType.RankView2);
                    }else{
                        E.ViewMgr.Open(EViewType.RankView,null,1);
                    }
                }else{
                    this.Open(cfg.f_viewType,null,param);
                }
            }
        }
    }

    /**注册页面*/
    public Reg(iv: IView) {
        if (iv == null) { LogSys.Log("view is null"); return; }
        if (this._views[iv.ViewType]) { LogSys.Log("has registed viewtype:" + iv.ViewType); return; }

        this._views[iv.ViewType] = iv;
    }

    /**注销页面*/
    public UnReg(type: EViewType) {
        if (!this._views[type]) return;
        this._views[type] = null;

        delete this._views[type];
    }

    /**获取页面*/
    public Get(type: EViewType): IView {
        return this._views[type];
    }

    /**当前打开的页面数量*/
    public CurOpenNum(): number {
        return this._openViews.length;
    }

    /**开启页面*/
    public Open(type: EViewType, callback: Callback = null, data?: any,_viewParent?:Laya.Sprite): void {
        // if(!StaticDataMgr.Ins.uiLoaded){
        // LogSys.Warn(`uiLoaded false`);
        // return;
        // }

        if(GuideModel.Ins.uiDisableViewType.indexOf(type)!=-1){
            LogSys.Log(`界面${type}禁用中...`);
            return;
        }

        let iv: IView = this.Get(type);
        if (iv == null) {
            LogSys.Warn("未注册，不可打开:type=" + type);
            return;
        }

        this.openStatus[type] = type;

        if (iv.IsShow()) {
            iv.showUpdate(data);
            return;
        }
        // if(type == EViewType.Equip_switch){
        //     MainModel.Ins.event(MainEvent.Open_Equip_switch_View);
        // }
        LogSys.Log("Open " + type.toString());

        // console.log("EViewType>>>>>>>>>>>>",type);
        E.ResMgr.LoadGroup(iv.ResGroup,
            Callback.Create(this, () => {
                if(type!=EViewType.Wait){
                    this.closeWait();
                }
                
                this._openViews.push(type);
                iv.Enter(callback, data,_viewParent);
            }),
            Callback.Create(this, (v: number) => {
                if(type != EViewType.Wait){
                    this.openWait();
                }
                
                this.UpdateLoading(v);
            })
        );
        if(StaticDataMgr.Ins.isLoaded){
            let setVo:Configs.t_Setting_Subscribe_dat = SheZhiDingYueProxy.Ins.getCfgByViewType(type,initConfig.platform);
            if(setVo){
                E.sdk.getSubscribe([setVo.f_modelID]);
            }
        }
    }

    /**关闭页面*/
    public Close(type: EViewType): void {
        delete this.openStatus[type];
        let iv: IView = this.Get(type);
        if (iv == null) return;
        // 未开启
        if (!this.IsOpen(type)) return;

        ListUtil.Remove(this._openViews, type);
        iv.Exit();
    }

    /**是否已经进入了打开流程 */
    public isOpenReg(type:EViewType){
        return this.openStatus[type]!=undefined;
    }

    /**是否已打开该页面 */
    private IsOpen(type: EViewType): boolean {
        let contians: boolean = ListUtil.Contains(this._openViews, type);
        return contians;
    }

    /**是否有该页面*/
    public HasReg(type: EViewType): boolean {
        if (this._views[type])
            return true;
        return false;
    }

    public Clear() {
        this.CloseAll();
        this._views = null;
    }

    /**关闭所有页面*/
    public CloseAll() {
        GuideModel.Ins.removeYD();
        for (let i: number = this._openViews.length - 1; i >= 0; i--) {
            this.Close(this._openViews[i]);
        }
        Laya.Resource.destroyUnusedResources();
    }

    /**销毁指定页面
     * @param type 页面类型
     * @param newView 新替换的页面
    */
    public Destroy(newView: IView = null) {
        let oldView: IView = this.Get(newView.ViewType);
        if (oldView) {
            this.UnReg(newView.ViewType);
            oldView.Exit();
            oldView = null;
        }
        this.Reg(newView);
    }

    // /**是否有弹窗显示 */
    // public HasFrameOpen(): boolean {
    //     let hasOpen: boolean = false;
    //     this._openViews.forEach(type => {
    //         let view = this.Get(type);
    //         if (view && (view.LayerType == ELayerType.frameLayer || view.LayerType == ELayerType.subFrameLayer))
    //             hasOpen = true;
    //     })
    //     return hasOpen;
    // }
    /**除了指定的页面外是否有弹窗显示 */
    // public HasFrameOpenExcept(viewTypes: EViewType[]): boolean {
    //     let hasOpen: boolean = false;
    //     this._openViews.forEach(type => {
    //         let view = this.Get(type);
    //         if (view && (view.LayerType == ELayerType.frameLayer || view.LayerType == ELayerType.subFrameLayer) && !ListUtil.Contains(viewTypes, view.ViewType))
    //             hasOpen = true;
    //     })
    //     return hasOpen;
    // }

    /**有页面在输入文本 */
    public IsInputing(): boolean {
        let isInputing: boolean = false;

        // let worldchat = this.Get(EViewType.WorldChat) as WorldChatView;
        // if (worldchat.IsShow() && worldchat.IsInputFocus())
            // isInputing = true;
        // let amachat = this.Get(EViewType.AmaChat) as WorldChatView;
        // if (amachat.IsShow())
        //     isInputing = VideoModel.getIns().isInputing;

        return isInputing;
    }

    //#region 特殊打开页面方式

    /**显示消息盒子页面*/
    public ShowMsgBox(type: EMsgBoxType, content: string,sureCall: Laya.Handler=null, cancelCall: Laya.Handler=null,exitCall:Laya.Handler = null,params:IMsgBoxParms=null) {
        // this.Open(EViewType.MsgBox, Callback.Create(this, () => {
        //     let view: MsgBoxView = this.Get(EViewType.MsgBox) as MsgBoxView;
        //     view.ShowMsgBox(type, content, sureCall, cancelCall);
        // }), []);

        if(content == "tcp server not found"){
            content = "区服未开启";
        }

        if(this.isOpenReg(EViewType.MsgBox)){
            (this.Get(EViewType.MsgBox) as MsgBoxView2).show(type, content, sureCall, cancelCall, exitCall,params);
        }else{
            this.Open(EViewType.MsgBox, Callback.Create(this, () => {
                let view: MsgBoxView2 = this.Get(EViewType.MsgBox) as MsgBoxView2;
                view.show(type, content, sureCall, cancelCall,exitCall,params);
            }), []);
        }
    }

    public showMsgBoxView(vo:ItemVo,vo1:ItemVo,sureCall: Laya.Handler=null, cancelCall: Laya.Handler=null,params?){
        E.ViewMgr.Open(EViewType.MsgBoxView, Callback.Create(this, () => {
            let view: MsgBoxView = this.Get(EViewType.MsgBoxView) as MsgBoxView;
            view.showView(vo,vo1,sureCall, cancelCall,params);
        }), []);
    }

    /**显示文本提示*/
    public ShowMidLabel(content: string, color: string = "#ffffff") {
        let view = E.ViewMgr.Get(EViewType.MidLabel);
        if (view && view.IsShow()) {
            let _midView: MidLabelView = view as MidLabelView;
            let node: MidLabelCacheData = {} as MidLabelCacheData;
            node.content = content;
            node.color = color;
            _midView.midLabelList.push(node);
            return;
        }
        this.midDoOpen(content, color);
    }
    public midDoOpen(content: string, color: string = "#ffffff") {
        this.Open(EViewType.MidLabel, Callback.Create(this, () => {
            let view: MidLabelView = this.Get(EViewType.MidLabel) as MidLabelView;
            view.ShowMidLabel(content, color);
        }), []);
    }
    public ShowMidOk(content) {
        this.ShowMidLabel(content, "#ffffff");
    }

    public ShowMidError(content) {
        this.ShowMidLabel(content, "#ffffff");
    }

    public ShowDebugError(content){
        if(debug){
            console.error(content);
            this.ShowMidLabel(content, "#ffffff");
        }
    }

    public ShowLoading(v:number = 0): void {
        this.Open(EViewType.Loading, Callback.Create(this, () => {
            this.UpdateLoading(v);
        }), null);
    }

    public closeLoading(){
        if(this.isOpenReg(EViewType.Loading)){
            let loading:LoadingView =  (E.ViewMgr.Get(EViewType.Loading) as LoadingView);
            
            let vo = new LoadingVo();
            vo.start = loading.curVal;
            vo.end = 1;
            vo.duration = 1000;
            vo.callBack = new Laya.Handler(this, this.loadEnd);
            this.loading(vo);
        }
    }

    public loading(vo:LoadingVo){
        if(E.ViewMgr.isOpenReg(EViewType.Loading)){
            (E.ViewMgr.Get(EViewType.Loading) as LoadingView).playAnim(vo);
        }else{
            E.ViewMgr.Open(EViewType.Loading, null, vo);
        }
    }

    private loadEnd(){
        this.Close(EViewType.Loading);
    }

    public UpdateLoading(v: number) {
        let loading: LoadingView = this.Get(EViewType.Loading) as LoadingView;
        if (loading != null && loading.UI != null && loading.UI.visible) {
            loading.UpdateProgress(v);
        }
    }

    public SetLayout() {
        this._openViews.forEach(i => {
            this.Get(i).SetLayout();
        })
    }

    public Loading(res:ResItemGroup,endHander:Laya.Handler){
        // E.ViewMgr.ShowLoading();
        this.Open(EViewType.Loading, Callback.Create(this, () => {
            this.UpdateLoading(0);
            let loading = E.ViewMgr.Get(EViewType.Loading) as LoadingView;
            E.ResMgr.LoadGroup(res, Callback.Create(this, () => {
                E.ViewMgr.Close(EViewType.Loading);
                endHander.run();
    
                // GameCfg.Init();
                // E.ViewMgr.Open(EViewType.Login, null, []);//打开登陆页面
            }), Callback.Create(this, (v: number) => {
                if (loading != null) loading.UpdateProgress(v);
            }));
        }), null);
    }


    /**显示暂未开放 */
    public ShowNotYetOpen() {
        // 显示暂未开放
        this.ShowMidLabel(E.LangMgr.getLang("NotYetOpen"));//E.LangMgr.Tip[LanguageDefine.Tip.NotYetOpen]
    }

    //#endregion

    public openHelpView(title:string,desc:string){
        let _data:IHelpViewData = {} as IHelpViewData;
        _data.title = E.LangMgr.getLang(title);
        _data.desc = E.LangMgr.getLang(desc);
        this.Open(EViewType.HelpView,null,_data);
    }
    
    public openTipView(title:string,desc:string){
        let st = E.LangMgr.getLang(title);
        let st1 = E.LangMgr.getLang(desc);
        this.Open(EViewType.TipView,null,[st,st1]);
    }

    public openWait(autoClose:boolean = false) {
        this.Open(EViewType.Wait,null,autoClose);
    }
    public closeWait() {
        this.Close(EViewType.Wait);
    }

    // /**
    //  * 展示奖励
    //  */
    // public openReward(_items:Reward_revc|RewardGetData|RewardUseItem){
    //     //console.log("========>",_items);
    //     let view:RewardGetView = this.Get(EViewType.GetReward) as RewardGetView;
    //     if(E.ViewMgr.isOpenReg(EViewType.GetReward)){
    //         view.cacheList.push(_items);
    //         // view.setData(_items);
    //     }else{
    //         this.Open(EViewType.GetReward,null,_items);
    //     }
    // }

    public Update(type:EViewType){
        let view = this.Get(type);
        if(view.IsShow()){
            view.UpdateView();
        }
    }

    // private convert(list1,type:number,arr:string[],__index:number){
    //     // let list1 = ui[arr[__index]];
    //     let skinNode;
    //     //panel1-0-tiaozhanBtn
    //     if(list1 instanceof Laya.Panel){
    //         let panel:Laya.Panel = list1;
    //         if(panel.dataSource instanceof ScrollPanelControl){
    //             let sc:ScrollPanelControl = panel.dataSource;
    //             let index = parseInt(arr[__index+1]);
    //             let skin = sc.getRowCol(index,0);
    //             if(skin){
    //                 skinNode = skin[arr[__index+2]];
    //             }
    //         }
    //     }else if(list1 instanceof Laya.List){
    //         //list-0-sel
    //         let item = list1.getCell(parseInt(arr[__index+1]));
    //         if(item){
    //             skinNode = item[arr[__index+2]];
    //         }
    //     }
    //     /*
    //     else if(type == EViewType.Main && arr[__index] == "menu"){
    //         //9-menu-37 --->主界面的小菜单的funcid =37 的小icon
    //         let menu = (E.ViewMgr.Get(EViewType.Main) as MainView).botIconView;
    //         if(menu){
    //             let funcid:number = parseInt(arr[__index+1]);
    //             for(let i = 0;i <  menu.con1.numChildren;i++){
    //                 let item:Laya.View = menu.con1.getChildAt(i) as Laya.View;
    //                 if(item.dataSource == funcid){
    //                     skinNode = item;
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     */
        
    //     else if(arr.length == 4 && list1 instanceof Laya.View){
    //         let __index:number = 1;
    //         skinNode = this.convert(list1[arr[__index]],type,arr,__index);
    //         return skinNode;
    //     } else {
    //         let key1 = arr[__index];
    //         let key2 = arr[__index + 1];
    //         if (type == EViewType.Main) {
    //             if (key1.indexOf("func") == 0) {
    //                 let funcid = parseInt(key1.substr(4, key1.length - 4));
    //                 if (!isNaN(funcid)) {
    //                     let main = (E.ViewMgr.Get(EViewType.Main) as TowertMainView);
    //                     if (main) {
    //                         let u = main.getSkinUiByFuncId(funcid);
    //                         if (u) {
    //                             skinNode = u[key2];
    //                             return skinNode;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         let ui = this.Get(type).UI;
    //         if(ui && ui[key1] && ui[key1][key2]){
    //             skinNode = ui[key1][key2];
    //         }else{
    //             //27-con1-child0   -->Type 27的对象con1中的0号索引中的组件
    //             if(ui && ui[key1]){
    //                 const child = "child";
    //                 if(key2.indexOf(child) == 0){
    //                     let childIndex = key2.substr(child.length,key2.length - child.length);
    //                     let _nodeSpr = ui[key1];
    //                     if(typeof _nodeSpr.getChildAt == "function"){
    //                         return ui[key1].getChildAt(parseInt(childIndex));
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return skinNode;
    // }

    /**
     * 使用方法
     * let node = E.ViewMgr.getUIByKey(this.ViewType.toString(),"list1-0-bg1");
     * @param typesstr  
     * @param key 
    //  */
    // private getUIByKey(typesstr:string,key:string){
    //     let type = parseInt(typesstr);

    //     let skinNode:Laya.Sprite;
    //     // if(this.IsOpen(type)){
    //         // LogSys.Log("type " + type + " is Open!");

    //     let arr = key.split("-");
    //     if (arr.length <= 1) {
    //         let ui = this.Get(type).UI;
    //         if (ui) {
    //             skinNode = ui[key];
    //         }
    //     } else {
    //         let ui = this.Get(type).UI;
    //         if (ui) {
    //             let __index: number = 0;
    //             skinNode = this.convert(ui[arr[__index]], type, arr, __index);
    //         }
    //     }
    //     return skinNode;
    // }

    // public getUIByKeySt(str:string){
    //     let arr = str.split("-");
    //     let a = arr[0];
    //     let index:number = str.indexOf("-");
    //     return this.getUIByKey(a,str.substr(index+1,str.length-index-1));
    // }
    //#endregion
}