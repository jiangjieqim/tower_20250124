import { FontClipCtl } from "../../avatar/ctl/FontClipCtl";
import { FightValueConfig } from "../vos/FightValueConfig";
import { TowerAvatarView } from "./TowerAvatarView";
/**头部的当前血量美术图集字 */
export class BossBloodTxt extends Laya.Sprite{
    monster: TowerAvatarView;
    curParent: Laya.Sprite;
    private fontCtl:FontClipCtl;
    constructor() {
        super();
        let _fontCtl:FontClipCtl = new FontClipCtl(`remote/fight/bj_`);
        _fontCtl.mScale = 0.75;
        _fontCtl.offsetX = -5;
        this.fontCtl = _fontCtl;
        // this.on(Laya.Event.DISPLAY, this, this.onDisplay);
    }
    init(){
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    }
    private onFrameLoop() {
        if (this.monster && this.monster.coreSpine) {
            let skel = this.monster.coreSpine.skeleton;
            if(skel){
                if(!this.parent && this.curParent){
                    // ComposeModel.Ins.fightView.bloodCon.addChild(this);
                    this.curParent.addChild(this);
                }
                this.x = skel.x;
                this.y = skel.y + FightValueConfig.OffsetBloodTxtY;
            }
        }
    }

    dispose() {
        Laya.timer.clear(this, this.onFrameLoop);
        this.removeSelf();
        this.monster = null;
        this.curParent = null;
    }

    setCurValue(v: number) {
        let s: string = v.toString();
        if (v <= 0) {
            s = "";
        }
        this.fontCtl.setValue(this, s, "middle");
    }
}