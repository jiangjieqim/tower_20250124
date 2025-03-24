import { ui } from "../../../../../ui/layaMaxUI";
import { SmallTipsView } from "../../main/views/SmallTipsView";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { t_Herosummon_Rate } from "../t_Herosummon_Rate";

/**概率视图 */
export class ProbabilityView extends SmallTipsView{
    private model:ComposeModel;
    protected mShowUpdate: boolean = true;
    private skin: ui.views.compose.fightcell.ui_funcard_perUI;
    protected initUI(){
        this.UI = this._ui = this.skin = new  ui.views.compose.fightcell.ui_funcard_perUI();
        this.model = ComposeModel.Ins;
    }
    protected onInit(){
        super.onInit();
        this.model.on(ComposeEvent.WaveUpdate,this,this.updateContent);
    }

    protected onExit(){
        super.onExit();
        this.model.off(ComposeEvent.WaveUpdate,this,this.updateContent);
    }
    protected updateContent(){
        let cfg = t_Herosummon_Rate.Ins.getCfgByWave(this.model.curAdapter.wave,this.model.fightTypeAdaper.mode);
        if (cfg) {
            let arr = cfg.f_chapter.split("|");
            for (let i: number = 0; i < arr.length; i++) {
                let val = parseInt(arr[i]);
                this.skin["lab_g" + i].text = val / 100 + "%";
            }
        }
    }
}