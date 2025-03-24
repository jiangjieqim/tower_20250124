export class GuideCell{
    private parent:Laya.Sprite;
    constructor(parent:Laya.Sprite){
        this.parent = parent;
    }
    private btn:ButtonCtl;
    private _monsterRect:Laya.Sprite;
    get monsterRect(){
        if(!this._monsterRect){
            this._monsterRect = new Laya.Sprite();
            this._monsterRect.width = 150;
            this._monsterRect.height = 150;
            this.parent.addChild(this._monsterRect);
            DebugUtil.draw(this._monsterRect);
            this.btn = ButtonCtl.CreateBtn(this._monsterRect,this,this.onRectClick,false);
        }
        return this._monsterRect;
    }
    private onRectClick(){
        LogSys.Log("onRectClick");
        // this.dispose();
    }

    dispose(){
        if(this.btn) {
            this.btn.dispose();
        }
        this.monsterRect.removeSelf();
    }
    private convertVal(v:string){
        let x1 = v;
        let n = 1;
        if(x1[0] == "n"){   
            n = -1;
        }
        let s1 = x1.substr(1,x1.length-1);
        return parseInt(s1) * n;
    }
    parse(s0:string,s1:string,s2:string,s3:string){
        let w = parseInt(s2);
        let h = parseInt(s3);
        this.monsterRect.width = w;
        this.monsterRect.height = h;
        // this.monsterRect.hitArea = new Laya.Rectangle(0,0,w,h);
        // this.monsterRect.graphics.drawRect(0,0,w,h,"#ff0000");
        this.btn.setpos(this.convertVal(s0),this.convertVal(s1));
    }

}