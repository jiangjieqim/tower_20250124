// // import { E } from "../../game/G";

// /**
//  * 按钮控制器
//  * 按下的时候会缩放
//  */
// export class ButtonCtl{
//     /**是否使用按钮控制器失效 */
//     static disable:boolean = false;
//     static E:IE;
//     public skin:Laya.Sprite;
//     protected clickHandler: Laya.Handler;
//     private oldx: number = 0;
//     private oldy: number = 0;
//     private refScale:number = 1.0;
//     private scaleAnim: boolean;
//     private timeCtl: TimeCheckCtl;
//     // public data:any;
//     /**是否是用按钮音效果 */
//     useSound:boolean = true;
//     bStopPropagation:boolean;
//     public set visible(v) {
//         if(this.skin.visible!=v){
//             this.skin.visible = v;
//         }
//     }

//     public get visible(){
//         return this.skin.visible;
//     }

//     get isOpen(){
//         return true;
//     }

//     set bgSkin(url:string){
//         let img = this.skin as Laya.Image;
//         img.skin = url;
//     }

//     public set gray(v:boolean){
//         (this.skin as Laya.Image).gray = v;
//         for(let i  = 0;i < this.skin.numChildren;i++){
//             (this.skin.getChildAt(i) as Laya.Image).gray = v;
//         }
//     }

//     public static Create(skin:Laya.Sprite,onClick:Laya.Handler,scaleAnim:boolean = true){
//         return new ButtonCtl(skin,onClick,scaleAnim);
//     }

//     public static CreateBtn(skin:Laya.Sprite,that,func:Function,scaleAnim:boolean = true,args?,bStopPropagation:boolean = false){
//         let btn = this.Create(skin,new Laya.Handler(that,func,args),scaleAnim);
//         btn.bStopPropagation = bStopPropagation;
//         return btn;
//     }
//     /**
//      * 按钮延时触发(秒)
//      */
//     public setDelayTime(s:number){
//         if(!this.timeCtl){
//             this.timeCtl = new TimeCheckCtl();
//         }
//         this.timeCtl.setTime(s*1000,new Laya.Handler(this,this.onActionHandler));
//     }

//     private onActionHandler(time: number) {
//         if (time != 0) {

//         } else {
//             if (this.clickHandler) {
//                 this.clickHandler.run();
//             }
//         }
//     }
//     constructor(skin:Laya.Sprite,onClick:Laya.Handler=null,scaleAnim:boolean = true){
//         DebugUtil.draw(skin,DebugUtil.COLOR_PURPLE);
//         this.refScale = skin.scaleX;
//         this.clickHandler = onClick;
//         this.scaleAnim = scaleAnim;
//         this.skin = skin;
//         this.skin.on(Laya.Event.MOUSE_DOWN,this,this.onDown);
//         this.skin.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
//         this.skin.on(Laya.Event.CLICK,this,this.onMouseClick);
//         this.oldx = this.skin.x;
//         this.oldy = this.skin.y;
//     }

//     private onMouseClick(e:Laya.Event){
//         if(this.bStopPropagation){
//             e.stopPropagation();
//         }
//         this.doClickHandler();
//     }

//     // public set enable(v:boolean){
//     //     let img:Laya.Image = (this.skin as Laya.Image)
//     //     if(v){
//     //         img.skin = `remote/common/base/anniu_green.png`;
//     //         this.skin.on(Laya.Event.MOUSE_DOWN,this,this.onDown);
//     //         this.skin.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
//     //         this.skin.on(Laya.Event.CLICK,this,this.onMouseClick);
//     //     }else{
//     //         img.skin = `remote/common/base/anniu_grey.png`;
//     //         // remote/common/base/anniu_grey.png
//     //         this.skin.off(Laya.Event.MOUSE_DOWN,this,this.onDown);
//     //         this.skin.off(Laya.Event.MOUSE_UP,this,this.onMouseUp);
//     //         this.skin.off(Laya.Event.CLICK,this,this.onMouseClick);
//     //     }
//     //     this.clearUp();
//     // }

//     public set mouseEnable(v:boolean){
//         if(v){
//             this.skin.on(Laya.Event.MOUSE_DOWN,this,this.onDown);
//             this.skin.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
//             this.skin.on(Laya.Event.CLICK,this,this.onMouseClick);
//         }else{
//             this.skin.off(Laya.Event.MOUSE_DOWN,this,this.onDown);
//             this.skin.off(Laya.Event.MOUSE_UP,this,this.onMouseUp);
//             this.skin.off(Laya.Event.CLICK,this,this.onMouseClick);
//         }
//         this.clearUp();
//     }

