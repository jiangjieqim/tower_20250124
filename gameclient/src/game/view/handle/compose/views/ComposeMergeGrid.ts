// import { ComposeConfig, EGridMergeClientType } from "../ComposeConfig";
// import { ComposeModel } from "../ComposeModel";
// import { ComposeViewFactory } from "../ComposeViewFactory";
// import { UnlockVo } from "../UnlockVo";
// import { ComposeDragCtl } from "./ComposeDragCtl";
// import { ComposeDragGrid, IISOPos } from "./ComposeDragGrid";
// import { MuchMoreAnimal } from "./MuchMoreAnimal";
// /**合并的大格子区块 */
// export class ComposeMergeGrid extends ComposeDragGrid{
//     /**开始的区块X */
//     private startX:number = 0;
//     /**开始的区块Y */
//     private startY:number = 0;
//     private _showGrid:MuchMoreAnimal;
//     constructor(){
//         super();
//         this.unitW = ComposeConfig.cellW;
//         this.unitH = ComposeConfig.cellH;
//     }

//     private getAllLittleGrid(){
//         // let unlockList:UnlockVo[] = ComposeModel.Ins.unlockList;
//         // let l:IISOPos[] = [];
//         // for(let i = 0;i < unlockList.length;i++){
//         //     l = l.concat(unlockList[i].gobalList);
//         // }
//         // return l;
//         return [];
//     }

//     init(){
//         this.ctlList = [];
//         this.optClientType = EGridMergeClientType.MergeGrid;
//         this._showGrid = new MuchMoreAnimal();

//         //已经解锁的格子
//         let posList:IISOPos[] = this.getAllLittleGrid();
//         //显示格子
//         for(let i = 0;i < posList.length;i++){
//             let o = posList[i];
//             this._showGrid.addEmptyGrid(o.isoX,o.isoY);
//         }
//         //拖拽格子
//         for(let i = 0;i < posList.length;i++){
//             let o = posList[i];
//             let ctl = ComposeViewFactory.createDragCtl(this,o.isoX,o.isoY);
//             this.ctlList.push(ctl);
//             this.addChild(ctl._itemView);
//         }
//         this.startX = this.ctlList[0].isoX;
//         this.startY = this.ctlList[0].isoY;

//         //格子上的动物
//         let animals = this.composeView.getAllAnimalList();
//         this._showGrid.setDataAnim(animals);
//         // this.reset();
//     }

//     dispose(){
//         this.composeView.mapOffsetX = 0;
//         this.composeView.mapOffsetY = 0;
//         super.dispose();
//         this._showGrid.dispose();
//     }

//     onMouseDown(ctl:ComposeDragCtl){
//         this._showGrid.x =  -ctl.isoX * this.unitW;;
//         this._showGrid.y =  -ctl.isoY * this.unitH;;
//         ctl._itemView.addChild(this._showGrid);
//     }
//     moveToMap(_posIndexList1: number[]) {
//         let o = this.composeView.itemList[_posIndexList1[0]];
//         this.composeView.disableGreen();
//         let ox = o.isoX - this.startX;
//         let oy = o.isoY - this.startY;
//         this.x = ox * this.unitW;
//         this.y = oy * this.unitH;
//         this.composeView.mapOffsetX = ox;
//         this.composeView.mapOffsetY = oy;
//     }
// }