// import { BaseCfg } from "../../../static/json/data/BaseCfg";
// /**格子占位配置 */
// export class ComposetypeProxy extends BaseCfg {
//     public GetTabelName(): string {
//         return "t_composetype";
//     }
//     private static _ins: ComposetypeProxy;
//     public static get Ins() {
//         if (!this._ins) {
//             this._ins = new ComposetypeProxy();
//         }
//         return this._ins;
//     }
//     getCfgByType(type:number):Configs.t_composetype_dat{
//         let l:Configs.t_composetype_dat[] = this.List;
//         let o = l.find(o=>o.f_type == type);
//         return o;
//     }
// }