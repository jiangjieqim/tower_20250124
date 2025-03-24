export class MProgressSkin extends Laya.Sprite{
    constructor(w = 200,h=20){
        super();
        this.width = w;
        this.height = h;
        this.graphics.drawRect(0,0,w,h,"#ff0000","#00ff00",2);
    }

    public set value(v:number){
        this.graphics.clear();
        this.graphics.drawRect(0,0,this.width * v,this.height,"#ff0000");
        this.graphics.drawRect(0,0,this.width,this.height,null,"#00ff00",2);
    }
}