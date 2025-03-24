/**
 * 进度条Shape
 */
export class PercentShape extends Laya.Sprite {
    constructor() {
        super();
    }

    /**
     * 0 ~ 1
     */
    set percent(v: number) {
        if (v <= 0) {
            v = 0.01;
        }
        if(v > 1){
            v = 1;
        }
        let offset: number = 0;
        this.graphics.clear();
        // this.graphics.drawRect(0, 0, (this.allWidth) * v, this.allHeight , null,"#000000",1);

        this.graphics.drawRect(offset, offset, (this.width - offset * 2) * v, this.height - offset * 2, this.getColor(v));
    }
    protected getColor(v: number) {
        return "#FFFF00";
    }

    dispose() {
        this.graphics.clear();
        this.destroy();
    }
}