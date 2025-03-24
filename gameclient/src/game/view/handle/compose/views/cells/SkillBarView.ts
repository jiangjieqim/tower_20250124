import { stSkillBar } from "../../../../../network/protocols/BaseProto";
import { PercentShape } from "../PercentShape";
import { PercentBarImg } from "./PercentBarImg";
/**英雄技能条 */
export class SkillBarView extends PercentBarImg {
    protected createBar() {
        return new PercentShape();
    }

    /**设置技能条的值 */
    setData(vo: stSkillBar) {
        this.percent = vo.percent / 100;
    }

    protected onFrameLoop() {
        let heroSkel: Laya.Sprite = this.monster.coreSpine.skeleton;
        if (heroSkel) {
            if (!this.parent && this.curParent) {
                this.curParent.addChild(this);
            }
            if (heroSkel.parent) {
                let pos = (heroSkel.parent as Laya.Sprite).localToGlobal(new Laya.Point(heroSkel.x, heroSkel.y));
                let layer: Laya.Sprite = this.curParent;
                let offset = (layer.parent as Laya.Sprite).localToGlobal(new Laya.Point(layer.x, layer.y));
                this.pos(pos.x - offset.x - this.allWidth / 2, pos.y - offset.y);
            }
        }
    }
}