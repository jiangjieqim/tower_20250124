export class LabelFly extends Laya.Label{
    static CLS_KEY:string = "LabelFly";
    private tween:Laya.Tween;
    constructor(){
        super();
        this.tween = new Laya.Tween();
        this.font = "BOLD";
        this.fontSize = 18;
        this.color = "#ffffff";
        this.stroke = 1;
        this.strokeColor = "#000000";
    }
    fly(container:Laya.Sprite,str:string){
        container.addChild(this);
        this.y = 0;
        this.text = str;
        this.tween.to(this,{y:-50},500,null,new Laya.Handler(this,this.onDispose));
    }
    private onDispose(){
        this.removeSelf();
        Laya.Pool.recover(LabelFly.CLS_KEY,this);
    }
}