import { vectorAngle } from "../../avatar/ShootAvatar";
export interface IBulletView extends Laya.Node{
    moveAvatar(startX:number,startY:number,endX:number,endY:number);
    /**弹道飞行需要的时间(毫秒)*/
    flyTime: number;
    /**资源id */
    resId:number;
    /*是否穿透射击 */
    pass:boolean;
}
/**png子弹 */
export class BulletView extends Laya.Image implements IBulletView{
    /**弹道飞行时间 */
    flyTime: number = 0;
    resId:number;
    pass:boolean;
    protected _tween:Laya.Tween;
    private curURL:string;
    constructor(){
        super();
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
    protected startMove(sx:number,sy:number,ex:number,ey:number){ 
        this.x = sx;
        this.y = sy;
        let a = vectorAngle(ex - this.x, ey - this.y, 1, 0);
        this.rotation = a;
        if(this._tween){
            this._tween.clear();
        }else{
            this._tween = new Laya.Tween();
        }
        this._tween.to(this,{x:ex,y:ey},this.flyTime,null,new Laya.Handler(this,this.onMoveEnd));//Laya.Ease.circIn
    }

    /**
     * @param id 
     * @param pet 攻击者
     * @param cur1 被击者
     */
    public moveAvatar(startX:number,startY:number,endX:number,endY:number){
        this.curURL = `o/bullet/${this.resId}.png`;
        Laya.loader.load(this.curURL,new Laya.Handler(this,this.onComplete,[startX,startY,endX,endY]));
    }
    protected onComplete(startX:number,startY:number,endX:number,endY:number){
        this.skin = this.curURL;
        this.startMove(startX, startY, endX, endY);
    }

    protected onMoveEnd(){
        // this.destroy();
        this.dispose();
    }
}