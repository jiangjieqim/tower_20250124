import { MainModel } from "../../../main/model/MainModel";
import { EFightUIColor } from "../../vos/EFightEnum";
import { FightMoney } from "../FightMoneyShow";

export class CardMoneyCtl {
    tf: Laya.Label;
    itemId: number;
    offsetX: number;
    offsetY: number;
    container: Laya.Sprite;
    private readonly needSub:boolean = false;
    play() {
        Laya.timer.callLater(this,this.onTimerHander);
    }

    private onTimerHander() {
        if(!this.tf){
            LogSys.Warn(`CardMoneyCtl tf is null..`);
            return;
        }
        if(this.tf.destroyed){
            return;
        }
        let id: number = this.itemId;
        let val = MainModel.Ins.mRoleData.getVal(id);
        let _sub: number = val - parseInt(this.tf.text);
        let color: string;
        let sign: string;
        let bSub:boolean = false;
        if (_sub > 0) {
            color = EFightUIColor.White;
            sign = "+"
        } else if (_sub < 0) {
            color = EFightUIColor.Red;
            sign = "-";
            bSub = true;
        }

        if(!this.needSub && bSub){
        
        }else if (!StringUtil.IsNullOrEmpty(sign)) {

            // (id == ECellType.FIGHT_STONE) && (LogSys.Log(`CardMoneyCtl ${id} ${this.tf['$_GID']} ---->${_sub}`));

            FightMoney.show(this.tf, id, Math.abs(_sub), this.offsetX, this.offsetY, color, sign);
            FightMoney.moneyScale(this.container || this.tf);
        }
        this.tf.text = val + "";
    }

    update() {
        let val = MainModel.Ins.mRoleData.getVal(this.itemId);
        // LogSys.Log("update:"+this.itemId +":"+val);
        this.tf.text = val + "";
    }

    dispose(){
        this.tf = null;
    }
}