export class IceEffect {
    private img: Laya.Image;
    isDestory:boolean = false;
    constructor(url: string) {
        this.img = new Laya.Image(url);
        this.img.anchorX = this.img.anchorY = 0.5;
    }
    play(index: number, loop?: boolean, target?, callBack?:Function, args?,force?:boolean){
        
    }
    dispose() {
        this.isDestory = true;
        if (this.img) {
            this.img.destroy();
            this.img = null;
        }
    }

    setPos(x: number, y: number) {
        this.img.x = x;
        this.img.y = y;
    }

    setParent(parent:Laya.Sprite){
        parent.addChild(this.img);
    }

    stop(){
        
    }
}