// import { BaseCfg } from "../static/json/data/BaseCfg";

// /**War3动画适配器 */
// export class t_AnimWar3Conf extends BaseCfg{
//     private static _ins: t_AnimWar3Conf;
//     public static get Ins() {
//         if (!this._ins) {
//             this._ins = new t_AnimWar3Conf();
//         }
//         return this._ins;
//     }
//     public GetTabelName(): string {
//         return "t_AnimConf";
//     }
//     getBossAnimIndex(index:number){
//         let l:Configs.t_AnimConf_dat[] = this.List;
//         let cell = l.find(o=>o.f_animIndex == index);
//         if(cell){
//             return cell.f_curAnimIndex;
//         }
//         return index;
//     }
// }