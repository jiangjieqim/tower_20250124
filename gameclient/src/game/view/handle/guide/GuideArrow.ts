// import { ui } from "../../../../ui/layaMaxUI";
// import { ScreenAdapter } from "../../../G";
// import { GuideRect } from "./GuideRect";

// /**小箭头 */
// export class GuideArrow extends ui.views.compose.guide.ui_guide_arrowUI{
//     /**顶部最小高度限制 */
//     // protected topLimit:number = 0;
//     /**箭头高度 */
//     private _arrowHeight:number;
//     private dir:number = 1;
//     private tween:Laya.Tween;
//     private readonly useTime:number = 250;
//     private readonly animOffsetY:number = 50;

//     private _guideRect:GuideRect = new  GuideRect();

//     constructor(){
//         super();
//         this._arrowHeight = this.bg.height * Math.abs(this.bg.scaleY) + this.animOffsetY;
//         // this.topLimit = Math.abs(this.tipsbg.y);
//         // this._guideRect.init();
//         this.tween = new Laya.Tween();
//         this.on(Laya.Event.DISPLAY,this,this.onDisplay);
//         this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
//     }

//     private onDisplay(){
//         this.initAnim();
//     }

//     private initAnim(){
//         this.tween.clear();
//         this.onStartPlay();
//     }

//     private onStartPlay(){
//         this.tween.to(this.bg, { y: -this.animOffsetY * this.dir }, this.useTime, null, new Laya.Handler(this, this.onPlayEnd));
//     }

//     private onPlayEnd(){
//         this.tween.to(this.bg,{y:0},this.useTime,null,new Laya.Handler(this,this.onStartPlay));
//     }

//     private onUnDisplay(){
//         if(this.tween){
//             this.tween.clear();
//         }
//     }

//     hide(){
//         if(this.parent){
//             this.removeSelf();
//         }
//         this._guideRect.hide();
//     }
   
//     show(_cfg:Configs.t_Tasks_Guide_dat,sp:Laya.Sprite){
//         this.width = sp.width;
//         this.height = sp.height;
//         let _arrowX:number = 0;
//         let _arrowY:number = 0;
//         // let _tipbgY:number = -this.topLimit;
//         let _dir:number = 1;
//         if(!StringUtil.IsNullOrEmpty(_cfg.f_arrow_offsetXY)){
//             //  0|275|-1|575
//             let arr = _cfg.f_arrow_offsetXY.split("|");
//             _arrowX = parseInt(arr[0]);
//             _arrowY = parseInt(arr[1]);
//             // _dir = parseInt(arr[2]);
//             // _tipbgY+=parseInt(arr[3]);
//         }
//         if(_cfg.f_dir){
//             _dir = -1;
//         }

//         this.con1.x = sp.width/2 + _arrowX;
//         this.graphics.clear();
//         // this.graphics.drawRect(0, 0, sp.width, sp.height, null, "#ffff00", 3);
//         // let needChangle:boolean = true;
//         if(_cfg.f_showsmallview){
//             this.tf.text = _cfg.f_info+"";
//             this.tipsbg.visible = true;
//             let x = this.con1.x - this.tipsbg.width/2;
//             let pos = (this.con1.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.con1.x,this.con1.y));
//             let _stageHalfLeftX: number = (Laya.stage.width - ScreenAdapter.UIRefWidth) / 2;
//             let _stageHalfRightX: number = (Laya.stage.width + ScreenAdapter.UIRefWidth) / 2;

//             let bgHalf = this.tipsbg.width/2;
//             if(pos.x - bgHalf < _stageHalfLeftX){
//                 //背景超左
//                 // console.log(11);
//                 x += _stageHalfLeftX - (pos.x - bgHalf);
//             } else if (pos.x + bgHalf > _stageHalfRightX) {
//                 //背景超右
//                 x -= pos.x + bgHalf - _stageHalfRightX;
//             }
//             this.tipsbg.x = x;
//             //==================================================
//             // if(pos.y < this.topLimit){
//                 //在底部的位置
//                 // let oy:number = sp.height;
//                 // _arrowY += oy;
//                 // _tipbgY = _arrowY + 85;
//                 // _dir = -1;
//             // }

//             // LogSys.Log(`bg x y ${JSON.stringify(pos)}`);
//         }else{
//             this.tipsbg.visible = false;
//         }
//         if(_dir == 1){
//             this.tipsbg.y = -this._arrowHeight - this.tipsbg.height;
//         }else{
//             this.tipsbg.y = sp.height + this._arrowHeight;//-this._arrowHeight-this.tipsbg.height;
//             _arrowY += sp.height;
//         }
//         this.con1.y = _arrowY;

//         // this.tipsbg.y = _tipbgY;
//         this.bg.scaleY = this.bg.scaleX * _dir;
//         this.dir = _dir;
        
//         this._guideRect.disposeBtns();
//         if(_cfg.f_mask){
//             this._guideRect.draw(this,sp,_cfg);
//             this.parent.addChild(this);
//         }
//     }

// }