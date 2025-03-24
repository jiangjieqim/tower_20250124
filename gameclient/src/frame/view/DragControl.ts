export class DragControl {
    private view: Laya.View;
    // private parentView;
    /**
     * 拖拽控制器
     * @param container 
     */
    constructor() {
    }
    public reg(view: Laya.View) {
        if (view) {
            this.view = view;
            view.hitArea = new Laya.Rectangle(0, 0, view.width, view.height);
            view.on(Laya.Event.MOUSE_DOWN, this, this.onDownHandler);
            view.on(Laya.Event.MOUSE_UP, this, this.onUpHandler);
        }
    }

    public unReg() {
        if (!this.view) {
            return;
        }
        this.view.off(Laya.Event.MOUSE_DOWN, this, this.onDownHandler);
        this.view.off(Laya.Event.MOUSE_UP, this, this.onUpHandler);
    }
    private get getParent() {
        return this.selfP.parent as Laya.Sprite;
    }

    private onDownHandler(e): void {
        // console.log(e);
        // let p = this.getParent;
        // let pos = this.localToGlobal(new Laya.Point(p.x,p.y));
        // console.log(pos);
        //点击的局部坐标
        // let localx = e.stageX - pos.x;
        // let localy = e.stageY - pos.y;
        let selfP:Laya.View = this.selfP;
        selfP.startDrag(new Laya.Rectangle(0, 0, this.getParent.width - selfP.width, 
                        this.getParent.height - selfP.height));
    }
    private get selfP(){
        return this.view.parent as Laya.View;
    }
    private onUpHandler(e): void {
        this.selfP.stopDrag();
    }

}