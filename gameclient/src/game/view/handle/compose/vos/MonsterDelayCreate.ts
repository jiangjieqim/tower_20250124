// import { stMonsterBirth } from "../../../../network/protocols/BaseProto";
// import { ComposeEvent } from "../ComposeEvent";
// import { ComposeModel } from "../ComposeModel";

// export class MonsterDelayCreate{
//     private time:Laya.Timer;
//     load(vo:stMonsterBirth){
//         this.time = new Laya.Timer();
//         this.time.once(vo.time,this,this.createMonster,[vo]);
//     }

//     private createMonster(vo:stMonsterBirth){
//         // LogSys.Log(`生成怪物:${JSON.stringify(vo)}`);
//         ComposeModel.Ins.event(ComposeEvent.CreateMonster,vo);
//         this.time.clearAll(this);
//     }
// }