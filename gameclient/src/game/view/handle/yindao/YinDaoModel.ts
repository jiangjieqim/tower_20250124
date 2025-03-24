// import { E } from "../../../G";
// import { EViewType } from "../../../common/defines/EnumDefine";
// import { LayerMgr } from "../../../layer/LayerMgr";
// import { SocketMgr } from "../../../network/SocketMgr";
// import { Guide_req, stGuide } from "../../../network/protocols/BaseProto";
// import { GuideModel } from "../guide/GuideModel";
// import { GuideUtils } from "../guide/GuideUtils";
// import { MainModel } from "../main/model/MainModel";
// import { RoleInfoModel } from "../roleinfo/model/RoleInfoModel";
// import { TowerMainFightModel } from "../towertmain/model/TowerMainFightModel";
// import { TowertMainView } from "../towertmain/view/TowertMainView";
// import { TowertMainCardModel } from "../towertmaincard/model/TowertMainCardModel";
// import { YinDaoViewGN } from "./YinDaoViewGN";
// import { t_Function_Guide } from "./t_Function_Guide";

// export class YinDaoModel extends Laya.EventDispatcher{
//     private readonly disable:boolean = true;
//     private static _ins: YinDaoModel;
    
//     public yindaoList:stGuide[];

//     public isBoxClick:boolean;

//     public static UPDATE_VIEW:string = "UPDATE_VIEW";

//     public static get Ins() {
//         if (!this._ins) {
//             this._ins = new YinDaoModel();
//         }
//         return this._ins;
//     } 

//     constructor(){
//         super();
//         this.yindaoList = [];
//         this.isBoxClick = false;
//     }

//     private _ydView:YinDaoViewGN;
//     private getYinDaoView(){
//         if(!this._ydView){
//             this._ydView = new YinDaoViewGN();
//         }
//         return this._ydView;
//     }

//     public sendCmd(groupId:number,orderId:number){
//         let data:stGuide = new stGuide;
//         data.groupId = groupId;
//         data.orderId = orderId;
//         let req = new Guide_req;
//         req.data = data;
//         SocketMgr.Ins.SendMessageBin(req);
//     }

//     private getCfgByViewId(viewId:number){
//         let arr = YinDaoModel.Ins.yindaoList;
//         let array = [];
//         for(let i:number=0;i<arr.length;i++){
//             let cfg:Configs.t_Function_Guide_dat = t_Function_Guide.Ins.getCfgById(arr[i].groupId,arr[i].orderId);
//             if(cfg && cfg.f_viewId == viewId){
//                 array.push(cfg);
//             }
//         }
//         if(array.length == 0)return null;
//         let gCfg:Configs.t_Function_Guide_dat;
//         if(array.length == 1){
//             gCfg = array[0];
//         }else{
//             array.sort(this.onSort);
//             gCfg = array[0];
//         }
//         return gCfg;
//     }

//     public _gCfg:Configs.t_Function_Guide_dat;
//     public _sp;
//     public addYD(viewId:number) {
//         if(this.disable){
//             return;
//         }
//         let gCfg = this.getCfgByViewId(viewId);
//         this._gCfg = null;
//         this._sp = null;
//         if(!gCfg)return;
//         if(viewId == EViewType.CardCQView && !TowertMainCardModel.Ins.isPlayEnd){
//             return;
//         }
        
//         if(gCfg.f_precondition != ""){
//             let arr1 = gCfg.f_precondition.split("-");
//             let type = parseInt(arr1[0]);
//             let val = parseInt(arr1[1]);
//             if(type == 1){
//                 if(MainModel.Ins.isPvpFightGuide || TowerMainFightModel.Ins.boxIndex){
//                     return;
//                 }
//             }else if(type == 2){
//                 if(YinDaoModel.Ins.isBoxClick){
//                     YinDaoModel.Ins.isBoxClick = false;
//                     return;
//                 }
//                 let arr = RoleInfoModel.Ins.careerList;
//                 let num = 0;
//                 for(let i:number=0;i<arr.length;i++){
//                     if(arr[i].flag == 1){
//                         num = arr[i].times;
//                     }
//                 }
//                 if(num < val){
//                     return;
//                 }
//             }
//         }

//         if(parseInt(gCfg.f_viewZJ.split("-")[0]) == EViewType.Main){
//             let view = E.ViewMgr.Get(EViewType.Main) as TowertMainView;
//             if(!view || !view.bInTop){
//                 return;
//             }
//         }

//         let sp = GuideUtils.getUIByKeySt(gCfg.f_viewZJ);
//         if (sp) {
//             let view = this.getYinDaoView();
//             this._gCfg = gCfg;
//             if (!view.parent) {
//                 this._sp = sp;
//                 view.setData(gCfg);
//                 GuideModel.Ins.addToScreen(view,sp,gCfg.f_frame_position,gCfg.f_frame_position2);
//             }
//         }else{
//             this.removeYD();
//         }
//     }

//     public removeYD(){
//         this.getYinDaoView().removeSelf();
//     }

//     private onSort(a:Configs.t_Function_Guide_dat,b:Configs.t_Function_Guide_dat){
//         return a.f_priority - b.f_priority;
//     }

// }