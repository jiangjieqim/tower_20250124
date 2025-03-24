import { ui } from "../../../../../ui/layaMaxUI";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightValueConfig } from "../vos/FightValueConfig";
import { TowerAvatarView } from "./TowerAvatarView";
/**boss倒计时 */
export class BossCutdownView extends ui.views.compose.fightcell.ui_boss_bloodUI {
    monster: TowerAvatarView;
    curParent:Laya.Sprite;
    private model:ComposeModel;
    constructor() {
        super();
        this.model = ComposeModel.Ins;
    }
    init(){
        this.clear();
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
        this.on(Laya.Event.DISPLAY, this, this.onDisplay);
        this.on(Laya.Event.UNDISPLAY, this, this.onUnDisplay);
    }
    private onDisplay() {
        this.model.on(ComposeEvent.Pause,this,this.onPause);
        this.model.on(ComposeEvent.Play,this,this.onPlay);
        this.clear();
        this.onCutDown();
    }

    private onPause(){
        Laya.timer.clear(this, this.onCutDown);
    }
    private onPlay(){
        this.onCutDown();
    }
    private onUnDisplay(){
        this.model.off(ComposeEvent.Pause,this,this.onPause);
        this.model.off(ComposeEvent.Play,this,this.onPlay);
    }
    private clear() {
        this.timeTf.text = "";
    }

    private onCutDown() {
        if (this.parent) {
            let severTime = this.model.curAdapter.clockTimeMs;//TimeUtil.serverTimeMS;
            let sub = this.monster.vo.disappearTime * 1000 - severTime;
            if(sub < 0){
                this.dispose();
                return;
            }
            this.timeTf.text = (sub / 1000).toFixed(1) + "s";
            Laya.timer.once(100, this, this.onCutDown);
        }
    }
    dispose() {
        Laya.timer.clear(this, this.onCutDown);
        Laya.timer.clear(this, this.onFrameLoop);
        this.removeSelf();
        this.curParent = null;
    }

    private onFrameLoop() {
        this.x = this.monster.coreSpine.skeleton.x - this.width / 2;
        this.y = this.monster.coreSpine.skeleton.y + FightValueConfig.OffsetCutDownY;

        if (!this.parent && this.curParent) {
            // ComposeModel.Ins.fightView.bloodCon.addChild(this);
            this.curParent.addChild(this);
        }
    }
}