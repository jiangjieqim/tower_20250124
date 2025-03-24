// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { FuncSmallIcon, IBaseSmallIcon, ISDKSkinButton } from "../icon/FuncSmallIcon";
import { DouYinClientCtl } from "./DouYinClientCtl";
import { BaseSettingBtn } from "./LeftSmallFuncIcon";

class LeftMidIcon extends ui.views.main.ui_little_iconUI implements IBaseSmallIcon{
    get dot(){
        return this.redimg;
    }
    get icon(){
        return this.bg;
    }
}

// // 邮件按钮
// export class EmailBtn extends BaseSettingBtn{
//     private model: MainModel;

//     constructor(skin){
//         super(skin,EFuncDef.Email,null,E.getLang("email"));
//         this.model = MainModel.Ins;
//         // this.clickHandler = new Laya.Handler(this,this.onClick);
//     }
//     // private onClick(){
//         // E.ViewMgr.Open(EViewType.Mail);
//         // E.ViewMgr.OpenByFuncid(EFuncDef.Email);
//     // }
//     protected onDisplay() {
//         super.onDisplay();
//         this.model.on(MainEvent.MailRed, this, this.updateRed);
//         this.updateRed();
//     }
//     protected onUnDisplay() {
//         this.model.off(MainEvent.MailRed, this, this.updateRed);
//     }
//     public updateRed() {
//         this.redImg.visible = this.model.bMailRed;
//     }
// }

// /**邀请按钮 */
// export class YaoQingBtn extends BaseSettingBtn{
//     constructor(skin){
//         // super(skin,"remote/main/main/yq.png",E.getLang("yaoqinglb"),null);
//         // this.funcid = EFuncDef.YaoQing;
//         // this.clickHandler = new Laya.Handler(this,this.onYQHandler);
//         super(skin,EFuncDef.YaoQing,null,E.getLang("yaoqinglb"));
//     }
//     // private onYQHandler(){
//     // MainModel.Ins.openFunc(this.funcid);
//     // }
//     protected onDisplay() {
//         super.onDisplay();
//         YaoQingModel.Ins.on(YaoQingModel.UPDATA_RED, this, this.onRedUpdate);
//         this.onRedUpdate();
//     }
//     protected onUnDisplay() {
//         YaoQingModel.Ins.off(YaoQingModel.UPDATA_RED, this, this.onRedUpdate);
//     }

//     private onRedUpdate() {
//         this.redFlag = YaoQingModel.Ins.YQRed;
//     }
// }
/**设置按钮 */
// export class RealSettingBtn extends BaseSettingBtn{
    // constructor(skin){
        // super(skin,EFuncDef.Setting,null,E.getLang("setting"));
    // }
// }

/**冠名权 */
// export class RenameBtn extends BaseSettingBtn{
    // constructor(skin){
        // super(skin,EFuncDef.NamingRename,null,FuncProxy.Ins.getCfgByFuncId(EFuncDef.NamingRename).f_name);
    // }
// }
function updateGroup(btn:BaseSettingBtn){
    // const data = MainModel.Ins.shareReward;
    // if(data){
    //     const funcId = btn.funcid;//item.funcId;
    //     const d = data.dataList.find(o => o.funcId === funcId);
    //     if (d && (d.state !== 3) && MainModel.Ins.isOpenAllByFuncid(btn.funcid+"")) {
    //         // 0未激活 1已领取 2可领取 3功能未开启
    //         btn.visible = true;
    //         if (d.state === 2) {
    //             btn.redFlag = true;
    //         } else {
    //             btn.redFlag = false;
    //         }
    //     } else {
    //         btn.visible = false;
    //     }
    // }
}
/**分享到群 */
// export class BtnGroupShare extends BaseSettingBtn{
//     constructor(skin){
//         super(skin,EFuncDef.GroupShare,null,E.getLang("fxdq"));
//     }

//     updateRed(){
//         updateGroup(this);
//     }
// }

