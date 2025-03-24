import { ui } from "../../../../../ui/layaMaxUI";
import { FightUtils } from "../FightUtils";
import { EMonsterPos } from "../vos/FightValueConfig";
class ShowselItemUI extends ui.views.compose.ui_showsel_itemUI {
    constructor() {
        super();
    }
}
/**顶部拖拽显示组件 */
export class TopDragYellowView extends Laya.Sprite {
    endIsoX:number = 0;//目标isoX
    endIsoY:number = 0;//目标isoY
    private readonly lineWidth:number = 7;//线段宽度
    private readonly curColor:string = "#ffff00";
    private readonly sectionLen:number = 20;//虚线间隔长度
    // private _yellow: Laya.Sprite;//拖拽黄圈
    private _showselItem: ShowselItemUI;
    private _lineSpr: Laya.Sprite;
    // private model:ComposeModel;
    constructor() {
        super(); 
        // this.model = ComposeModel.Ins;
/*
        this._yellow = new Laya.Sprite();
        this._yellow.graphics.drawCircle(0, 0, ComposeConfig.cellW / 2 * 1.5, null, this.curColor, this.lineWidth);
        this._yellow.graphics.drawCircle(0, 0, ComposeConfig.cellW * 2, "#00000077");
        this._yellow.alpha = 0.5;
 */       
        this._showselItem = new ShowselItemUI();
        this._lineSpr = new Laya.Sprite();
    }
/*
    showYellow(curIsoX:number,curIsoY:number){
        if (!this._yellow.parent) {
            this.addChild(this._yellow);
        }
        let owner:EMonsterPos = EMonsterPos.Owner;
        let sx: number = FightUtils.IsoxToPosX(curIsoX);
        let sy: number = FightUtils.IsoyToPosY(curIsoY,owner);
        this._yellow.x = sx;
        this._yellow.y = sy;
    }
*/
    onMove(curIsoX: number, curIsoY: number, mIsoX: number, mIsoY: number) {
        let owner:EMonsterPos = EMonsterPos.Owner;
        let sx: number = FightUtils.IsoxToPosX(curIsoX);
        let sy: number = FightUtils.IsoyToPosY(curIsoY,owner);
        // if (mIsoX >= 0 && mIsoX <= ComposeConfig.mapW - 1 && mIsoY >= 0 && mIsoY <= ComposeConfig.mapH - 1) {
        if(FightUtils.isOwnerCanMove(mIsoX,mIsoY)){
            if (!this._showselItem.parent) {
                this.addChild(this._showselItem);
            }
            // console.log(`onMove----> x ${mIsoX} y ${mIsoY}`);
            let endX: number = FightUtils.IsoxToPosX(mIsoX);
            let endY: number = FightUtils.IsoyToPosY(mIsoY, owner);
            this._showselItem.x = endX;
            this._showselItem.y = endY;
            this.endIsoX = mIsoX;
            this.endIsoY = mIsoY;
            this.drawBrokenLine(sx, sy, endX, endY);
        }
    }

    //#region 绘制虚线
    /** 
     a(sx,sy)
        \
         \
          \
           \
           b(endX,endY)
    */
    private drawBrokenLine(sx: number, sy: number, endX: number, endY: number) {
        if (!this._lineSpr.parent) {
            this.addChild(this._lineSpr);
        }
        FightUtils.drawBrokenLine(this._lineSpr, sx, sy, endX, endY, this.sectionLen, this.curColor, this.lineWidth);
    }
    //#endregion
    clear(source:string) {
        // LogSys.Log(`clear source:${source}`);
        this._showselItem.removeSelf();
        this._lineSpr.graphics.clear();
        this._lineSpr.removeSelf();
        // this.model.fightView.bottomGridLayer.removeSelf();
    }

    get isInStage(){
        return this._showselItem && this._showselItem.parent;
    }
}