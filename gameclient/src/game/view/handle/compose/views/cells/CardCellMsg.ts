// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { ESystemRefreshTime } from "../../../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../../../main/ctl/System_RefreshTimeProxy";
import { ComposeModel } from "../../ComposeModel";
import { CardMsgVo } from "../../vos/CardMsgVo";
import { CardCellMsgCtl } from "./CardCellMsgCtl";
import { CardMsgView } from "./CardMsgView";
/**功能卡弹幕cell */
export class CardCellMsg extends ui.views.compose.fightcell.ui_card_cell_msgUI{
    static CLS_KEY:string = "CardCellMsg";
    curIndex:number;
    view:CardMsgView;
    private cellCtl:CardCellMsgCtl;
    private vo:CardMsgVo;
    private btn:ButtonCtl;
    private readonly hideTime:number = 1000;
    private tw:Laya.Tween = new Laya.Tween();
    private model:ComposeModel;
    constructor(){
        super();
        this.cellCtl = new CardCellMsgCtl(this);
        this.model = ComposeModel.Ins;
    }

    setData(vo: CardMsgVo) {
        this.disposeBtn();
        this.vo = vo;
        this.alpha = 1.0;
        this.tw.clear();
        let waittime = System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.MsgWaitTime);
        Laya.timer.once(parseInt(waittime), this, this.onWait);
        this.cellCtl.refresh(vo);
    }

    private onWait(){
        if(this.vo.hideTime){
            Laya.timer.frameLoop(1,this,this.onCheckHide);
        }else{
            this.onStartHide();
        }
    }

    private onCheckHide(){
        let sub =this.vo.hideTime - this.model.curAdapter.clockTimeMs;
        // LogSys.Log(`CardCellMsg sub:${sub}`);
        if(sub < 0 ){
            this.dispose();
        }       
    }

    private onStartHide(){
        this.tw.to(this,{alpha:0},this.hideTime);
        Laya.timer.once(this.hideTime,this,this.dispose);
    }

    private disposeBtn(){
        if(this.btn){
            this.btn.dispose();
            this.btn = null;
        }
    }
    private dispose(){
        Laya.timer.clear(this,this.onCheckHide);
        this.disposeBtn();
        this.removeSelf();
        Laya.Pool.recover(CardCellMsg.CLS_KEY,this);
        this.view.layoutView();
    }
}
