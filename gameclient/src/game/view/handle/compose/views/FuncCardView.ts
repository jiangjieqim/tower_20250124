// import { ViewBase } from "../../../../../frame/view/ViewBase";
// import { ui } from "../../../../../ui/layaMaxUI";
// import { EPageType } from "../../../../common/defines/EnumDefine";
// import { E } from "../../../../G";
// import { MainModel } from "../../main/model/MainModel";
// import { ECellType } from "../../main/vos/ECellType";
// import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
// import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
// import { ComposeEvent } from "../ComposeEvent";
// import { ComposeModel } from "../ComposeModel";
// import { FightValueConfig } from "../vos/FightValueConfig";
// import { CardMoveVo, EFuncCardUsed } from "../vos/FuncCardVo";
// import { FuncCardCellView } from "./cells/FuncCardCellView";
// import { FuncCardSommonCell } from "./cells/FuncCardSommonCell";
// import { FightMoney } from "./FightMoneyShow";
// /**局内功能卡 */
// export class FuncCardView extends ViewBase {
//     private readonly maxShowCardCount:number = 4;
//     public PageType: EPageType = EPageType.None;
//     private model:ComposeModel;
//     private _ui: ui.views.compose.ui_func_cardUI;
//     private sommonCard:FuncCardSommonCell;
//     private cardList:FuncCardCellView[] = [];
//     // private curIndex:number = 0;
//     protected onAddLoadRes(): void {
//         // throw new Error("Method not implemented.");
//     }
//     protected onExit(): void {
//         // throw new Error("Method not implemented.");
//         this.model.off(ComposeEvent.MoveCard, this, this.onMoveCard);
//         this.model.off(ComposeEvent.UpdateCards,this,this.onRefresh);

//         TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell, this, this.onUpdateMoney);
//         while(this.cardList.length){
//             let cell = this.cardList.shift();
//             cell.dispose();
//         }
//     }
//     protected onFirstInit(): void {
//         // throw new Error("Method not implemented.");
//         if (!this.UI) {
//             this.model = ComposeModel.Ins;
//             this.UI = this._ui = new ui.views.compose.ui_func_cardUI();
//             this.sommonCard = new FuncCardSommonCell(this._ui.sommon);
//         }
//     }

//     private getCardList(){
//         let rl = [];
//         let l = this.model.cardList;
//         for(let i = 0;i < l.length;i++){
//             let cell = l[i];
//             if(this.cardList.find(o=>o.vo.data.serialNum == cell.data.serialNum)){

//             }
//             else if(cell.data.used == EFuncCardUsed.NotUsed){
//                 rl.push(cell);
//             }
//         }
//         return rl;
//     }

//     private onMoveCard(moveVo: CardMoveVo) {
//         let index = this.cardList.findIndex(o=>o.vo.data.serialNum == moveVo.uid);
//         if(index != -1){
//             // this.model.curIndex++;
//             let oldIndex:number = index;
//             this.cardList[index].removeCard();
//             while(this.cardList[index+1]){
//                 this.cardList[index+1].toLeft();
//                 index++;
//             }
//             this.cardList.splice(oldIndex,1);

//             //====================================================
//             // let newIndex:number = this.model.curIndex + this.maxShowCardCount;
//             // let vo = this.model.cardList[newIndex];
//             let last = this.getCardList();
//             let vo;
//             if(last.length >0){
//                 vo = last[0];
//             }
//             if(vo){
//                 //新增卡牌
//                 // let curX:number = newIndex;
//                 let tx = FightValueConfig.cardOffsetX + (this.maxShowCardCount - 1) * FightValueConfig.cardCellWidth;
//                 let ty = FightValueConfig.cardOffsetY;
//                 let cell = Laya.Pool.getItemByClass(FuncCardCellView.CLS_KEY,FuncCardCellView);
//                 cell.setData(vo);
//                 cell.x = tx + FightValueConfig.cardCellWidth;
//                 cell.y = ty;
//                 this._ui.con1.addChild(cell);
//                 this.cardList.push(cell);

