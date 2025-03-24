// // import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
// import { ViewBase } from "../../../../../frame/view/ViewBase";
// import { ui } from "../../../../../ui/layaMaxUI";
// import { EPageType } from "../../../../common/defines/EnumDefine";
// import { IconUtils } from "../../main/model/IconUtils";
// import { MainModel } from "../../main/model/MainModel";
// import { ECellType } from "../../main/vos/ECellType";
// import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
// import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
// import { ComposeEvent } from "../ComposeEvent";
// import { ComposeModel } from "../ComposeModel";
// import { t_Herosummon_Rate } from "../t_Herosummon_Rate";
// import { FightValueConfig } from "../vos/FightValueConfig";
// import { StrengthenItem } from "./StrengthenItem";
// /**强化 */
// export class StrengthenView extends ViewBase{
//     public PageType: EPageType = EPageType.None;
//     private _ui:ui.views.compose.ui_strengthenViewUI;
//     protected autoFree:boolean = true;

//     private closeCtl1:ButtonCtl;
//     private btn_tip:ButtonCtl;
//     protected onAddLoadRes() {
//         this.addAtlas("fight.atlas");
//     }

//     protected SetCenter() {
//         /*
//         this.UI.anchorX = this.UI.anchorY = 0.5;
//         this.UI.x = this.ViewParent.width >> 1;
//         // this.UI.y = this.ViewParent.height - this._ui.height*0.5 - 90;
//         this.UI.y = this.ViewParent.height / 2 + (ScreenAdapter.DefaultHeight - this._ui.height) / 2 - 85;
//         */
//         this.bottomLayout(FightValueConfig.tabViewOffsetY);
//     }
//     private onCloseBtnHandler(){
//         super.onCloseHandler();
//         ComposeModel.Ins.closeGambleView();
//     }
//     protected onFirstInit(): void {
//         if(!this.UI){
//             this.UI = this._ui = new ui.views.compose.ui_strengthenViewUI;
//             // this.bindClose(this._ui.btn_close);
//             this.closeCtl1 = ButtonCtl.CreateBtn(this._ui.btn_close,this,this.onCloseBtnHandler);

//             this.btn_tip=ButtonCtl.Create(this._ui.btn_tip,new Laya.Handler(this,this.onBtnTipClick));
//             this._ui.sp_click.on(Laya.Event.CLICK,this,this.onClick);

//             this._ui.icon.skin = IconUtils.getIconByCfgId(ECellType.FIGHT_MONEY);
//             this._ui.icon1.skin = IconUtils.getIconByCfgId(ECellType.FIGHT_STONE);

//             this._ui.img_tip.mouseEnabled = true;

//             this._ui.list.itemRender = StrengthenItem;
//             this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
//         }
//     }

//     private onBtnTipClick(){
//         this._ui.img_tip.visible = !this._ui.img_tip.visible;
//     }

//     private onClick(){
//         this._ui.img_tip.visible = false;
//     }

//     private onRenderHandler(item:StrengthenItem,index:number){
//         item.setData(item.dataSource,index);
//     }

//     protected onInit(): void {
//         TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell,this,this.onUpdateLab);
//         ComposeModel.Ins.on(ComposeEvent.StrengthenUpdate,this,this.onStrengthenUpdate);
//         this._ui.img_tip.visible = false;
//         this.updateLab();
//         this._ui.list.array = ComposeModel.Ins.strengthenList;
//         this.updateGL();
//     }

//     protected onExit(): void {
//         this.closeCtl1.dispose();
//         this.btn_tip.dispose();
//         TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell,this,this.onUpdateLab);
//         ComposeModel.Ins.off(ComposeEvent.StrengthenUpdate,this,this.onStrengthenUpdate);
//     }

//     private onStrengthenUpdate(pos:number){
//         this._ui.list.array = ComposeModel.Ins.strengthenList;
//         this.updateGL();
//         let cell:StrengthenItem = this._ui.list.getCell(pos) as any;
//         if(cell){
//             cell.playSucceed();
//         }
//     }

//     private onUpdateLab(id:number){
//         if (id == ECellType.FIGHT_MONEY || id == ECellType.FIGHT_STONE) {
//             this.updateLab();
//         }
//     }

//     private updateLab(){
//         let val = MainModel.Ins.mRoleData.getVal(ECellType.FIGHT_MONEY);
//         this._ui.lab.text = val + "";
//         val = MainModel.Ins.mRoleData.getVal(ECellType.FIGHT_STONE);
//         this._ui.lab1.text = val + "";
//     }

//     private updateGL(){
//         let lv;
//         for(let i:number=0;i<ComposeModel.Ins.strengthenList.length;i++){
//             if(ComposeModel.Ins.strengthenList[i].pos == 3){
//                 lv = ComposeModel.Ins.strengthenList[i].level;
//             }
//         }
//         let cfg = t_Herosummon_Rate.Ins.getCfgByLv(lv);
//         if (cfg) {
//             let arr = cfg.f_chapter.split("|");
//             for (let i: number = 0; i < arr.length; i++) {
//                 let val = parseInt(arr[i]);
//                 this._ui["lab_g" + i].text = val / 100 + "%";
//             }
//         }
//     }
// }