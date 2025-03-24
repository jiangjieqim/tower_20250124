import { FightValueConfig } from "../../vos/FightValueConfig";
/**传送门 */
export class DoorView{
    private img:Laya.Image = new Laya.Image();
    private sumTime:number = 0;
    // cell:GuideCell;

    constructor(){
        this.img.skin = `remote/fight/0.png`;//`o/door/0.png`;
        this.img.anchorX = this.img.anchorY = 0.5;
        this.img.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.img.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }
    private onDisplay(){
        Laya.timer.frameLoop(1, this, this.onLoop);

    }
    private onUnDisplay(){
        Laya.timer.clear(this,this.onLoop);
    }
    private onLoop() {
        this.sumTime += Laya.timer.delta;
        // if(this._isStop){
        //     return;
        // }
        let ms = FightValueConfig.delayMS;
        if(this.sumTime < ms){  
            return;
        }
        this.sumTime = 0;
        this.img.rotation+=1000/ms;
    }
    setPos(parent:Laya.Sprite,x:number,y:number){
        parent.addChild(this.img);
        this.img.pos(x,y);

        // if(!this.cell){
        //     this.cell = new GuideCell(this.img.parent as Laya.Sprite);
        // }
        // this.cell.pos(x,y);
    }
    dispose(){
        // this.cell.dispose();
        this.img.removeSelf();
    }
}