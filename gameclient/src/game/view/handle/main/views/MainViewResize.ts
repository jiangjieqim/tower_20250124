// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
// import { EViewType } from "../../../../common/defines/EnumDefine";
// import { E } from "../../../../G";
// import { MainView } from "../MainView";
// import { MainEvent } from "../model/MainEvent";
// import { MainModel } from "../model/MainModel";
// import { FuncSmallIcon } from "./icon/FuncSmallIcon";

// export class MainViewResize{
//     public bg:Laya.Image;
//     /**
//      * 上方点击的按钮
//      */
//     public upbtn:Laya.Image;
//     public juanzhou:Laya.Sprite;
//     public rightbg:Laya.Sprite;
//     public leftbg:Laya.Sprite;
//     public uptf:Laya.Label;
//     public iconSec:Laya.Sprite;
//     public btns:FuncSmallIcon[];
//     public updot:Laya.Image;
//     public bgMask:Laya.Image;
//     public readonly offsetHeight:number = 98;
//     /////////////////////////////////////////////////////////
//     private bgOldHeight:number;
//     private bgNewHeight:number = 621;
//     private juanzhouOldY:number;
//     private leftBgOldY:number;
//     private rightBgOldY:number;
//     private upbtnOldY:number;
//     private strarr:string[];
//     private model:MainModel;
//     private _maskOffsetY:number;
//     private upBtnCtl:ButtonCtl;
//     public init(){
//         this.model = MainModel.Ins;
//         this.juanzhouOldY = this.juanzhou.y;
//         this.bgOldHeight = this.bg.height;
//         this.bgNewHeight = this.bgOldHeight + this.offsetHeight;
//         this.leftBgOldY = this.leftbg ? this.leftbg.y : 0;
//         this.rightBgOldY = this.rightbg ?  this.rightbg.y : 0;
//         this.upbtnOldY = this.upbtn.y;
//         // this.upbtn.on(Laya.Event.CLICK,this,this.onClickHandler);
//         this.upBtnCtl=ButtonCtl.CreateBtn(this.upbtn,this,this.onClickHandler,false);
//         this.strarr = E.getLang("main01").split("|");
//         this.uptf.text = this.strarr[1];
//         this.iconSec.visible = false;
//         this.bgMask.on(Laya.Event.CLICK,this,this.onMaskClick);
//         this.bgMask.visible = false;
//         this._maskOffsetY = this.bgMask.y - this.upbtn.y;
//         MainModel.Ins.on(MainEvent.FuncSmallIconUpdate,this,this.onRedUpdate);
//         this.updateRed();
//     }

//     private onMaskClick(e:Laya.Event){
//         this.bgMask.visible = false;
//         this.onClickHandler(e);
//     }

//     private onRedUpdate(){
//         this.updateRed();
//     }
//     /**是否展开着 */
//     public get isWindowSpread(){
//         return this.iconSec.visible;
//     }

//     private updateRed(){
//         let _dot:boolean = false;
//         for(let i = 0;i < this.btns.length;i++){
//             let cell = this.btns[i];
            
//             if(this.model.getHasRed(cell.funcId)){
//                 _dot = true;
//                 break;
//             }
//         }
//         this.updot.visible = _dot;
//     }

//     private onClickHandler(e:Laya.Event){
//         let str = this.strarr[0];
//         if(this.bg.height == this.bgOldHeight){
//             //展开
//             this.bg.height = this.bgNewHeight;
//             let offset:number = this.offsetHeight;
//             this.juanzhou.y = this.juanzhouOldY + offset;
//             this.leftbg && (this.leftbg.y = this.leftBgOldY + offset);
//             this.rightbg && (this.rightbg.y = this.rightBgOldY + offset);
//             // this.upbtn.y = ;
//             this.upBtnCtl.setpos(this.upbtn.x,this.upbtnOldY + offset);
//             this.iconSec.visible = true;
//         }else{
//             //收缩
//             this.bg.height = this.bgOldHeight;
//             this.juanzhou.y = this.juanzhouOldY;
//             this.leftbg && ( this.leftbg.y = this.leftBgOldY);
//             this.rightbg && (this.rightbg.y = this.rightBgOldY);
//             // this.upbtn.y = this.upbtnOldY;
//             this.upBtnCtl.setpos(this.upbtn.x,this.upbtnOldY);
//             str = this.strarr[1];
//             this.iconSec.visible = false;
//         }
//         this.uptf.text = str;
//         this.bgMask.y = this.upBtnCtl.skin.y + this._maskOffsetY;
//         this.bgMask.visible = this.isWindowSpread; 
//         (E.ViewMgr.Get(EViewType.Main) as MainView).updatePosBtnView();
//         MainModel.Ins.event(MainEvent.WindowSpread);
//     }
// }