/**分享 */
// export class BtnDailyShare extends BaseSettingBtn{
//     // this.btn_daily_share = this.createBotLittleBtn(`remote/main/main/fx.png`,E.getLang("fx"),EFuncDef.FenXiang );//分享
//     constructor(skin){
//         super(skin,EFuncDef.FenXiang,null,E.getLang("fx"));
//     }
//     updateRed(){
//         updateGroup(this);
//     }
// }

/**称号 */
// export class TitleBtn extends BaseSettingBtn{
//     // this.createBotLittleBtn(`remote/main/main/ch_rk.png`,E.getLang("ch01"),EFuncDef.chenghao);//称号
//     constructor(skin){
//         super(skin,EFuncDef.chenghao,null,E.getLang("ch01"));
//     }
// }

/**抖音客服 */
class DouyinClientButton extends FuncSmallIcon implements ISDKSkinButton{
    private ctl:DouYinClientCtl = new DouYinClientCtl();
    updateLogicVis(v:boolean){
        this.ctl.updateLogicVis(this.skin,v);
    }
}
export class BaseLeftList{
    get visible(){
        return false;
    }

    set visible(v:boolean){
    }

    updateSdkButton(){

    }
    init(con:Laya.Sprite,leftCon:Laya.Sprite){
    }
    set openStatus(v:boolean){

    }
    updateRed(){

    }
}

export class NewLeftLiebiao extends BaseLeftList{
    init(con:Laya.Sprite,leftCon:Laya.Sprite){
        leftCon.visible = false;
    }
}

// export class LeftLieBiao extends BaseLeftList{
//     private midIcons:FuncSmallIcon[] = [];
//     private midbtnCon:Laya.Sprite = new Laya.Sprite();
//     /**按钮上下间隔 */
//     private readonly cellGap:number = 90;
//     /**邀请按钮 */
//     // private yaoqingBtn:SettingBtn;
//     /**设置按钮 */
//     // private settingBtn:SettingBtn;
//     /**邮件按钮 */
//     // private mailBtn:EmailBtn;
//     /**分享 */
//     // private btn_daily_share:SettingBtn;
//     /**添加桌面 */
//     // private btn_tjzm:SettingBtn;
//     /**分享到群*/
//     // private btn_group_share:SettingBtn;
//     get visible(){
//         return this.con.visible;
//     }

//     set visible(v:boolean){
//         this.con.visible = v;
//     }

//     private con:Laya.Sprite;
//     private model:MainModel;
//     // private _skinCls;
//     private btnList:SettingBtn[] = [];
//     // private _outSideSkin:IOutsideButton;
//     private onResSort(a:Configs.t_MainIcon_dat,b:Configs.t_MainIcon_dat){
//         if(a.f_mid_left_pos > b.f_mid_left_pos){
//             return -1;
//         }
//         else if(a.f_mid_left_pos < b.f_mid_left_pos){
//             return 1;
//         }
//         return 0;
//     }

//     refresh(){
//         let _count:number = 0;
//         for(let i = 0;i < this.midIcons.length;i++){
//             let icon = this.midIcons[i]
//             icon.refreshView();
//             if(icon.isOpen){
//                 icon.btnCtl.setpos(_count*this.cellGap,0);
//                 _count++;
//             }
//         }
//     }

//     private setLeftMid(v:boolean){
//         this.midbtnCon.visible = v;
//         this.updateSdkButton();
//     }

//     updateSdkButton(){
//         let v = this.midbtnCon.visible;//切换按钮是否隐藏
//         // if(E.ViewMgr.HasFrameOpenExcept([EViewType.Main])){
//         // v = false;
//         // }

//         if(v && !(E.ViewMgr.Get(EViewType.Main) as TowertMainView).bInTop){
//             v = false;//主界面不在最顶层
//         }

//         for(let i = 0;i < this.midIcons.length;i++){
//             let icon:ISDKSkinButton = this.midIcons[i] as any;
//             if(typeof icon.updateLogicVis == "function"){
//                 icon.updateLogicVis(v);
//             }
//         }
//     }

