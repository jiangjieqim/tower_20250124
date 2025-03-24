// import { EAvatarAnim } from "../vos/EAvatarAnim";
// import { BaseSpineCoreSkel } from "./BaseSpineCoreSkel";
// import { SpineUtil } from "./SpineManager";
// /**自定义coreskel */
// export class ItemPopSkel extends BaseSpineCoreSkel{
//     public anim: EAvatarAnim = EAvatarAnim.Stop;
//     constructor(){
//         super();
//         this.loadProxy.pngCallBack = new Laya.Handler(this,this.onPngCallBack);
//     }
//     private onPngCallBack(_baseSkel:Laya.SpineSkeleton,url:string,slotName:string){
//         let tex:Laya.Texture = Laya.loader.getRes(url);
//         let _uv = SpineUtil.createSize(tex.width,tex.height);//创建一个定义的纹理宽高
        
//         if(_uv){
//             SpineUtil.f_setSlot(_baseSkel,url,slotName,_uv.u,_uv.v,_uv.u2,_uv.v2,_uv.w,_uv.h);
//         }
//     }
// }