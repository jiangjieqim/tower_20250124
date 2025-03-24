
export class SimpleSpineDebug extends Laya.Script {
    skel: Laya.SpineSkeleton;

    private spr: Laya.Sprite = new Laya.Sprite();
    private tf: Laya.Label = new Laya.Label();
    onAwake() {
        // this.spr.graphics.clear();
        // this.spr.graphics.drawRect(0, 0, 100, 20, null, "#00ff00");
        this.tf.color = "#ffffff";
        this.tf.fontSize = 22;
        this.tf.bgColor = "#777777";
        this.tf.alpha = 0.75;
        this.tf.strokeColor = "#000000";
        this.tf.stroke = 2;
        this.tf.pos(0, 20);
        this.spr.addChild(this.tf);
        Laya.timer.loop(1, this, this.onLoop);
    }

    private setPercent(cur: number, max: number) {
        const h: number = 20;
        this.spr.graphics.clear();
        let offset: number = 2;
        this.spr.graphics.drawRect(0, 0, 100, h, null, "#00ff00", offset);
        this.spr.graphics.drawRect(offset, offset, (100 - offset * 2) * (cur / max), h - offset * 2, "#ff0000");
        this.tf && !this.tf.destroyed && (this.tf.text = `${this.skel["_currAniName"]}\n${cur.toFixed(1)}/${max.toFixed(1)}`);
    }

    private onLoop() {
        let targetSpr1 = (this.owner as Laya.Sprite);
        if (!this.spr.parent && targetSpr1 && targetSpr1.parent && targetSpr1.parent.parent) {

            let pos = ((this.skel as Laya.Sprite).parent as Laya.Sprite).localToGlobal(new Laya.Point(this.skel.x, this.skel.y));
            this.spr.pos(pos.x, pos.y);
            Laya.stage.stage.addChild(this.spr);
            // targetSpr1.parent.parent.addChild(this.spr);
        }

        if (this.skel && !this.skel.destroyed) {
            this.setPercent(this.skel['currentPlayTime'], this.skel['_duration']);
        }
        if (!targetSpr1.parent) {
            this.destroy();
        }
    }
    onDestroy() {
        this.tf.destroy();
        this.tf = null;
        this.spr.destroy();
    }
}