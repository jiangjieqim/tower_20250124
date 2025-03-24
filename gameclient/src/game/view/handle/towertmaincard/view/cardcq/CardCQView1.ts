import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { TowertMainCardModel } from "../../model/TowertMainCardModel";
import { t_Function_Card_Extract_Rate } from "../../proxy/t_Function_Card_Extract_Rate";
import { CardCQItem1 } from "./CardCQItem1";

class CardCQViewNode extends RowMoveBaseNode{
    protected clsKey:string = "CardCQViewNode";
    protected createNode (index){
        let _skin:ui.views.cardcq.ui_cardCQItemUI = Laya.Pool.getItemByClass(this.clsKey,ui.views.cardcq.ui_cardCQItemUI);
        _skin.img.skin = "remote/cardcq/tx" + this.list[index] + ".png";
        _skin.y = this.y;
        return _skin;
    }
}

class CardCQViewNode1 extends RowMoveBaseNode{
    protected clsKey:string = "CardCQViewNode1";
    protected createNode (index){
        let _skin:ui.views.cardcq.ui_cardCQItem1UI = Laya.Pool.getItemByClass(this.clsKey,ui.views.cardcq.ui_cardCQItem1UI);
        let qua = parseInt(this.list[index].split("-")[0]);
        let ity = parseInt(this.list[index].split("-")[1]) / 100;
        let arr = E.getLang("cardcqlab").split(";");
        _skin.lab.text = E.LangMgr.getLangArr("cardcqlab1",[arr[qua - 1],ity]);
        _skin.x = 5;
        _skin.y = this.y;
        return _skin;
    }
}

class CardCQViewNode2 extends RowMoveBaseNode{
    protected clsKey:string = "CardCQViewNode2";
    protected createNode (index){
        let _skin:CardCQItem1 = Laya.Pool.getItemByClass(this.clsKey,CardCQItem1);
        _skin.setData(this.list[index]);
        _skin.x = index * _skin.width + (index * 15);
        _skin.y = this.y;
        return _skin;
    }
}

export class CardCQView1 extends ViewBase{
    private _ui:ui.views.cardcq.ui_cardCQView2UI;

    protected mMask = true;
    protected mMaskClick: boolean = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _panelCtl: ScrollPanelControl;

    protected onAddLoadRes(): void {
        this.addAtlas("cardcq.atlas");
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.cardcq.ui_cardCQView2UI();
            this.bindClose(this._ui.btn_close);

            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel);
        }
    }

    protected onInit(): void {
        let arr = this.getList();
        this._panelCtl.clear();
        for(let i = 0;i < arr.length;i++){
            if(arr[i].type == 1){
                this._panelCtl.split([arr[i].data],CardCQViewNode,39);
            }else if(arr[i].type == 2){
                this._panelCtl.split([arr[i].data],CardCQViewNode1,24);
            }else if(arr[i].type == 3){
                this._panelCtl.split(arr[i].data,CardCQViewNode2,266,15,4);
            }
        }
        this._panelCtl.end();
        this._ui.img.skin = `remote/cardcq/${TowertMainCardModel.Ins.selectKBId}.png`;
    }

    protected onExit(): void {
        
    }

    private getList(){
        let array = [];
        let arr = t_Function_Card_Extract_Rate.Ins.getListById(TowertMainCardModel.Ins.selectKBId);
        for(let i:number=arr.length - 1;i>=0;i--){
            let vo:any = {};
            vo.type = 1;
            vo.data = arr[i].f_qua;
            array.push(vo);
            let voo:any = {};
            voo.type = 2;
            voo.data = arr[i].f_qua + "-" + arr[i].f_drop_probability;
            array.push(voo);
            let vooo:any = {};
            vooo.type = 3;
            vooo.data = arr[i].f_reward.split("|");
            array.push(vooo);
        }
        return array;
    }
}