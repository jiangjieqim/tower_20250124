// import { GuideModel } from "./GuideModel";

// export class ComposeBtnGuide{
//     private img:Laya.Image;
//     constructor(img:Laya.Image){
//         this.img = img;
//         img.on(Laya.Event.UNDISPLAY,this,this.onHide);
//     }
//     private onHide(){
//         GuideModel.Ins.preGuideStep();
//     }

//     dispose(){
//         this.img.off(Laya.Event.UNDISPLAY,this,this.onHide);
//     }
// }