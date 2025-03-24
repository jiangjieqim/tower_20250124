// import { stElement } from "../../../network/protocols/BaseProto";
// import { ComposeModel } from "./ComposeModel";
// import { HeroBaseDecorator } from "./HeroBaseDecorator";
// import { ComposeUpdateVo } from "./HeroCreateMgr";
// import { ComposeDragGrid } from "./views/ComposeDragGrid";
// import { IAddHero, IUpdateHero } from "./vos/EFightEnum";

// /**英雄更新接口 */
// export class UpdateHeroMgr extends HeroBaseDecorator{
//     private _dataList:IUpdateHero[] = [];
//     private get model(){
//         return ComposeModel.Ins;
//     }
//     stop() {
//         // throw new Error("Method not implemented.");
//         this.target.stop();
//         this._dataList = [];
//     }

//     start() {
//         // throw new Error("Method not implemented.");
//         this.target.start();
//         Laya.timer.frameLoop(1, this, this.onLoop);
//     }
//     onLoop() {
//         // throw new Error("Method not implemented.");
//         this.target.onLoop();
//         if(this._dataList.length > 0){
//             let vo = this._dataList[0];
//                 if(this.model.fightView){
//                     this.model.fightView.heroUpdate(vo);
//                     this._dataList.shift();
//                 }
//         }
//     }

//     addChildHero(grid: ComposeDragGrid, obj: IAddHero, o: stElement, time: number) {
//         // throw new Error("Method not implemented.");
//         this.target.addChildHero(grid,obj,o,time);
//     }

//     createHero(vo: ComposeUpdateVo) {
//         // throw new Error("Method not implemented.");
//         this.target.createHero(vo);
//     }
//     constructor(target:HeroBaseDecorator){
//         super();
//         this.target = target;
//     }

//     onHeroUpdate(obj:IUpdateHero){
//         this._dataList.push(obj);
//     }
// }