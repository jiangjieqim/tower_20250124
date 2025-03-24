// import { FightGuide, FightGuideEvent } from "../../../guide/FightGuide";
// import { GuideModel } from "../../../guide/GuideModel";
// import { ComposeModel } from "../../ComposeModel";
// import { TowerAvatarView } from "../TowerAvatarView";

// export class TowerMonsterCheckPos extends Laya.Script {
//     avatar: TowerAvatarView;

//     onAwake() {
//         Laya.timer.frameLoop(1, this, this.onLoop);
//     }

//     onDestroy() {
//         this.clear();
//         this.avatar = null;
//     }
//     private clear() {
//         Laya.timer.clear(this, this.onLoop);
//         // this.tf && this.tf.removeSelf();
//     }
//     private static MAX_INDEX:number = 0;
//     /*
//         3000|10000|22500|28000|29000|34000|40000
//     */
//     private onLoop() {
//         if (this.owner.parent) {
//             if (this.avatar.vo) {
//                 //怪物
//                 // this.tf.text = `${this.avatar.vo.uid}`;// + "," + this.avatar.vo.fid + "\n" +  this.avatar.region;
                
//                 if(this.avatar.vo.fid == 10003  && this.avatar.vo.playerId == ComposeModel.Ins.ownerPlayer.playerId){
//                     if(this.avatar.curPosIndex >= 100){
//                         LogSys.Log(`===============>pos: ${this.avatar.curPosIndex} is Stop now...`);
//                         // FightGuide.Ins.next(GuideModel.Ins.taskId + 1);
//                         FightGuide.Ins.event(FightGuideEvent.Next);
//                         this.destroy();
//                     }
//                 }
//                 /*
//                 if(this.avatar.vo.playerId == ComposeModel.Ins.ownerPlayer.playerId){
//                     if(this.avatar.curPosIndex > TowerMonsterCheckPos.MAX_INDEX){
//                         TowerMonsterCheckPos.MAX_INDEX = this.avatar.curPosIndex;
//                         LogSys.Log(`cur max index is ${this.avatar.curPosIndex}`);
//                     }
//                 }
//                 */

//             }
//         } else {
//             this.clear();
//             this.destroy();
//         }
//     }
// }