//     private initMidBtn(){
//         let l:Configs.t_MainIcon_dat[] = MainIconProxy.Ins.List;
//         let res:Configs.t_MainIcon_dat[] = [];
//         for(let i = 0;i < l.length;i++){
//             let cfg = l[i];
//             if(cfg.f_mid_left_pos){
//                 res.push(cfg);
//             }
//         }
//         res = res.sort(this.onResSort);
//         for(let i = 0;i <res.length;i++){
//             let cfg = res[i];
//             if(FunctionModel.Ins.isOpenAllByFuncid(cfg.f_funid)){
//                 let _skin = new LeftMidIcon();

//                 let _cls;
//                 switch(parseInt(cfg.f_funid)){
//                     case EFuncDef.DouYinClient:
//                         _cls = DouyinClientButton;
//                         break;
//                     default:
//                         _cls = FuncSmallIcon;
//                         break;
//                 }
//                 let icon:FuncSmallIcon = new _cls();
//                 icon.refresh(_skin,parseInt(cfg.f_funid),EButtonStyle.Pos);
//                 this.midbtnCon.addChild(_skin);
//                 // _skin.x = i * this.cellGap;
//                 // icon.refreshView();
//                 this.midIcons.push(icon);
//             }
//         }
//     }
//     init(con:Laya.Sprite,leftCon:Laya.Sprite){
//         this.model = MainModel.Ins;
//         leftCon.addChildAt(this.midbtnCon,0);
//         this.initMidBtn();
//         this.con = con;
 
//         let funcIdList = [EFuncDef.YaoQing,EFuncDef.Setting,EFuncDef.Email,EFuncDef.chenghao,EFuncDef.FenXiang,EFuncDef.GroupShare];
//         // ? skin : new ui.views.main.ui_little_iconUI()
//         for(let i = 0;i < funcIdList.length;i++){
//             this.btnList.push(MainModel.Ins.createBtnByFuncid(funcIdList[i]));
//         }

//         //////////////////////////////////////////////////////////////
//         this.updateBtnPos();
//         // MainModel.Ins.on(MainEvent.UpdateListView,this,this.updateBtnPos);
//     }

//     private updateBtnPos(){
//         let cellGap:number = this.cellGap;
//         let firstCount:number = 4;
//         let indexpos:number = 0;
//         for(let i = 0;i < firstCount;i++){
//             let btn:ButtonCtl = this.btnList[i];
//             if(btn && btn.isOpen){
//                 let x = (indexpos + 1) * cellGap;
//                 let y =  -1 * cellGap;
//                 btn.setpos(x,y);
//                 this.con.addChild(btn.skin);

//                 if(indexpos == 0){
//                     //根据第一个按钮设置外部的按钮坐标
//                     // outSide.setpos(x+this.con.x,y + this.con.y);
//                     this.midbtnCon.x = x + this.con.x;
//                     this.midbtnCon.y = y + this.con.y;
//                 }
//                 indexpos++;
//             }
//         }
//         let index:number = 0;
//         for(let i = firstCount;i < this.btnList.length;i++){
//             let btn:ButtonCtl = this.btnList[i];
//             if(btn && btn.isOpen){
//                 btn.visible = true;
//                 btn.setpos(index * cellGap, -2 * cellGap);
//                 this.con.addChild(btn.skin);
//                 index++;
//             }else{
//                 btn.visible = false;
//             }
//         }
//     }

//     /**
//      * @param v true展开按钮列表
//      */ 
//     set openStatus(v:boolean){
//         this.setLeftMid(!v);

//         // this.settingBtn.visible = this.clientBtn.visible = this.mailBtn.visible = v;
//         for(let i  = 0;i < this.btnList.length;i++){
//             let btn = this.btnList[i];
//             if(btn.isOpen){
//                 btn.visible = v;
//             }else{
//                 btn.visible = false;
//             }
//         }
//         if(v){
//             this.updateRed();
//         }

//     }

//     updateRed(){
//         this.refresh();
//         for(let i = 0;i < this.btnList.length;i++){
//             this.btnList[i].updateRed();
//         }
//     }
// }
