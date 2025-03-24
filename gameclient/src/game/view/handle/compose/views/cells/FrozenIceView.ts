import { ComposeConfig } from "../../ComposeConfig";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { IDelEffectCardUid } from "../../vos/EFightEnum";
import { EMonsterPos } from "../../vos/FightValueConfig";
// import { GuideCell } from "./GuideCell";

/**冰块大图层 */
export class FrozenIceView extends Laya.Image {
    private model: ComposeModel;
    uid:number;
    playerId:number;
    private owner: EMonsterPos;
    // cell:GuideCell;
    constructor(owner: EMonsterPos) {
        super();
        // this.cell = new GuideCell(this);
        this.owner = owner;
        this.model = ComposeModel.Ins;
        this.skin = `static/frozen.png`;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.x = ComposeConfig.cellW * 4;
        this.layout();
        // ComposeEvent.DelEffectCardUid

        this.on(Laya.Event.DISPLAY, this, this.onDisplay);
        this.on(Laya.Event.UNDISPLAY, this, this.onUnDisplay);
    }

    private onDisplay() {
        this.model.on(ComposeEvent.DelEffectCardUid, this, this.onDelEffectCardUid);        
    }

    layout(){
        let owner = this.owner;
        if (owner == EMonsterPos.Owner) {
            this.scaleX = -1;
            this.y = ComposeConfig.cellH * 2 + 25;
        } else if (owner == EMonsterPos.OtherPlayer) {
            this.y = -ComposeConfig.cellH * 2 + this.model.fightTypeAdaper.offset_ISO_Y * ComposeConfig.cellH - 50;
        }
    }

    private onDelEffectCardUid(obj:IDelEffectCardUid) {
        if(obj.cardSerialNum == this.uid && this.playerId == obj.playerId){
            this.hide();
        }
    }
    private onUnDisplay() {
        this.model.off(ComposeEvent.DelEffectCardUid, this, this.onDelEffectCardUid);
    }
    hide() {
        this.removeSelf();
    }
}