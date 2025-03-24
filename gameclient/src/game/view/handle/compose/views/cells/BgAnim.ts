
export class BgAnim {
// extends Laya.Sprite{
    private img:Laya.Image;
    private tw:Laya.Tween;
    private initY:number;
    private readonly ms:number = 2000;
    constructor(img:Laya.Image){
        this.img = img;
        // super();
        this.tw = new Laya.Tween();
        // this.img = new GameTex();
        // this.img.skin = `remote/fight/db1.png`;
        // this.img.anchorX = this.img.anchorY = 0.5;
        // this.addChild(this.img);
    }
    
    setPos(ox:number,oy:number){
        // parent.addChildAt(this.img,index);
        this.img.x = ox;
        this.img.y = oy;
        this.initY = oy;
        this.startPlay();
    }
    private startPlay(){
        this.tw.to(this.img,{y:this.initY + 25},this.ms,null,new Laya.Handler(this,this.onCompleteHandler));
    }
    private onCompleteHandler(){
        this.tw.to(this.img,{y:this.initY},this.ms,null,new Laya.Handler(this,this.startPlay));
    }

    dispose(){
        if(this.tw){
            this.tw.clear();
        }
        // this.img.dispose();
    }
}