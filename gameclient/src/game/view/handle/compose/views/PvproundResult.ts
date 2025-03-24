import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { ComposeModel } from "../ComposeModel";
import { t_Battle_Config } from "../t_Battle_Config";
export interface IPvproundResult {
    oldVal: number;
    newVal: number;
    max:number;
}
/**pvp回合制结算 */
export class PvproundResult extends ViewBase {
    protected autoFree: boolean = true;
    private _ui: ui.views.compose.ui_pvpround_resultUI;
    private _data: IPvproundResult;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("pvproundresult.atlas")
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.ui_pvpround_resultUI();
            // this.centerPtr = this.model.fightView;
        }
    }
    protected SetCenter(){
        super.SetCenter(this.model.fightView);
    }
    private get model(){
        return ComposeModel.Ins;
    }
    protected onInit(): void {
        let time: number = parseInt(t_Battle_Config.Ins.getValueById(73));
        Laya.timer.once(time, this, this.Close);
        if (this.Data) {
            this._data = this.Data;
            let win: number = 1;
            if (this._data.newVal < this._data.oldVal) {
                win = 0;//失败
            }
            this._ui.bg0.skin = `remote/pvproundresult/bottom${win}.png`;
            this._ui.bg1.skin = `remote/pvproundresult/title${win}.png`;
            this._ui.waveTf.text = E.getLang(`waveCount`,this.model.curAdapter.wave);
            let herart = this._ui.herart;
            herart.maxHp = this._data.max;
            herart.value = this._data.newVal;
            herart.centerLayoutX();
            if(win == 0){
                herart.playBroken(this._data.oldVal-1);
            }
        }
    }
}