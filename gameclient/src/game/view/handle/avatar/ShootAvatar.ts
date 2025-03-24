import { AnimConfig } from "../../../../InitConfig";
import { AvatarView } from "./AvatarView";

/**
 * 二维向量归一化
 * @param x
 * @param y
 */
function normalize(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
}
function Rad2Deg(radian: number): number {
    return Laya.Utils.toAngle(radian);
}
function dot(x1: number, y1: number, x2: number, y2: number){
    let len1 = normalize(x1,y1);
    let len2 =  normalize(x2,y2);
    x1/=len1;
    y1/=len1;

    x2/=len2;
    y2/=len2;

    let d = x1*x2 + y1*y2;
    return d;
}
/**
    * 返回两向量夹角
    * @param x1
    * @param y1
    * @param x2
    * @param y2
    */
export function vectorAngle(x1: number, y1: number, x2: number, y2: number): number {
    if (x1 == x2 && y1 == y2) {
        return;
    }
    var cosAngle = (x1 * x2 + y1 * y2) / (normalize(x1, y1) * normalize(x2, y2));
    var aCosAngle = Math.acos(cosAngle);
    var angle = Rad2Deg(aCosAngle);

    let d1 = dot(x1, y1, x2, y2);
    let d2 = dot(x1, y1, 0, -1);
    // console.log('dot:', d1, d2);
    if (d1 > 0 && d2 > 0 || d1 < 0 && d2 > 0) {
        angle = -angle;
    }
    return angle;
}

/**子弹对象 */
export class ShootAvatar extends Laya.Image{
    /**抬手结束到射击到对象的时间(毫秒) 0.46666666865348816*/
    public static ShootTime:number = 466;
    private _avatar;
    private get flyTime():number{
        return ShootAvatar.ShootTime / AnimConfig.AnimScale;
    }
    private _tween:Laya.Tween;
    private curURL:string;
    private readonly OFFSET_Y:number = 0;
    private ox:number;
    private oy:number;
    constructor(){
        super();
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }

    // public move(id:number,sx:number,sy:number,ex:number,ey:number){
    //     // this.once(Laya.Event.COMPLETE,this,()=>{})
    //     this.skin = `o/bullet/${id}.png`;
    //     this.startMove(sx,sy,ex,ey);
    // }
    private addDebugShoot(sx:number,sy:number,a){
        if(debug){
            let sp = new Laya.Image();
            sp.x = sx;
            sp.y = sy;
            sp.anchorX = sp.anchorY = 0.5;  sp.rotation = a;
            sp.skin = this.curURL;
            let sk = new Laya.Sprite();
            sp.addChild(sk);
            sk.graphics.drawRect(0,0,sp.width,sp.height,null,"#ff0000");
            this._avatar.parent.addChild(sp);
        
            let sp1 = new Laya.Sprite();
            sp1.x = sx;
            sp1.y = sy;
            sp1.graphics.drawCircle(0,0,5,null,"#ff0000");
            this._avatar.parent.addChild(sp1);
        }
    }
    private startMove(sx:number,sy:number,ex:number,ey:number){
        this.x = sx;
        this.y = sy;
        let a = vectorAngle(ex - this.x, ey - this.y, 1, 0);
        this.rotation = a;
        if(this._tween){
            this._tween.clear();
        }else{
            this._tween = new Laya.Tween();
        }
        this._tween.to(this,{x:ex,y:ey},this.flyTime,null,new Laya.Handler(this,this.onCompleteHander));//Laya.Ease.circIn
        // this.addDebugShoot(sx,sy,a);
    }

    /**
     * 
     * @param id 
     * @param pet 攻击者
     * @param cur1 被击者
     * @param ox 
     * @param oy 
     */
    public moveAvatar(id:number,pet:Laya.Sprite,cur1:Laya.Sprite,ox:number = 0,oy:number = 0){
        this.ox = ox;
        this.oy = oy;
        let shoot = Laya.Utils.getQueryString("shootres");
        if(shoot){
            id = parseInt(shoot);
        }
        this.curURL = `o/bullet/${id}.png`;
        Laya.loader.load(this.curURL,new Laya.Handler(this,this.onComplete,[pet,cur1]));
    }
//#region onCompleteHandler
    private onComplete(avatar:AvatarView,cur1:AvatarView){
        this.skin = this.curURL;
        let ox:number = 0;
        let oy:number = 0;
        // let posType:number = 0;
        // let pos:string;
        // if(avatar.vo instanceof stFightRole || avatar.vo && typeof avatar.vo.pos == "number"){
        //     let avatarVo:stFightRole = avatar.vo as stFightRole;
        //     posType = avatarVo.pos;
        //     // Enemy_ImageProxy.Ins.getCfg(avatarVo.)
        // }
        // if(StringUtil.IsNullOrEmpty(pos)){
        //     pos = "100|100";
        // }
        // if(pos){
        //     let arr = pos.split("|");
        //     ox = parseInt(arr[0]);
        //     oy = parseInt(arr[1]);
        // }
        // let a:number = 1;
        // if(posType == AvatarFactory.POS_RIGHT_PET){
        // if(posType > AvatarConfig.LeftPosMax){
        // a = -1;
        // }

        let bulletX: number = ox;
        let bulletY: number = oy;
        this._avatar = avatar;
        this.startMove(avatar.x + bulletX, avatar.y + bulletY, cur1.x + this.ox, cur1.y - this.OFFSET_Y + this.oy);
    }
//#endregion 

    private onCompleteHander(){
        // this.dispose();
        // this.removeSelf();
        this.destroy();
    }
}