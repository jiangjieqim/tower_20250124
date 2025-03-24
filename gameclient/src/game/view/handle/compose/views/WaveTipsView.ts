import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { ComposeModel } from "../ComposeModel";
import { EBattle_Config, t_Battle_Config } from "../t_Battle_Config";
/**波次提醒 */
export class WaveTipsView extends ViewBase{
    private model:ComposeModel;
    private _ui:ui.views.compose.banner1.ui_wave_tipsUI;
    // protected bFightCenter:boolean = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            // this.centerPtr = this.model.fightView;
            this.UI = this._ui = new ui.views.compose.banner1.ui_wave_tipsUI();
        }
    }

    protected SetCenter(){
        super.SetCenter(this.model.fightView);
    }

    // protected SetCenter() {
    //     if (this.UI && !this.UI.destroyed) {
    //         let fightView: IFightMainView = this.model.fightView;
    //         if (fightView) {
    //             let pos: Laya.Point = fightView.getCenterXY();
    //             this.UI.anchorX = this.UI.anchorY = 0.5;
    //             if (pos) {
    //                 this.UI.x = pos.x;
    //                 this.UI.y = pos.y;
    //             } else {
    //                 this.UI.x = this.ViewParent.width >> 1;
    //                 this.UI.y = this.ViewParent.height >> 1;
    //             }
    //         }
    //     }
    // }

    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this._ui.waveTf.text = E.getLang("waveCount",this.Data);
        let ms = t_Battle_Config.Ins.getValueById(EBattle_Config.WaveTipsMs);
        let useTime:number = 0;
        if(StringUtil.IsNullOrEmpty(ms)){
            useTime = 1000;
        }else{
            useTime = parseInt(ms);
        }
        // console.log('.....................',ms);
        Laya.timer.once(useTime,this,this.Close);
    }
}