//                 let tween = new Laya.Tween();
//                 tween.to(cell,{x:tx},this.model.curAdapter.cardMoveTime);
//             }
//             //====================================================
//         }
//         this.updateCardCount();
//     }
//     protected onInit(): void {
//         // throw new Error("Method not implemented.");
//         this.model.on(ComposeEvent.MoveCard, this, this.onMoveCard);
//         this.model.on(ComposeEvent.UpdateCards,this,this.onRefresh);
//         TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell, this, this.onUpdateMoney);
//         this.onUpdateMoney(ECellType.FIGHT_MONEY);
//         this.onUpdateMoney(ECellType.FIGHT_STONE);
//         this.onUpdateHeroCount();
//         // this.curIndex = 0;
//         // this.model.curIndex = 0;
//         this.onRefresh();
//     }

//     private onRefresh(){
//         let cur:number = 0;
//         for (let i =0 ; i < this.maxShowCardCount; i++) {
//             let vo = this.model.cardList[i];
//             if (vo) {
//                 // && vo.data.used == EFuncCardUsed.NotUsed
//                 let cell = Laya.Pool.getItemByClass(FuncCardCellView.CLS_KEY, FuncCardCellView);
//                 cell.setData(vo);
//                 cell.x = FightValueConfig.cardOffsetX + cur * FightValueConfig.cardCellWidth;
//                 cell.y = FightValueConfig.cardOffsetY;
//                 this._ui.con1.addChild(cell);
//                 this.cardList.push(cell);
//                 cur++;
//             }
//         }
//         this.updateCardCount();
//     }

//     protected SetCenter() {
//         /*
//         this.UI.anchorX = this.UI.anchorY = 0.5;
//         this.UI.x = this.ViewParent.width >> 1;
//         this.UI.y = this.ViewParent.height / 2 + (ScreenAdapter.DefaultHeight - this._ui.height) / 2;
//         */
//        this.bottomLayout();
//     }
//     /**局内金币更新 */
//     private onUpdateMoney(id: ECellType) {
//         if (id == ECellType.FIGHT_MONEY) {
//             let val = MainModel.Ins.mRoleData.getVal(id);
//             let _sub: number = val - parseInt(this._ui.tongqianTf.text);
//             if (_sub > 0) {
//                 FightMoney.show(this._ui.tongqianImg, ECellType.FIGHT_MONEY, _sub, 26);
//                 FightMoney.moneyScale(this._ui.tongqianImg);
//             }
//             this._ui.tongqianTf.text = val + "";
//         }
//         else if (id == ECellType.FIGHT_STONE) {
//             this._ui.luckStoneTf.text = MainModel.Ins.mRoleData.getVal(id) + "";
//         }
//     }

//     /**更新英雄数量 */
//     onUpdateHeroCount() {
//         // let max = t_Battle_Config.Ins.getValueById(EBattle_Config.MAX_HERO_COUNT);
//         let max = this.model.ownerPlayer.maxHero;
//         this._ui.peoCountTf.text = `${this.model.heroCount}/${max}`;
//     }

//     private updateCardCount() {
//         let count: number = 0;
//         let l = this.model.cardList;
//         for (let i = 0; i < l.length; i++) {
//             let o = l[i];
//             if (o.data.used == EFuncCardUsed.NotUsed) {
//                 count++;
//             }
//         }

//         let showCount:number = 0;
//         for(let i = 0;i < this.cardList.length;i++){
//             let cell = this.cardList[i];
//             if(cell.parent){
//                 showCount++;
//             }
//         }

//         count -= showCount;//this.cardList.length;
//         if (count < 0 ) {
//             count = 0;
//         }
//         this._ui.lb1.text = E.getLang("funccard0", count);
//     }

// }
