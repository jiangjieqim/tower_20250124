export class PlayPieDebug extends Laya.Script {
    private tf: Laya.Label;
    private img: Laya.Image;
    onAwake() {
        this.img = this.owner as any;
    }
    updateView(sub: number) {
        if (!this.tf) {
            this.tf = new Laya.Label();
            this.tf.color = "#ff0000";
            this.tf.y = -22;
            this.tf.strokeColor = "#000000";
            this.tf.stroke = 1;
            this.tf.fontSize = 22;
            if(this.img){
                this.img.parent.addChild(this.tf);
            }
        }
        this.tf.text = (sub / 1000).toFixed(2) + "";
    }
    onDestroy(){
        this.tf.removeSelf();
    }
}