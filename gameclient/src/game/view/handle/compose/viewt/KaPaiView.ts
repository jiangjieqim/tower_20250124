// import { ViewBase } from "../../../../../frame/view/ViewBase";
// import { ui } from "../../../../../ui/layaMaxUI";
// import { IconUtils } from "../../main/model/IconUtils";
// import { MainModel } from "../../main/model/MainModel";
// import { ECellType } from "../../main/vos/ECellType";
// import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
// import { TowerMainModel } from "../../towertmain/model/TowerMainModel";

// export class KaPaiView extends ViewBase{
//     private _ui:ui.views.compose.ui_kapaiViewUI;
//     protected autoFree:boolean = true;

//     protected onAddLoadRes() {
//         // this.addAtlas("fight.atlas");
//     }

//     protected SetCenter(){
//         this.UI.anchorX = this.UI.anchorY = 0.5;
//         this.UI.x = this.ViewParent.width >> 1;
//         this.UI.y = this.ViewParent.height - this._ui.height*0.5 - 90;
//     }

//     protected onFirstInit(): void {
//         if(!this.UI){
//             this.UI = this._ui = new ui.views.compose.ui_kapaiViewUI;
//             this.bindClose(this._ui.btn_close);

//             this._ui.icon.skin = IconUtils.getIconByCfgId(ECellType.FIGHT_MONEY);
//             this._ui.icon1.skin = IconUtils.getIconByCfgId(ECellType.FIGHT_STONE);
//         }
//     }

//     protected onInit(): void {
//         TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell,this,this.onUpdateLab);
//     }

//     protected onExit(): void {
//         TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell,this,this.onUpdateLab);
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
// }