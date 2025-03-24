// import { E } from "../../../../G";
// import { AvatarView } from "../AvatarView";

import { AvatarView } from "../AvatarView";

// import { EAvatarAnim } from "../vos/EAvatarAnim";
export interface IAvatarBaseCtl{
    dispose();
    bind(avatar:AvatarView);
}
// export class AnimShowCtl implements IAvatarBaseCtl{
//     private _avatar:AvatarView;
//     private _hitSpr:Laya.Sprite;
//     private animList:EAvatarAnim[] = [EAvatarAnim.HandBookShow1,EAvatarAnim.HandBookShow2];
//     private animIndex:number = 0;
//     public bind(con:AvatarView){
//         this._avatar = con;
//         this.createHit();
//         this._avatar.pushCtl(this);
//     }
//     public dispose(){
//         if(this._hitSpr){
//             this._hitSpr.off(Laya.Event.CLICK,this,this.onClick);
//             this._hitSpr.destroy();
//             this._hitSpr = null;
//         }
//     }
//     private createHit(){
//         this._hitSpr = new Laya.Sprite();
//         let size:number = 100;
//         if(E.Debug){
//             this._hitSpr.graphics.drawRect(-size,-size,size*2,size*2,null,"#ff0000",1);
//         }
//         this._hitSpr.hitArea = new Laya.Rectangle(-size,-size,size*2,size*2);
//         this._hitSpr.on(Laya.Event.CLICK,this,this.onClick);
//         this._avatar.addChild(this._hitSpr);
//     }
//     private onClick(){
//         if(this._avatar.curAnim == EAvatarAnim.HandBookStand){
//             if(this.animIndex>=this.animList.length){
//                 this.animIndex = 0;
//             }
//             this._avatar.play(this.animList[this.animIndex],this,this.end);
//             this.animIndex++;
//         }else{
//             console.log("no action!");
//         }
//     }

//     private end(){
//         this._avatar.play(EAvatarAnim.HandBookStand);
//     }
// }