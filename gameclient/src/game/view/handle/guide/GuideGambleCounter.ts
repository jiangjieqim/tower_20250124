// import { EGuideEvent, GuideModel } from "./GuideModel";

// /**引导祈愿计数模块 */
// export class GuideGambleCounter{
//     /**已经祈愿了的次数 */
//     count:number;
//     /**需要检测的次数 */
//     constructor(){
//         this.count = 0;
//         GuideModel.Ins.on(EGuideEvent.GuideGambleSucceed,this,this.onSucceed);
//     }

//     private onSucceed(){
//         this.count++;
//     }

//     dispose(){
//         GuideModel.Ins.off(EGuideEvent.GuideGambleSucceed,this,this.onSucceed);
//     }
// }