import { stSubBlood } from "../../../../../network/protocols/BaseProto";
import { ESubBloodType } from "../../vos/ESubBloodType";
import { FightValueConfig } from "../../vos/FightValueConfig";
import { t_Blood_Color } from "../../vos/t_Blood_Color";
import { PercentShape } from "../PercentShape";
import { GuideCell } from "./GuideCell";
import { PercentBarImg } from "./PercentBarImg";

class BloodShape extends PercentShape{
    protected getColor(v:number){
        return t_Blood_Color.Ins.getColor(v);
    }
}

/**血条 */
export class BloodImg extends PercentBarImg{
    guideCell:GuideCell;
    maxValue: number;

    //========================================================
    // private btn:ButtonCtl;
    // private _monsterRect:Laya.Sprite;
    // get monsterRect(){
    //     if(!this._monsterRect){
    //         this._monsterRect = new Laya.Sprite();
    //         this._monsterRect.width = 150;
    //         this._monsterRect.height = 150;
    //         this.addChild(this._monsterRect);
    //         DebugUtil.draw(this._monsterRect);
    //         this.btn = ButtonCtl.CreateBtn(this._monsterRect,this,this.onRectClick);
    //     }
    //     return this._monsterRect;
    // }

    // private onRectClick(){

    // }
    constructor(){
        super();
        this.guideCell = new GuideCell(this);
    }
    //========================================================
    dispose(){
        super.dispose();
        // if(this.btn) {
        // this.btn.dispose();
        // }
        if(this.guideCell){
            this.guideCell.dispose();
        }
    }

    protected createBar(){
        return new BloodShape();
    }
    protected onFrameLoop() {
        if (this.monster) {
            this.x = this.monster.coreSpine.skeleton.x - this.width / 2;

            let offsetY: number;
            if (this.monster.vo.disappearTime > 0) {
                offsetY = FightValueConfig.OffsetBossBloodY;
            } else {
                offsetY = FightValueConfig.OffsetBloodY;
            }
            this.y = this.monster.coreSpine.skeleton.y + offsetY;
            if (!this.parent && this.curParent) {
                this.curParent.addChild(this);
            }
        }else{
            LogSys.Warn("monster is null...");
        }
    }
    
    /**设置扣血值 */
    set setSubData(vo:stSubBlood){
        let cur = vo.value;
        if(vo.type == ESubBloodType.RecoverBlood){
            cur = -cur;
            // LogSys.Log(`....血量回复:${vo.value}`);
        }

        let b = this.monster.vo.curBlood;
        b = b - cur;
        if(b < 0){
            b = 0;
        }else if(b > this.maxValue){
            b = this.maxValue;
        }

        let p = b / this.maxValue;
        if(p > 1){
            p = 1;
        }
        this.percent = p;
        this.monster.vo.curBlood = b;
    }

}