import { ui } from "../../../../../ui/layaMaxUI";
import { IconUtils } from "../../main/model/IconUtils";

class MoneyCellAnimUI extends ui.views.compose.fightcell.ui_money_cell_animUI {
    static CLS_KEY: string = "FightMoneyShow";
    private tween:Laya.Tween;
    constructor() {
        super();
        this.tween = new Laya.Tween();
    }
    setData(itemId: number, count: number,color:string="#fffff",sign:string = "+") {
        this.icon.skin = IconUtils.getIcon(itemId);
        this.tf.text = `${sign}${count}`;
        this.tf.color = color;
        // let tween: Laya.Tween = new Laya.Tween();
        let targetY: number = this.y - 50;
        this.tween.clear();
        this.tween.to(this, { y: targetY }, 500, null, new Laya.Handler(this, this.onEnd));
    }

    private onEnd() {
        this.removeSelf();
        Laya.Pool.recover(MoneyCellAnimUI.CLS_KEY, this);
    }
}

class ImageEffect extends Laya.Image {
    static CLS_KEY: string = "ImageEffect";
    private tween: Laya.Tween;
    constructor() {
        super();
        this.tween = new Laya.Tween();
    }
    play() {
        let targetY: number = this.y - 50;
        this.tween.to(this, { y: targetY }, 500, null, new Laya.Handler(this, this.onEnd));
    }
    private onEnd() {
        this.removeSelf();
        Laya.Pool.recover(ImageEffect.CLS_KEY, this);
    }
}

/**缩放特效 */
class MoneyScale {
    static CLS_KEY: string = "MoneyScale";
    private twScale: Laya.Tween;
    private container: Laya.Sprite;
    private readonly USE_TIME: number = 50;
    constructor(){
        // LogSys.Log(`new MoneyScale...`);
    }
    show(container: Laya.Sprite) {
        this.container = container;
        if (!this.twScale) {
            this.twScale = new Laya.Tween();
        }
        let _s: number = 0.75;
        this.twScale.to(this.container, { scaleX: _s, scaleY: _s }, this.USE_TIME, null, new Laya.Handler(this, this.onMoneyScaleHandler));
    }
    private onMoneyScaleHandler() {
        this.twScale.to(this.container, { scaleX: 1.0, scaleY: 1.0 }, this.USE_TIME, null, new Laya.Handler(this, this.onPlayEnd));
    }
    private onPlayEnd() {
        Laya.Pool.recover(MoneyScale.CLS_KEY, this);
    }
}

export class FightMoney {

    /**飘一个道具消耗动画 */
    static show(con: Laya.Sprite, itemId: number, count: number, offsetX: number = 0, offsetY: number = 0,color:string="#ffffff",sign:string="+") {
        
        let itemView = Laya.Pool.getItemByClass(MoneyCellAnimUI.CLS_KEY, MoneyCellAnimUI);
        itemView.x = offsetX;
        itemView.y = offsetY;
        itemView.setData(itemId, count,color,sign);
        con.parent.addChild(itemView);
    }

    static moneyScale(spr: Laya.Sprite) {
        let itemView = Laya.Pool.getItemByClass(MoneyScale.CLS_KEY, MoneyScale);
        itemView.show(spr);
    }

    /**赌博显示输赢特效 */
    // static showGamble(con: Laya.Sprite,succeed:boolean,offsetX: number = 0, offsetY: number = 0){
    //     let itemView = Laya.Pool.getItemByClass(ImageEffect.CLS_KEY, ImageEffect);
    //     if(succeed){
    //         itemView.skin = `remote/fight/tx_cg.png`;
    //     }else{
    //         itemView.skin = `remote/fight/tx_sb.png`;
    //     }
    //     itemView.x = offsetX;
    //     itemView.y = offsetY;
    //     con.addChild(itemView);
    //     itemView.play();
    // }
    /**销毁资源 */
    static releaseRes(){
        Laya.Pool.clearBySign(MoneyScale.CLS_KEY);
        Laya.Pool.clearBySign(MoneyCellAnimUI.CLS_KEY);
        Laya.Pool.clearBySign(ImageEffect.CLS_KEY);
    }
}