//     public set mouseThrough(v:boolean){
//         this.skin.mouseThrough = v;
//     }

//     public set grayMouseDisable(v:boolean){
//         this.mouseEnable = !v;
//         this.gray = v;
//     }

//     private onMouseUp(){
//         // this.doClickHandler();
//         this.clearUp();
//     }

//     protected playSound(){
//         if(this.useSound){
//             ButtonCtl.E.AudioMgr.PlayUI("sound_anniu.mp3");
//         }
//     }

//     // /**
//     //  * 重置坐标
//     //  */
//     // public resetPos(x,y){
//     //     this.oldx = x;
//     //     this.oldy = y;
//     //     this.onUp();
//     // }

//     protected onDown(){
//         this.playSound();
//         let _scale = 0.95 * this.refScale;
//         if(!this.scaleAnim){
//             _scale = 1.0 * this.refScale;
//         }else{
//             this.skin.scaleX = this.skin.scaleY = _scale;
//         }
//         this.skin.x = this.oldx + (this.skin.width * (this.refScale - _scale)) / 2;
//         this.skin.y = this.oldy + (this.skin.height * (this.refScale - _scale)) / 2;

//         // this.doClickHandler();
//         Laya.timer.once(500,this,this.clearUp);
//     }

//     // private static _curTime: number = 0;
//     // static useDelay: boolean = false;
//     private doClickHandler() {
//         if(ButtonCtl.disable){
//             // E.ViewMgr.ShowMidError(`引导进行中...`);
//             // LogSys.Warn(`ButtonCtl disable is true...`);
//             // MainModel.Ins.event(EventID.ButtonDisable);
//             ButtonCtl.E.EventMgr.emit(EventID.ButtonDisable);
//             return;
//         }
//         // if (ButtonCtl.useDelay) {
//         //     if (Laya.timer.currTimer - ButtonCtl._curTime < 500) {
//         //         // LogSys.Log(`太快了`)
//         //         return;
//         //     }
//         //     ButtonCtl._curTime = Laya.timer.currTimer;
//         // }
//         if(this.timeCtl){
//             this.timeCtl.start();
//         }else{
//             // MainModel.Ins.event(TowerMainEvent.ButtonCtlClick,this.skin);
//             ButtonCtl.E.EventMgr.emit(EventID.ButtonCtlClick,this.skin);
//             if(this.clickHandler){
//                 this.clickHandler.run();
//             }
//         }
//     }
//     public setpos(x: number, y: number) {
//         this.oldx = x;
//         this.oldy = y;
//         this.clearUp();
//     }

//     /**设置可点击碰撞区域 */
//     set hitRect(v:Laya.Rectangle){
//         this.skin.hitArea = v;
//         DebugUtil.draw(this.skin,DebugUtil.COLOR_PURPLE,v.width,v.height,v.x,v.y);
//     }

//     setX(v:number){
//         this.oldx = v;
//         this.clearUp();
//     }
//     getX(){
//         return this.oldx;
//     }
//     getY(){
//         return this.oldy;
//     }
//     setY(v:number){
//         this.oldy = v;
//         this.clearUp();
//     }
//     protected clearUp(){
//         if(this.skin && !this.skin.destroyed){
//             this.skin.scaleX = this.skin.scaleY = this.refScale;
//             this.skin.x = this.oldx;
//             this.skin.y = this.oldy;
//         }
//     }
//     public dispose(){
//         if(this.timeCtl){
//             this.timeCtl.dispose();
//         }
//         if(this.skin){
//             this.skin.off(Laya.Event.MOUSE_DOWN,this,this.onDown);
//             this.skin.off(Laya.Event.MOUSE_UP,this,this.onMouseUp);
//             this.skin.off(Laya.Event.CLICK,this,this.onMouseClick);
//             this.clearUp();
//         }else{
//             //console.warn(`button skin is null`);
//         }
//         this.skin = null;
//         this.clickHandler = null;
//     }
// }

// // export class ButtonAlphaCtl extends ButtonCtl{
// //     constructor(skin:Laya.Sprite,onClick:Laya.Handler){
// //         super(skin,onClick);
// //     }
// //     protected onDown(){
// //         this.playSound();
// //         this.skin.alpha = 0.5;
// //     }
// //     protected clearUp(){
// //         this.skin.alpha = 1.0;
// //     }
// // }