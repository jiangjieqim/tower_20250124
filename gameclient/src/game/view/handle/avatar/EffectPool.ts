// import { NoContainerSimpleEffect } from "./NoContainerSimpleEffect";
// import { SpineEffectMgr } from "./SpineEffectMgr";

// export class EffectPoolVo{
//     url:string;
//     effect:NoContainerSimpleEffect;
//     used:boolean;
//     isNew:boolean;
// }

// export class EffectPool{
//     private list1:EffectPoolVo[] = [];

//     create(url:string,container:Laya.Sprite,ox:number,oy){
//         let cell = this.list1.find(o=>o.url == url && !o.used && o.effect.isLoaded);
//         if(cell){
//             cell.used = true;
//             let eff:NoContainerSimpleEffect = cell.effect as any;
//             eff.container = container;
//             cell.isNew = false;
//             eff.startAdd();
//             // eff.play(0);
//             eff.resume();
//             eff.setPos(ox,oy)
//             return cell;
//         }
//         let effect = SpineEffectMgr.createLoopNoSimpleEffect(url, container, ox, oy);
//         cell = new EffectPoolVo();
//         cell.url = url;
//         cell.used = true;
//         cell.effect = effect;
//         cell.isNew = true;
//         this.list1.push(cell);
//         return cell;
//     }

//     free(eff:NoContainerSimpleEffect){
//         if(eff){
//             let cell = this.list1.find(o=>o.effect == eff);
//             if(cell){
//                 cell.effect.remove();
//                 cell.effect.pause();
//                 cell.used = false;
//             }
//         }
//     }

//     dispose(){
//         LogSys.Log(`销毁对象池特效${this.list1.length}`);
//         while(this.list1.length){
//             let o = this.list1.shift();
//             o.effect.dispose();
//         }
//     }
// }