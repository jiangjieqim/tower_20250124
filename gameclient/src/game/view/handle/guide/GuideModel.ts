import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { ui } from "../../../../ui/layaMaxUI";
import { EViewType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { LayerMgr } from "../../../layer/LayerMgr";
import { BaseCfg } from "../../../static/json/data/BaseCfg";
import { IComposeModel, ITowerMainModel } from "../compose/ICompose";
import { CheckParamUtils } from "./CheckParamUtils";
import { ActionMgr } from "./guideaction/actionMgr";
import { GuideArrowNew } from "./GuideArrowNew";
import { GuideUtils } from "./GuideUtils";
import { SmallFingerView } from "./SmallFingerView";

export class FuncOpenData{
    img:string;
    // nextStep:boolean;
    // /**是否要蒙版 */
    // mask:boolean;
}
export interface IGuideCardShow{
    cardList:number[];
    // nextStep:boolean;
}

export class t_Tasks_Guide extends BaseCfg {
    public taskList: any;
    // private _tableName:string;
    public GetTabelName(): string {
        return this._tableName;
    }
    constructor(name:string) {
        super(name);
        this.rebuild();
    }

    getIdByUI(type:EViewType){
        let l1:Configs.t_Tasks_Guide_dat[] = this.List;
        let _cfg = l1.find(o=>o.f_GuidePosition.indexOf(`${type}-`) == 0);
        if(_cfg){
            return _cfg;
        }
    }

    private rebuild() {
        // this.typeList = [];
        this.taskList = {};
        for (let i: number = 0; i < this.List.length; i++) {
            let cfg: Configs.t_Tasks_Guide_dat = this.List[i];
            let taskId = cfg.f_TaskID;
            if (!this.taskList[taskId]) {
                this.taskList[taskId] = [];
            }
            this.taskList[taskId].push(this.List[i]);
        }
    }


}

/*当文字秒速的小引导*/
class SmallGuideView extends ui.views.compose.guide.YinDaoView1UI {
    // private lb: Laya.Label;
    constructor() {
        super();
        // this.width = 300;
        // this.height = 300;

        // let spr = new Laya.Sprite();
        // spr.graphics.drawRect(0, 0, this.width, this.height, "#0000ff");
        // spr.alpha = 0.5;
        // this.addChild(spr);

        // this.lb = new Laya.Label();
        // this.lb.color = "#ff0000";
        // this.addChild(this.lb);
        // this.lb.fontSize = 30;
        // this._ui.hitArea = new Laya.Rectangle(0,0,this._ui.width,this._ui.height);  
    }
    setLab(cfg: Configs.t_Tasks_Guide_dat) {
        this.lab_name.text = `f_id:${cfg.f_id}-->${cfg.f_info}`;
    }

    hide(){
        if(this.parent){
            this.removeSelf();
        }
    }
}

export enum EGuideEvent{
    //下一步
    Next = "Next",
    //上报
    // ThinkdataUploadTa = "TT_UploadTa",
    //己方怪物波次创建
    Wave = "Wave",

    /**敌方怪物波次创建 */
    EnemyWave = "EnemyWave",

    /**更新右边栏 */
    UpdateTask = "UpdateTask",

    /**播放特效 */
    GuidePlayEffect = "Guideplayeffect",

    /**启动PVE章节切换 */
    GuidePVEChapter = "GuidePVE_Chapter",

    /**引导前置检测 */
    GuidePre = "GuidePre",

    /**组件隐藏检测 */
    GuideViewHide = "GuideViewHide",

    /**增加货币 */
    GuideAddMoney = "GuideAddMoney",

    /**创建己方英雄 */
    GuideCreateHero = "GuideCreateHero",

    /**创建卡牌 */
    GuideCreateCard = "GuideCreateCard",

    /**祈愿成功 */
    GuideGambleSucceed = "GuideGambleSucceed",

    /**修改Ai的速度 */
    ChangeAiSpeed = "ChangeAiSpeed",

    /**英雄伤害加成 */
    HeroHurtPer = "HeroHurtPer",

    /**解析一个卡牌特效 */
    ParseCardCell = "ParseCardCell",

    /**内部小手动画事件 */
    // ShowHandAnim = "ShowHandAnim",
    /**设置召唤按钮样式 */
    SommonUnlock = "SommonUnlock",

    /**退出 */
    Finish = "Finish",

    /**清理数据 */
    ClearData = "ClearData",

    //波次数据创建
    WaveDataCreate = "WaveDataCreate",

    /** 英雄卡池创建*/
    HeroPoolCreate = "HeroPoolCreate",

    /**创建敌方英雄 */
    GuideCreateEnemyIdHero = "GuideCreateEnemyIdHero",

    /**行为触发下一步 */
    ActionNextStep = "ActionNextStep",

    /**引导停止帧循环 */
    FrameStop = "FrameStop",

    /**引导继续帧循环 */
    FrameStart = "FrameStart",

    /**敌方获取道具 */
    EnemyActionMoneyGive = "EnemyActionMoneyGive",

    /**战斗结算 */
    GuideFightResult = "GuideFightResult",

    /**设置个人货币 */
    // GuideSetMoney = "GuideSetMoney",
    /**创建房间 */
    // CreateRoom = "CreateRoom",

    /**设置播放倍率 */
    MultiplyingPower = "MultiplyingPower",
    
    /**创建己方英雄卡池*/
    CreateHeroPool = "CreateHeroPool",

    /**设置己方祈愿卡池 */
    CreateOwnerGamblePool = "CreateOwnerGamblePool",

    /*创建当前己方的神话卡池 */
    CreareOwnerMythosPool = "CreateOwnerGamblePool",

    /**创建可以合成神话英雄 PVPRound中使用*/
    CreateMythosHerosPool = "CreateMythosHerosPool",
    /**显示黄色的范围圈圈 */
    ShowCirleYellow = "ShowCirleYellow",

    /**开始战斗特效变化 */
    EAnimStartEffect = "EAnimStartEffect"
}

enum EGuideKey {
    guidetask = "guidetask",
    guidecloseui = "guidecloseui"
}
export class ActionGogo{
    viewType:EViewType;
    targetId:number;
    f_id:number;
}
/**引导对外接口 */
export interface IGuideModel extends Laya.EventDispatcher{
    onInitCallBack();
    gotoByfid(id:number);
    curCfg:Configs.t_Tasks_Guide_dat;
    preCfg:Configs.t_Tasks_Guide_dat;
    nextGuideStep();
    isWeak:boolean;
    model:IComposeModel;
    towerModel:ITowerMainModel;
    uiCloseEffect:EViewType[];
    // scrollDrag:boolean;
    uiCloseAutoNextStep:ActionGogo[];
    uiDisableViewType:EViewType[];
    clear();
    actionMgr:ActionMgr;
    closeMainViewLayerChange:EViewType[];
    proxy:t_Tasks_Guide;
}

/**新手引导 */
export class GuideModel extends BaseModel implements IGuideModel{
    towerModel:ITowerMainModel;
    /**没有UI特效的界面 */
    uiCloseEffect:EViewType[] = [];
    uiCloseAutoNextStep:ActionGogo[] = [];
    /**禁用的界面 */
    uiDisableViewType:EViewType[] = [];

    /**关闭界面的时候禁用 TowerMainEvent.MainViewLayerChange事件*/
    closeMainViewLayerChange:EViewType[] = [];

    /**是否开启滑动 */
    // scrollDrag:boolean = true;
    // private openIds:number[] = [];
    // gambleCounter:GuideGambleCounter;
    model:IComposeModel;
    proxy:t_Tasks_Guide;
    /**当前的任务id用来指定在哪个区域的引导 */
    taskId: number;

    /**引导步骤索引 */
    index: number;
    //========================================================
    actionMgr:ActionMgr = new ActionMgr(this);
    private t_Tasks_GuideMap = {};
    private _fingerView:SmallFingerView;
    private _arrow:GuideArrowNew;
    private _smallGuide: SmallGuideView;

    /**当前的引导的步骤数组 */
    private get guideArr() {
        if(this.proxy){
            let taskArr = this.proxy.taskList[this.taskId];
            return taskArr;
        }
        return [];
    }
    //========================================================================
    /**开始引导 */
    startTaskId(id:number){
        this.taskId = id;
        this.index = 0;
    }

    clear(){
        // ScrollPanelControl.enableDrag = true;
        this.removeYD();
        this.uiCloseAutoNextStep = [];
        this.uiCloseEffect = [];
        // this.openIds = [];
        this.uiDisableViewType = [];
        this.closeMainViewLayerChange = [];
        this.actionMgr.clear();
    }

    /**当前引导是否是弱引导 */
    get isWeak(){
        let cfg = this.curCfg;
        return cfg && (cfg.f_weak == 1);
    }
    private static _ins: GuideModel;

    public static get Ins() {
        if (!this._ins) {
            this._ins = new GuideModel();
        }
        return this._ins;
    }
    public initMsg(): void {
        // throw new Error("Method not implemented.");
        // MainModel.Ins.on(TowerMainEvent.ButtonCtlClick,this,this.onButtonClick);
        E.EventMgr.on(EventID.ButtonCtlClick,this,this.onButtonClick);
        // this.on(EGuideEvent.REMOVE,this,this.removeYD);
    }

    private onButtonClick(skin:Laya.Sprite){
        this.clickEvt(skin);
    }
    public onInitCallBack(): void {
        // throw new Error("Method not implemented.");
        this.clear();
        this.index = 0;
        this.taskId = -1;   
    }

    /**是否允许检测引导 */
    // private get isCanCheckGuide() {
        // if(TaskModel.Ins.taskData){
        //     if(TaskModel.Ins.taskData.taskStatus == 3){//任务全部完成
        //         return;
        //     }
        // }
        // return true;
    // }

    /**当前的引导配置 */
    get curCfg(){
        let _cfg: Configs.t_Tasks_Guide_dat;
        let taskArr = this.guideArr;
        if (taskArr && taskArr.length > 0) {
            _cfg = taskArr[this.index];
        }
        return _cfg;
    }

    /**前置配置 */
    get preCfg() {
        let _cfg: Configs.t_Tasks_Guide_dat;
        let taskArr = this.guideArr;
        if (taskArr && taskArr.length > 0) {
            _cfg = taskArr[this.index - 1];
        }
        return _cfg;
    }

    /** 前置处理*/
    private preprocessing(_cfg: Configs.t_Tasks_Guide_dat){
        let _hideImgs:string = _cfg.f_hide_img;
        if(!StringUtil.IsNullOrEmpty(_hideImgs)){
            let hideList = _hideImgs.split("|");
            for(let i = 0;i < hideList.length;i++){
                let s = hideList[i];
                let img = GuideUtils.getUIByKeySt(s);
                if(img){
                    img.visible = false;
                }
            }
        }
        let _show_img:string = _cfg.f_show_img;
        if(!StringUtil.IsNullOrEmpty(_show_img)){
            let _showImgList = _show_img.split("|");
            for(let i = 0;i < _showImgList.length;i++){
                let s = _showImgList[i];
                let img = GuideUtils.getUIByKeySt(s);
                if(img){
                    img.visible = true;
                }
            }
        }
    }

    public showYD(type: number) {
        if (!E.ViewMgr.isOpenReg(type)) {//界面没打开
            return;
        }
        let _cfg: Configs.t_Tasks_Guide_dat = this.curCfg;
        this.showCfg(type,_cfg);
    }
    // private effect:NoContainerSimpleEffect;
    // private playAnim(_cfg: Configs.t_Tasks_Guide_dat){
    //     if(!StringUtil.IsNullOrEmpty(_cfg.f_spine_anim)){
    //         if(this.effect){
    //             LogSys.Warn(`anim is playing...`);
    //             return;
    //         }
    //         let arr = _cfg.f_spine_anim.split("|");
    //         this.effect=SpineEffectMgr.playOnce(arr[0],Laya.stage,Laya.stage.width/2,Laya.stage.height/2,parseInt(arr[1]),undefined,new Laya.Handler(this,this.onPlayEnd));
    //     }
    // }

    // private onPlayEnd(){
    //     if(this.effect){
    //         this.effect.dispose();
    //         this.effect = null;
    //         this.nextGuideStep();
    //     }
    // }

    checkParam(f_check_param:string,viewType:EViewType = EViewType.None){
        return CheckParamUtils.check(this,f_check_param,viewType);
    }
    private _guideUpLoad:string[] = [];
    private showCfg(type:number,_cfg: Configs.t_Tasks_Guide_dat){
        if (_cfg) {

            // if(_cfg.f_id == 7){
            // console.trace();
            // }

            if(debug){
                if(Laya.Utils.getQueryString("guide_f_id")){
                    let id:number = parseInt(Laya.Utils.getQueryString("guide_f_id"));
                    if(_cfg.f_id >= id){
                        console.trace();
                    }
                }
            }
            
            LogSys.Log(`.............showCfg:::.....${this.proxy.GetTabelName()},${_cfg.f_id}`);
            
            if(Laya.Utils.getQueryString("guide_stop")){
                if(_cfg.f_id >= parseInt(Laya.Utils.getQueryString("guide_stop"))){
                    return;
                }
            }
            
            let _thinkStr:string = `${this.proxy.GetTabelName()}_${_cfg.f_id}`;
            if(this._guideUpLoad.indexOf(_thinkStr)==-1){
                this._guideUpLoad.push(_thinkStr);
                E.sendTrack(_thinkStr);
            }

            this.preprocessing(_cfg);

            if (_cfg.f_isview) {
                E.ViewMgr.Open(EViewType.GuideHitUView);
                E.ViewMgr.Open(EViewType.YinDaoView, null, this);
            } else {
                let arr = _cfg.f_GuidePosition.split("-");
                if (type == parseInt(arr[0])) {

                    let param1:string = arr[1];
                    // let param2:string = arr[2];
                    if(param1 == "guideanim"){
                        // if(this.openIds.indexOf(_cfg.f_id) != -1){
                        //     LogSys.Warn(`已经触发过${param1}: f_id:${_cfg.f_id}`);
                        //     return;
                        // }
                        // this.openIds.push(_cfg.f_id);
                        // this.playAnim(_cfg);
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guidefuncopen"){
                        // let funcImg = _cfg.f_func_img;
                        // if(!StringUtil.IsNullOrEmpty(funcImg)){
                        //     if(this.openIds.indexOf(_cfg.f_id) != -1){
                        //         LogSys.Warn(`已经触发过${param1}: f_id:${_cfg.f_id}`);
                        //         return;
                        //     }
                        //     this.openIds.push(_cfg.f_id);
                        //     if(E.ViewMgr.isOpenReg(EViewType.FuncOpenView)){
                        //         return;
                        //     }
                        //     // let _nextStep:boolean = true;
                        //     // if(parseInt(_cfg.f_param) == 1){
                        //     // _nextStep = false;
                        //     // }
                        //     LogSys.Log(`guidefuncopen******************showCfg:::.....${_cfg.f_id}`);
                        //     let fobj = new FuncOpenData();
                        //     fobj.img = funcImg;
                        //     E.ViewMgr.Open(EViewType.FuncOpenView, null, fobj);
                        //     return;
                        // }
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guidewave"){
                        // this.event(EGuideEvent.Wave,_cfg.f_param);
                        // this.nextGuideStep();
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == EGuideKey.guidetask){
                        let uiType = EViewType.PveTaskGuide;
                        // let _taskDesc:string = _cfg.f_guidetask;
                        if(E.ViewMgr.isOpenReg(uiType)){
                            this.event(EGuideEvent.UpdateTask,_cfg);
                        }else{
                            E.ViewMgr.Open(EViewType.PveTaskGuide,null,_cfg);
                        }
                        let arr1 = _cfg.f_guidetask.split("|");
                        Laya.timer.clear(this,this.onNextGuide);
                        Laya.timer.once(parseInt(arr1[3]),this,this.onNextGuide);
                    }
                    else if(param1 == EGuideKey.guidecloseui){
                        // let view = parseInt(_cfg.f_param);
                        // if(E.ViewMgr.isOpenReg(view)){
                        //     LogSys.Log(`guidecloseui******************showCfg:::.....${_cfg.f_id}`);
                        //     E.ViewMgr.Close(view);
                        //     this.nextGuideStep();
                        // }
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guidehero"){
                        //打开一个英雄活得面板
                        // this.openGetHeroReward(parseInt(_cfg.f_param));
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guide_cardtips"){
                        //预览卡牌
                        // let vo:IGuideCardShow = {} as IGuideCardShow;
                        // let arr = _cfg.f_param.split("|");
                        // vo.cardList = [];
                        // for(let i = 0;i < arr.length;i++){
                        //     vo.cardList.push(parseInt(arr[i]));
                        // }
                        // // vo.nextStep = true;
                        // E.ViewMgr.Open(EViewType.CardTipsGuide,null,vo);
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guide_createhero"){
                        // this.event(EGuideEvent.GuideCreateHero,_cfg.f_param);
                        // this.nextGuideStep();
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guide_createcard"){
                        // this.event(EGuideEvent.GuideCreateCard,_cfg.f_param);
                        // this.nextGuideStep();
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guidereward"){
                        // if(this.openIds.indexOf(_cfg.f_id) != -1){
                        //     LogSys.Warn(`已经触发过${param1}: f_id:${_cfg.f_id}`);
                        //     return;
                        // }
                        // this.openIds.push(_cfg.f_id);
                        // E.ViewMgr.Open(EViewType.GuideRewardView,null,_cfg.f_param);
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guideeffect"){
                        // if(this.openIds.indexOf(_cfg.f_id) != -1){
                        //     LogSys.Warn(`已经触发过${param1}: f_id:${_cfg.f_id}`);
                        //     return;
                        // }
                        // this.openIds.push(_cfg.f_id);
                        // //在场景中播放特效
                        // this.event(EGuideEvent.GuidePlayEffect,_cfg.f_param);
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guide_action"){
                        //引导事件
                        let ms:number = this.actionMgr.parse(this.proxy.List,_cfg);
                        if(ms == 0){
                            //下一个步骤
                            this.nextGuideStep();
                        }else if(ms > 0){
                            //延迟ms之后下一步 
                            Laya.timer.once(ms,this,this.nextGuideStep);
                        }
                        else if(ms == -1){
                            //不处理 parse内部会进行下一步处理
                        }
                        else if(ms == -2){
                            LogSys.Warn(`重复Action f_id:${_cfg.f_id} 触发.`);
                        }
                    }
                    else if(param1 == "guide_action_clear"){
                        // this.actionMgr.del(parseInt(_cfg.f_param));
                        // this.nextGuideStep();
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guide_pve_chapter"){
                        // this.onInitCallBack();
                        // LogSys.Log(`${param1}----->${_cfg.f_param}`);
                        //进入下一个引导章节
                        // this.event(EGuideEvent.GuidePVEChapter,parseInt(_cfg.f_param));
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guide_finish"){
                        // this.model.clearScene();
                        // this.onInitCallBack();
                        // //退出引导
                        // this.event(EGuideEvent.Finish,parseInt(_cfg.f_param));
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    else if(param1 == "guidepre"){
                        //回退检测
                        this.event(EGuideEvent.GuidePre,_cfg.f_param);
                    }
                    else if(param1 == "guidegive"){
                        //添加货币
                        // if(this.openIds.indexOf(_cfg.f_id) != -1){
                        //     //货币是不可以重复获取的
                        // }else{
                        //     this.openIds.push(_cfg.f_id);
                        //     this.event(EGuideEvent.GuideAddMoney,_cfg.f_param);
                        //     this.nextGuideStep();
                        // }
                        LogSys.Error(`===============================未实现${param1}`);
                    }
                    // else if(param1 == "guidemonster"){
                    //     this.event(EGuideEvent.GuideMonster,_cfg.f_param);
                    // }
                    else{
                        let sp = GuideUtils.getUIByKeySt(_cfg.f_GuidePosition);
                        if (sp) {
                            LogSys.Log(`指向显示型引导 f_id:${_cfg.f_id}`);
                            if(this.checkParam(_cfg.f_check_param)){
                                return;
                            }
                            this.addArrow(_cfg);

                            if (!StringUtil.IsNullOrEmpty(_cfg.f_grid)) {
                                this.addFinger(sp, _cfg.f_grid);//,0,-ComposeConfig.cellH/2
                            }
                        }else{
                            this.checkWarn(_cfg);
                        }
                    }
                }
            }
        }
    }

    private checkWarn(_cfg:Configs.t_Tasks_Guide_dat){
        let checkArr:string[] = ['guidestart'];
        for(let i = 0;i < checkArr.length;i++){
            let s = checkArr[i];
            if(_cfg.f_GuidePosition.indexOf(s)!=-1){
                return;
            }
        }
        LogSys.Warn(`未找到:${_cfg.f_id}--------------->${_cfg.f_GuidePosition}`);
    }

    /**界面关闭时候触发器 */
    viewCloseActionGoto(viewType:EViewType){
        LogSys.Log(`Close:${viewType}`);
        let fIndex:number = this.uiCloseAutoNextStep.findIndex(o=>o.viewType == viewType);
        if(fIndex!=-1){
            let vo = this.uiCloseAutoNextStep[fIndex];
            GuideModel.Ins.uiCloseAutoNextStep.splice(fIndex,1);
            LogSys.Log(`关闭界面${viewType}触发引导到 ${vo.targetId}`);
            this.gotoByfid(vo.targetId);
        }
    }

    /**添加到屏幕 */
    public addToScreen(dest: Laya.Sprite, sp: Laya.Sprite, offsetX: number, offsetY: number) {
        if(!sp.parent){
            LogSys.Error(`addToScreen sp.parent is null...`);
            return;
        }
        let x = (sp.parent as Laya.Sprite).localToGlobal(new Laya.Point(sp.x, sp.y)).x;
        let y = (sp.parent as Laya.Sprite).localToGlobal(new Laya.Point(sp.x, sp.y)).y;
        LayerMgr.Ins.screenEffectLayer.addChild(dest);
        x += offsetX;
        y += offsetY;
        // if (topLimit) {
        // LogSys.Log(`addToScreen:` + x + "," + y);
        // }
        dest.x = x;
        dest.y = y;
    }
    /**显示一个手指移动动画 */
    private addFinger(sp:Laya.Sprite,_posStr:string,offsetX:number = 0,offsetY = 0){
        if(!this._fingerView){
            this._fingerView = new SmallFingerView();
        }
        this.addToScreen(this._fingerView,sp,offsetX,offsetY);
        this._fingerView.show(_posStr);
    }
    /**显示一个箭头指引对话框*/
    private addArrow(
        gCfg:Configs.t_Tasks_Guide_dat)
        // value: string, xy: string, index: number = 0) 
    {
        // ,gCfg.f_GuidePosition, gCfg.f_XY, gCfg.f_handposition
        let value = gCfg.f_GuidePosition;
        let xy = "";
        if(!StringUtil.IsNullOrEmpty(gCfg.f_XY)){
            xy = gCfg.f_XY;
        }
        // let index = gCfg.f_handposition;

        let arrXY = xy.split(";");
        let sp = GuideUtils.getUIByKeySt(value);
        if (!sp) {
            LogSys.Warn("addArrow ----->not find>>>>>>>>>>>>>>>>", value);
            return;
        }
        if (!this._arrow) {
            this._arrow = new GuideArrowNew();
        }
        let offX: number = 0;
        let offY: number = 0;
        if (arrXY[0]) {
            offX = parseInt(arrXY[0]);
        }
        if (arrXY[1]) {
            offY = parseInt(arrXY[1]);
        }
        if(sp.parent){
            this._arrow.init(gCfg);
            
            if(gCfg.f_inside_arrow){
                sp.addChild(this._arrow.container);
                this._arrow.container.x = offX;
                this._arrow.container.y = offY;
            }else{
                this.addToScreen(this._arrow.container,sp,offX,offY);
            }
            this._arrow.show(gCfg,sp);
            // LogSys.Log(`addArrow show ok...`);
        }else{
            LogSys.Error(`addArrow sp.parent is null...`);
        }
    }
    /**移除引导 */
    removeYD(){
        // if(this._type == 3){
        // this.removeSp();
        // this.getYinDaoView().removeSelf();
        // }

        //移除箭头_fm
        if(this._arrow){
            this._arrow.hide();
        }

        //移除small view
        if(this._smallGuide){
            // this._smallGuide.removeSelf();
            this._smallGuide.hide();
        }

        //移除手指动画
        if(this._fingerView){
            this._fingerView.hide();
        }
    }
    /**下一个引导Step */
    nextGuideStep() {
        // this.event(EGuideEvent.Next);
        this.onNextGuide();
    }

    private checkErr(index: number) {
        if(debug){
            let _cfg: Configs.t_Tasks_Guide_dat;
            let taskArr = this.guideArr;
            if (taskArr && taskArr.length > 0) {
                _cfg = taskArr[index];
            }
            if (_cfg == undefined) {
                let __cfg2: Configs.t_Tasks_Guide_dat;
                if(taskArr){
                    __cfg2 = taskArr[index - 1];
                }
                LogSys.Error(`GuideModel checkErr index:${index}... fid:` + (__cfg2 ? __cfg2.f_id : ""));
            }
        }
    }

    /**后置 */
    private onNextGuide(){
        let id = 0;
        if(this.curCfg){
            id = this.curCfg.f_id;
        }
        // LogSys.Trace(`onNextGuide id:${id}...`);
        // LogSys.Warn(`onNextGuide...pre id:${id}`);
        //==================================================
        // LogSys.Log("cur f_id:"+this.curCfg.f_id + " ,onNextGuide......");
        this.checkErr(this.index + 1);
        this.index++;
        this.refresh();
    } 

    private goto(taskId:number,index:number){
        this.taskId = taskId;
        this.index = index;
        this.refresh();
    }

    gotoByfid(id:number){
        let cfg:Configs.t_Tasks_Guide_dat = this.proxy.GetDataById(id);
        if(cfg){
            let taskId:number = cfg.f_TaskID;
            let findex = this.proxy.List.findIndex(o=>o.f_TaskID == taskId);
            let index = cfg.f_id - this.proxy.List[findex].f_id;
            this.goto(taskId,index);
        }else{
            LogSys.Warn(`id:${id} is not exist!!!`);
        }
    }

    /**前置 */
    preGuideStep(n:number = 1){
        if(this.curCfg){
            let old = this.curCfg.f_id;
            for(let i = 0;i < n;i++){
                this.index--;
            }
            this.curCfg && LogSys.Log(`回退步骤${n} ,${old}-->${this.curCfg.f_id}`);
        }
        this.refresh();
    }

    private refresh(){
        this.removeYD();
        let taskArr = this.guideArr;
        if (taskArr) {
            let gCfg:Configs.t_Tasks_Guide_dat = taskArr[this.index];
            if (gCfg) {
                let arr = gCfg.f_GuidePosition.split("-");
                this.showYD(parseInt(arr[0]));
            }
        }
    }

    private isNotCheck(cfg:Configs.t_Tasks_Guide_dat){
        let arr = [
            EGuideKey.guidetask
        ];
        for(let i = 0;i < arr.length;i++){
            let k = arr[i];

            // if(cfg.f_GuidePosition.indexOf("guide_action")!=-1 && parseInt(cfg.f_param.split("|")[0]) == EActionType.Task){
            //     return true;
            // }
            if(cfg.f_GuidePosition.indexOf(k)!=-1){
                return true;
            }
        }
        return false;
    }

    /**任何点击交互触发*/
    private clickEvt(skin:Laya.Sprite){
        let cfg = this.curCfg;

        // let taskArr = this.guideArr;
        // if(taskArr && taskArr.length > 0 && taskArr[this.index]){
        if(cfg){
            if(this.isNotCheck(cfg)){
                return;
            }
            
            let sp = GuideUtils.getUIByKeySt(cfg.f_GuidePosition);
                       
            if(!sp){
                LogSys.Warn("onClickEvtNOSP>>>>>>>>>>>>>>>>f_id:"+cfg.f_id + "-->" + cfg.f_GuidePosition);
                return;
            }
            
            if(skin == sp){
                LogSys.Log(`Click:${cfg.f_GuidePosition}`);
                this.nextGuideStep();
            }
        }
    }

    getTable(_name:string){
        if(!this.t_Tasks_GuideMap[_name]){
            this.t_Tasks_GuideMap[_name] = new t_Tasks_Guide(_name);
        }
        return this.t_Tasks_GuideMap[_name];
    }
}